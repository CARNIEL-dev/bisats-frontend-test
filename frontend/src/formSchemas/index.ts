import * as Yup from "yup";
import {
  lowerCaseRegex,
  upperCaseRegex,
  numberRegex,
  specialCharcterRegex,
  characterLength,
} from "@/utils/passwordChecks";
import { formatNumber } from "@/utils/numberFormat";
import { PriceData } from "@/pages/wallet/Assets";
import { convertAssetToNaira } from "@/utils/conversions";
import { toke_100_ngn } from "@/utils/data";

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
  oldPassword: Yup.string().required(),
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
  code: Yup.string().length(6).required(),
});
const EmailSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

const PhoneSchema = Yup.object().shape({
  phone: Yup.string().required(),
});
const BVNSchema = Yup.object().shape({
  bvn: Yup.string().required(),
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

const TopUpSchema = Yup.object().shape({
  amount: Yup.string()
    .matches(/^\d*$/, "Amount must be a number")
    .required("Amount is required"),
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
                  : adDetail.amountAvailable;

              const amountVal =
                type === "sell" ? value : value / Number(adDetail.price);
              return typeof amountVal === "number"
                ? amountVal <= adsBal
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
              const { adDetail } = this.options.context as any;
              const minLimit = Number(adDetail.minimumLimit);

              return minLimit <= value;
            }
          )
          //? Upper limit check
          .test(
            "max-lower-limit",
            "Amount is greater than the upper limit",
            function (value) {
              const { adDetail } = this.options.context as any;
              const maxLimit = Number(adDetail.maximumLimit);

              return maxLimit >= value;
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
    .oneOf(["BTC", "USDT", "SOL", "ETH"])
    .required("Asset selection is required"),
  priceType: Yup.string().required("Pricing type is required"),
  currency: Yup.string().required("Currency selection is required"),
  price: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || isNaN(originalValue)) return undefined;
      return Number(originalValue);
    })
    .when(["asset", "$liveRate"], ([assetValue, liveRate], schema) => {
      const rate = convertAssetToNaira(
        assetValue as keyof PriceData,
        1,
        0,
        liveRate as PriceData
      );
      const minPrice = 0.9 * Number(rate ?? 0);
      const maxPrice = 1.1 * Number(rate ?? 0);

      return schema
        .min(minPrice ?? 1450, `Price must be greater than 90% of market rate`)
        .max(maxPrice ?? 1700, `Price must be lower than 110% of market rate`)
        .required("Price is required");
    }),

  amount: Yup.number()
    .transform((v, o) => (o === "" || isNaN(o as any) ? undefined : Number(o)))
    // if type === “Sell”, clear this field completely
    .when("type", {
      is: (val: string) => val.toLowerCase() === "sell",
      then: (schema) =>
        schema
          .transform(() => undefined) // wipe it out
          .notRequired(),
      otherwise: (schema) =>
        schema
          .when(
            ["$userTransactionLimits"],
            ([userTransactionLimits], schema3) => {
              const limit =
                userTransactionLimits?.maximum_ad_creation_amount ?? 0;

              return schema3.max(
                limit,
                `Amount must not exceed ${formatNumber(
                  userTransactionLimits?.maximum_ad_creation_amount
                )} xNGN`
              );
            }
          )
          .when(
            ["type", "asset", "$walletData"],
            ([type, asset, walletData], schema2) => {
              const walletBalance =
                type.toLowerCase() === "buy"
                  ? walletData?.xNGN
                  : walletData
                  ? walletData?.[asset]
                  : 0;

              return schema2.max(
                walletBalance,
                "Amount cannot exceed your current wallet balance"
              );
            }
          )

          .required("Amount is required"),
    }),
  amountToken: Yup.number()
    .transform((v, o) => (o === "" || isNaN(o as any) ? undefined : Number(o)))
    .when("type", {
      is: (val: string) => val.toLowerCase() === "buy",
      then: (schema) => schema.transform(() => undefined).notRequired(),
      otherwise: (schema) =>
        schema
          .min(0, "Token amount must be greater than 0")
          .when(
            ["asset", "$liveRate", "$userTransactionLimits"],
            ([assetValue, liveRate, userTransactionLimits], schema2) => {
              const tokenRate =
                convertAssetToNaira(
                  assetValue as keyof Prices,
                  1,
                  0,
                  liveRate
                ) || 0;
              const MAX_NAIRA_LIMIT =
                userTransactionLimits?.maximum_ad_creation_amount ?? 0;
              const maxTokenValue =
                tokenRate > 0 ? MAX_NAIRA_LIMIT / tokenRate : 0;

              return schema2.max(
                maxTokenValue,
                `Amount must not exceed ₦100,000,000 worth of ${assetValue}`
              );
            }
          )
          .required("Token amount is required"),
    }),
  minimumLimit: Yup.number()
    .min(15000, "Minimum must be greater than 15,000 xNGN")
    .max(23000000, "Price must not exceed 23,000,000 xNGN")
    .required("Minimum is required"),

  maximumLimit: Yup.number()
    .when(["minimumLimit", "amount", "amountToken"], ([minimumLimit], schema) =>
      schema.min(
        Number(minimumLimit) + 1,
        "Maximum must be greater than Minimum"
      )
    )
    .when(
      ["type", "amount", "amountToken", "price"],
      ([type, amount, amountToken, price], schema) => {
        let computedMax = 23_000_000;

        if (type?.toLowerCase() === "buy" && typeof amount === "number") {
          // when you’re buying, you can’t spend more than your NGN budget
          computedMax = Math.min(amount, 23_000_000);
        }

        if (
          type?.toLowerCase() === "sell" &&
          typeof amountToken === "number" &&
          typeof price === "number"
        ) {
          // when you’re selling, you can’t list more than your token‐value
          const possible = amountToken * price;
          computedMax = Math.min(possible, 23_000_000);
        }

        return schema.max(
          computedMax,
          `Maximum must not exceed ₦${formatNumber(computedMax)}`
        );
      }
    )

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
      schema.min(
        Number(price) + 1,
        "Upper price limit must be greater than price"
      )
    )
    .required("Upper limit price is required"),
});

export {
  swapSchema,
  BVNSchema,
  LogInSchema,
  TopUpSchema,
  PhoneSchema,
  EmailSchema,
  VerificationSchema,
  ChangePasswordSchema,
  ResetPasswordSchema,
  SignupSchema,
  AdSchema,
};
