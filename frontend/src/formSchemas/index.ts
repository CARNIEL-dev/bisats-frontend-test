import { PriceData } from "@/pages/wallet/Assets";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import {
  characterLength,
  lowerCaseRegex,
  numberRegex,
  specialCharcterRegex,
  upperCaseRegex,
} from "@/utils/passwordChecks";
import * as Yup from "yup";

import Decimal from "decimal.js";

const toSafeDecimal = (value: unknown) => {
  if (value === null || value === undefined) return new Decimal(0);
  if (typeof value === "string" && value.trim() === "") return new Decimal(0);

  try {
    return new Decimal(value as any);
  } catch (error) {
    return new Decimal(0);
  }
};

//SUB: Auth
const SignupSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match") // Make sure null is allowed here if needed
    .required("Confirm password is required"),
  agreeToTerms: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Enter your old password"),
  newPassword: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const VerificationSchema = Yup.object().shape({
  code: Yup.string().length(6).required("Code is required"),
});
const EmailSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
});

const PhoneSchema = Yup.object().shape({
  phone: Yup.string().required("Phone number is required"),
});
const BVNSchema = Yup.object().shape({
  bvn: Yup.string()
    .required("BVN is required")
    .length(11, "BVN must be 11 digits"),
});
const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(characterLength)
    .required(),
});

//HDR: Swap Schema
const swapSchema = Yup.object().shape({
  // SUB: Amount
  amount: Yup.number()
    .transform((_, originalValue) =>
      originalValue === "" || isNaN(originalValue)
        ? undefined
        : Number(originalValue)
    )
    //? only apply these rules when we're focused on amount:
    .when("$focusedField", {
      is: (f: string) => f === "amount",
      then: (schema) =>
        schema
          .required("Amount is required")
          .moreThan(0, "Amount must be greater than 0")
          .test(
            "min-wallet-balance",
            "Insufficient wallet balance",
            function (value) {
              const { walletState, type, adDetail } = this.options
                .context as any;
              const asset = adDetail.asset ?? "USDT";

              const balVal =
                type === "sell"
                  ? walletState.wallet?.[asset]
                  : walletState.wallet?.xNGN;
              return typeof value === "number" ? value <= balVal : false;
            }
          )
          .test(
            "max-ads-balance",
            "Available amount exceeded",
            function (value) {
              const { adDetail, type } = this.options.context as any;
              const adsBal =
                type === "sell"
                  ? adDetail.amountAvailable / adDetail.price
                  : adDetail.amountAvailable.toFixed(4);

              const amountVal =
                type === "sell" ? value : value / Number(adDetail.price);
              return typeof amountVal === "number"
                ? amountVal <= Number(adsBal)
                : false;
            }
          ) //? Lower limit check
          .test(
            "min-lower-limit",
            "Amount is less than the lower limit",
            function (value) {
              const { adDetail, type } = this.options.context as any;
              const minLimit =
                type === "sell"
                  ? Number(adDetail.minimumLimit) / Number(adDetail.price)
                  : Number(adDetail.minimumLimit);

              return minLimit <= value;
            }
          )
          //? Upper limit check
          .test(
            "max-lower-limit",
            "Amount is greater than the upper limit",
            function (value) {
              const { adDetail, type } = this.options.context as any;

              const maxLimit =
                type === "sell"
                  ? Number(adDetail.maximumLimit) / Number(adDetail.price)
                  : Number(adDetail.maximumLimit);

              return maxLimit >= value;
            }
          ),
      otherwise: (schema) =>
        //? no validation (and clear out the field) when not focused
        schema.transform(() => undefined).notRequired(),
    }),

  // SUB: Other amount
  otherAmount: Yup.number()
    .transform((_, originalValue) =>
      originalValue === "" || isNaN(originalValue)
        ? undefined
        : Number(originalValue)
    )
    // only validate when the otherAmount field is focused
    .when("$focusedField", {
      is: (f: string) => f === "otherAmount",
      then: (schema) =>
        schema
          .required("Amount is required")
          .moreThan(0, "Amount must be greater than 0")
          //? wallet‐balance check
          .test(
            "min-wallet-balance",
            "Insufficient wallet balance",
            function (value) {
              const { walletState, adDetail, type } = this.options
                .context as any;
              const asset = adDetail.asset;
              const assetBalance = walletState.wallet?.[asset];
              const balVal =
                type.toLowerCase() === "buy"
                  ? assetBalance
                  : assetBalance * adDetail.price;
              return typeof value === "number" ? value <= balVal : false;
            }
          )
          //? ad‐availability check
          .test(
            "max-ads-balance",
            "Available amount exceeded",
            function (value) {
              const { adDetail, type } = this.options.context as any;
              const price = Number(adDetail.price);
              const adsBal =
                type === "sell"
                  ? adDetail.amountAvailable / adDetail.price
                  : adDetail.amountAvailable;
              const amountVal =
                type.toLowerCase() === "buy" ? value : value / price;
              return typeof amountVal === "number"
                ? amountVal <= adsBal
                : false;
            }
          )
          //? Lower limit check
          .test(
            "min-lower-limit",
            "Amount is less than the lower limit",
            function (value) {
              const adDetail = this.options?.context?.adDetail as AdsType;

              const val =
                adDetail.orderType.toLowerCase() === "buy"
                  ? (value * adDetail.price).toFixed(2)
                  : value;

              const minLimit = Number(adDetail.minimumLimit);

              return minLimit <= Number(val);
            }
          )
          //? Upper limit check
          .test(
            "max-lower-limit",
            "Amount is greater than the upper limit",
            function (value) {
              const adDetail = this.options?.context?.adDetail as AdsType;

              const val =
                adDetail.orderType.toLowerCase() === "buy"
                  ? (value * adDetail.price).toFixed(2)
                  : value;

              const maxLimit = Number(adDetail.maximumLimit);

              return maxLimit >= Number(val);
            }
          ),
      otherwise: (schema) =>
        // clear/skip validation when not focused
        schema.transform(() => undefined).notRequired(),
    }),
});

// HDR: Ads Schema
const AdSchema = Yup.object().shape({
  type: Yup.string().required("Transaction type is required"),
  asset: Yup.string()
    // .oneOf(["BTC", "USDT", "SOL", "ETH"])
    .required("Select an asset"),
  priceType: Yup.string().required("Pricing type is required"),
  currency: Yup.string().required("Currency selection is required"),
  price: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || isNaN(originalValue)) return undefined;
      return Number(originalValue);
    })
    .when(["asset", "$liveRate"], ([assetValue, liveRate], schema) => {
      const rate = liveRate[assetValue as keyof PriceData];
      const minPrice = 0.9 * Number(rate ?? 0);
      const maxPrice = 1.1 * Number(rate ?? 0);

      return schema
        .min(minPrice ?? 1450, `Price must be greater than 90% of market rate`)
        .max(maxPrice ?? 1700, `Price must be lower than 110% of market rate`)
        .required("Price is required");
    }),
  amount: Yup.number()
    .transform((v, o) => (o === "" || isNaN(o as any) ? undefined : Number(o)))
    .when("type", {
      is: (val: string) => val.toLowerCase() === "sell",
      then: (schema) => schema.transform(() => undefined).notRequired(),
      otherwise: (schema) =>
        schema
          .required("Amount is required")
          .moreThan(0, "Amount must be greater than 0")
          .test("transaction-limit-and-balance", function (value) {
            // Get all needed values from context/parent
            const { type, asset } = this.parent;
            const {
              userTransactionLimits,
              walletData,
              isEditMode,
              amountAvailable,
            } = this.options.context as any;
            const typeLower = String(type ?? "").toLowerCase();
            const amountDecimal = toSafeDecimal(value);

            //? 1. Check maximum transaction limit (for buy orders)
            if (typeLower === "buy") {
              const maxLimitDecimal = toSafeDecimal(
                userTransactionLimits?.maximum_ad_creation_amount
              );

              if (amountDecimal.gt(maxLimitDecimal)) {
                return this.createError({
                  message: `Amount must not exceed ${formatNumber(
                    maxLimitDecimal.toNumber()
                  )} xNGN`,
                });
              }
            }

            //? 2. Check wallet balance

            const walletBaseDecimal =
              typeLower === "buy"
                ? toSafeDecimal(walletData?.xNGN)
                : toSafeDecimal(walletData?.[asset]);

            const editAllowanceDecimal = isEditMode
              ? toSafeDecimal(amountAvailable)
              : new Decimal(0);

            const walletBalDecimal = walletBaseDecimal.plus(
              editAllowanceDecimal
            );

            if (amountDecimal.gt(walletBalDecimal)) {
              return this.createError({
                message: `Amount cannot exceed your wallet balance of ${formatNumber(
                  walletBalDecimal.toNumber()
                )} xNGN`,
              });
            }

            return true;
          }),
    }),
  amountToken: Yup.number()
    .transform((v, o) => (o === "" || isNaN(o as any) ? undefined : Number(o)))
    .when("type", {
      is: (val: string) => val.toLowerCase() === "buy",
      then: (schema) => schema.transform(() => undefined).notRequired(),
      otherwise: (schema) =>
        schema
          .required("Token amount is required")
          .moreThan(0, "Token amount must be greater than 0")
          .test("token-validation", function (value) {
            const { type, asset } = this.parent;
            const {
              liveRate,
              userTransactionLimits,
              walletData,
              isEditMode,
              amountAvailable,
            } = this.options.context as any;

            const typeLower = String(type ?? "").toLowerCase();
            const amountDecimal = toSafeDecimal(value);

            // 1. Minimum amount check
            // if (numericValue <= 0) {
            //   return this.createError({
            //     message: "Token amount must be greater than 0",
            //   });
            // }

            // 2. Maximum token limit (NGN converted to tokens)
            if (typeLower === "sell") {
              const tokenRateDecimal = toSafeDecimal(
                liveRate[asset as keyof PriceData]
              );
              const maxNairaLimitDecimal = toSafeDecimal(
                userTransactionLimits?.maximum_ad_creation_amount
              );
              const maxTokenValueDecimal = tokenRateDecimal.gt(0)
                ? maxNairaLimitDecimal.div(tokenRateDecimal)
                : new Decimal(0);

              if (amountDecimal.gt(maxTokenValueDecimal)) {
                return this.createError({
                  message: `Amount must not exceed ${maxTokenValueDecimal
                    .toDecimalPlaces(5)
                    .toString()} ${asset} (xNGN${formatNumber(
                    maxNairaLimitDecimal.toNumber()
                  )} limit)`,
                });
              }
            }

            // 3. Wallet balance check
            const walletBalanceDecimal = toSafeDecimal(walletData?.[asset]);
            const editAllowanceDecimal = isEditMode
              ? toSafeDecimal(amountAvailable)
              : new Decimal(0);
            const walletBalDecimal = walletBalanceDecimal.plus(
              editAllowanceDecimal
            );

            if (amountDecimal.gt(walletBalDecimal)) {
              return this.createError({
                message: `Insufficient balance (Available: ${walletBalDecimal
                  .toDecimalPlaces(5)
                  .toString()} ${asset})`,
              });
            }

            return true;
          }),
    }),
  minimumLimit: Yup.number()

    .max(23000000, "Price must not exceed 23,000,000 xNGN")
    .when(
      ["type", "$userTransactionLimits"],
      ([type, userTransactionLimits], schema) => {
        const limit =
          type.toLowerCase() === "buy"
            ? userTransactionLimits?.lower_limit_buy_ad
            : userTransactionLimits?.lower_limit_sell_ad;

        return schema.min(
          limit,
          `Minimum must be greater than ${formatter({ decimal: 0 }).format(
            limit
          )} xNGN`
        );
      }
    )
    .required("Minimum is required"),

  maximumLimit: Yup.number()
    .when(["minimumLimit", "amount", "amountToken"], ([minimumLimit], schema) =>
      schema.min(
        Number(minimumLimit) + 1,
        "Maximum must be greater than Minimum"
      )
    )
    .when(
      [
        "type",
        "amount",
        "amountToken",
        "asset",
        "$walletData",
        "$liveRate",
        "$userTransactionLimits",
      ],
      (
        [
          type,
          amount,
          amountToken,
          assetValue,
          walletData,
          liveRate,
          userTransactionLimits,
        ],
        schema
      ) => {
        const limit =
          type.toLowerCase() === "buy"
            ? userTransactionLimits?.upper_limit_buy_ad
            : userTransactionLimits?.upper_limit_sell_ad;

        const escrowAmount =
          type.toLowerCase() === "buy" ? amount : amountToken;

        // const walletBalance = Number(walletData?.xNGN || 0)

        const tokenRate = liveRate[assetValue as keyof Prices];

        const tokenValue = (Number(tokenRate) * Number(escrowAmount)).toFixed(
          2
        );

        const computedMax = Math.min(
          limit || Infinity,
          type.toLowerCase() === "sell" ? parseFloat(tokenValue) : escrowAmount
        );

        return schema.max(
          computedMax,
          `Maximum must not exceed ₦${formatNumber(
            computedMax
          )} equivalent to your escrow`
        );
      }
    )
    // .test(
    //   "max-greater-than-upper",
    //   "Maximum must be greater than upper price limit",
    //   function (value) {
    //     const { priceUpperLimit } = this.parent;
    //     return Number(value) > Number(priceUpperLimit);
    //   }
    // )

    .required("Maximum is required"),

  priceLowerLimit: Yup.number()
    .when("price", (price, schema) => {
      return schema.max(
        Number(price) - 1,
        "Lower price limit must be lesser than price"
      );
    })
    .required("Lower price is required"),
  priceUpperLimit: Yup.number()
    .when("price", (price, schema) =>
      schema
        .min(Number(price) + 1, "Upper price limit must be greater than price")
        .max(
          Number(price) * 1.3,
          "Upper price limit must be less than 30% of the price"
        )
    )
    .required("Upper price limit is required"),
});

const PersonalInformationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  middleName: Yup.string().optional(),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  nationality: Yup.string().required("Nationality is required"),
  address: Yup.string().required("Address is required"),
  businessName: Yup.string().optional(),
});

const IdentificationSchema = Yup.object().shape({
  docType: Yup.string().required("Document type is required"),
  identificationNo: Yup.string().required("Identification number is required"),
  selfie: Yup.string().required("Document is required"),
});

const levelThreeValidationSchema = Yup.object({
  utilityBill: Yup.mixed().required("Utility bill is required"),
  cacDocument: Yup.mixed().required("Source of wealth is required"),
  mermatDoc: Yup.mixed().nullable(),
});

// HDR: BANK SCHEMA

const getBankSchema = (
  user?: UserDetails & {
    businessName: string;
  }
) => {
  const norm = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD") // decompose
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/\s+/g, " ") // replace multiple spaces with a single space
      .trim();

  const businessNameTokens = user?.businessName
    ?.split(/[()\s]+/) // split by spaces and brackets
    .filter(Boolean)
    .map((x) => norm(String(x)))
    .filter(Boolean);

  const names = [
    ...(user?.firstName ? [norm(user?.firstName)] : []),
    ...(user?.middleName ? [norm(user?.middleName)] : []),
    ...(user?.lastName ? [norm(user?.lastName)] : []),
    ...(businessNameTokens ?? []),
  ];

  const userTokens = Array.from(new Set(names)).filter(Boolean);

  return Yup.object().shape({
    userId: Yup.string().required(),
    accountNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d+$/, "Account number must be digits only")
      .min(10, "Enter a valid account number"),
    bankCode: Yup.string().required("Bank code is required"),
    bankName: Yup.string().required("Bank name is required"),

    accountName: Yup.string()
      .required("Account name is required")
      .test(
        "name-includes-user",
        // Friendly message with expected parts
        () =>
          `Account name must include at least two of: ${userTokens
            .map((t) => t[0].toUpperCase() + t.slice(1))
            .join(", ")}`,
        function (value) {
          if (!value) return false;
          // If we can’t verify (no user names), don’t block submit
          if (userTokens.length === 0) return true;

          const tokens = norm(value).split(" ").filter(Boolean);
          const matches = userTokens.filter((t) => tokens.includes(t));

          const needed = Math.min(2, userTokens.length);
          return matches.length >= needed;
        }
      ),
  });
};

const corporateSchema = Yup.object().shape({
  cacApplicationDocument: Yup.mixed().required(
    "CAC application document is required"
  ),
  cacDocument: Yup.mixed().required("CAC document is required"),
  mermartDocument: Yup.mixed().nullable(),
});
const merchantSchema = Yup.object().shape({
  utilityBill: Yup.mixed().required("Utility bill is required"),
  photoIdentity: Yup.mixed().required("Proof of identity is required"),
});

export {
  AdSchema,
  BVNSchema,
  ChangePasswordSchema,
  corporateSchema,
  EmailSchema,
  getBankSchema,
  IdentificationSchema,
  levelThreeValidationSchema,
  LogInSchema,
  merchantSchema,
  PersonalInformationSchema,
  PhoneSchema,
  ResetPasswordSchema,
  SignupSchema,
  swapSchema,
  VerificationSchema,
};
