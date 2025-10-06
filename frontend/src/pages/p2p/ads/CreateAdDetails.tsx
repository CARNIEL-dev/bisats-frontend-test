import Label from "@/components/Inputs/Label";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import Divider from "@/components/shared/Divider";
import TokenSelection from "@/components/shared/TokenSelection";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdsProps } from "@/pages/p2p/ads/CreateAds";

import { cn, formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { Check, Info, TriangleAlert } from "lucide-react";
import { startTransition, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const requiredFields = [
  "type",
  "asset",
  "amount",
  "minimumLimit",
  "maximumLimit",
  "expiryDate",
  "expiryTime",
  "price",
  "priceLowerLimit",
  "priceUpperLimit",
];
const requiredFieldsForToken = [
  "type",
  "asset",
  "amountToken",
  "minimumLimit",
  "maximumLimit",
  "expiryDate",
  "expiryTime",
  "price",
  "priceLowerLimit",
  "priceUpperLimit",
];

const PERCENTAGES = [2, 5, 10, 15];

const CreateAdDetails: React.FC<AdsProps> = ({
  formik,
  setStage,
  wallet,
  liveRate,
  editMode,
}) => {
  const [adType, setAdType] = useState(formik.values.type || "Buy");
  const [token, setToken] = useState(formik.values.asset || "USDT");
  const [activePercentage, setActivePercentage] = useState(0);

  const walletData = wallet?.wallet;

  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  //SUB: Handle Next Stage
  const handleValidation = async () => {
    try {
      const errors = await formik.validateForm();
      const isBuy = formik.values.type.toLowerCase() === "buy";
      const requiredFieldsList = isBuy
        ? requiredFields
        : requiredFieldsForToken;

      startTransition(() => {
        const hasErrors = Object.keys(errors).some((field) =>
          requiredFieldsList.includes(field)
        );

        if (!hasErrors) {
          setStage("review"); // Non-urgent state update
        } else {
          // Mark fields as touched
        }
      });

      // Show toast immediately (outside transition)
      if (Object.keys(errors).length > 0) {
        Toast.error(`Please fill all required fields`, "ERROR");
      }
    } catch (err) {
      console.error("Validation failed", err);
    }
  };

  // SUB: Calculate wallet balance

  const walletBalance: number = useMemo(() => {
    if (editMode) {
      if (adType.toLowerCase() === "buy") {
        const amountAval = (walletData?.xNGN + formik.values.amount).toFixed(2);
        return Number(amountAval) || 0;
      } else {
        return walletData
          ? walletData?.[token] + formik.values.amountToken
          : formik.values.amountToken || 0;
      }
    } else {
      if (adType.toLowerCase() === "buy") {
        return Number(walletData?.xNGN);
      } else {
        return walletData ? Number(walletData?.[token]) : 0;
      }
    }
  }, [adType, token, walletData]);

  // SUB: Handle percentage click
  const handlePercentageClick = useCallback(
    (percent: number) => {
      if (!formik.values.price) {
        Toast.warning("Please enter a price", "Price required");
        return;
      }

      setActivePercentage(percent);
      const price = Number(formik.values.price);
      const percentageValue = Number(((price * percent) / 100).toFixed(2));

      // Set upper/lower limits
      formik.setValues({
        ...formik.values,
        priceUpperLimit: price + percentageValue,
        priceLowerLimit: price - percentageValue,
      });
    },
    [formik]
  );

  // SUB: Rate

  const rate = useMemo(() => {
    return liveRate![formik.values.asset as keyof typeof liveRate];
  }, [formik.values.asset, liveRate]);

  return (
    <section className="flex flex-col gap-5">
      {/* SUB: TRANSACTION TYPE */}
      <div className="flex gap-2 flex-col">
        <Label text="Transaction Type" className="" />
        <Select
          onValueChange={(value) => {
            formik.setFieldValue("type", value);
            setAdType(value);
          }}
          defaultValue={formik.values.type}
        >
          <SelectTrigger
            className={cn(
              "w-full ",
              formik.errors.type && formik.touched.type && "border-red-500"
            )}
          >
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="!w-full">
            {[
              { value: "Buy", label: "Buy" },
              { value: "Sell", label: "Sell" },
            ].map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SUB: ASSET */}
      <TokenSelection
        key={"asset"}
        value={formik.values.asset || ""}
        // defaultValue={formik.values.asset || "USDT"}
        label="Asset"
        error={formik.errors.asset}
        touched={formik.touched.asset}
        handleChange={(value) => {
          formik.setFieldValue("asset", value);
          setToken(value);
        }}
        removexNGN={true}
        showBalance={false}
      />

      {/* SUB: AMOUNT */}
      <div className="space-y-2">
        <PrimaryInput
          className=""
          label="Amount to be deposited in Ad Escrow"
          type="number"
          key={
            formik.values.type.toLowerCase() === "buy"
              ? "amount"
              : "amountToken"
          }
          step="any"
          min={0}
          inputMode="decimal"
          onBlur={formik.handleBlur}
          name={
            formik.values.type.toLowerCase() === "buy"
              ? "amount"
              : "amountToken"
          }
          error={
            formik.values.type.toLowerCase() === "buy"
              ? formik.errors.amount
              : formik.errors.amountToken
          }
          value={
            formik.values.type.toLowerCase() === "buy"
              ? formik.values.amount
              : formik.values.amountToken
          }
          touched={
            formik.values.type.toLowerCase() === "buy"
              ? formik.touched.amount
              : formik.touched.amountToken
          }
          maxFnc={() => {
            const isBuy = formik.values.type.toLowerCase() === "buy";

            // Calculate maximum allowed value in token units (for sell transactions)
            const maxTokenValue =
              userTransactionLimits.maximum_ad_creation_amount / (rate || 0);

            const limit = isBuy
              ? userTransactionLimits.maximum_ad_creation_amount // Use normal limit for buy
              : Number(maxTokenValue.toFixed(5));

            // Determine the actual maximum value (minimum between wallet balance and limit)
            const val = Math.min(walletBalance || 0, limit);

            formik.setFieldValue(isBuy ? "amount" : "amountToken", val);
          }}
          onChange={(e) => {
            const value = e.target.value;
            const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
            if (isValidDecimal) {
              const fieldName =
                formik.values.type.toLowerCase() === "buy"
                  ? "amount"
                  : "amountToken";

              // if (Number(value) >= walletBalance) {
              //   formik.setFieldError(fieldName, "Insufficient wallet balance");
              // } else {
              formik.setFieldValue(fieldName, value);
              formik.validateField(fieldName);
            }
          }}
        />

        {/* SUB: Wallet Balance */}
        <Badge variant={"success"}>
          Wallet Balance:{" "}
          {formatter({
            decimal:
              adType.toLowerCase() === "buy"
                ? 2
                : token === "xNGN" || token === "USDT"
                ? 2
                : 7,
          }).format(walletBalance)}{" "}
          {adType.toLowerCase() === "buy" ? "xNGN" : token}
        </Badge>
      </div>

      <div className="flex items-start gap-1">
        {/* SUB: PRICE */}
        <div className="flex-[80%]">
          <PrimaryInput
            className=""
            label="Price"
            type="number"
            step="any"
            inputMode="decimal"
            name="price"
            error={formik.errors.price}
            defaultValue={formik.values.price}
            touched={formik.touched.price}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
              if (isValidDecimal) {
                formik.setFieldValue("price", value === "" ? undefined : value);
              }
            }}
          />
        </div>

        {/* SUB: CURRENCY */}
        <div className="flex-[20%] flex gap-1.5 flex-col">
          <Label text="Currency" className="" />
          <Select
            onValueChange={(value) => {
              formik.setFieldValue("currency", value);
            }}
            defaultValue={"NGN"}
          >
            <SelectTrigger
              className={cn(
                "w-full  !h-11",
                formik.errors.currency &&
                  formik.touched.currency &&
                  "border-red-500"
              )}
            >
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent className="!w-full">
              {[{ value: "NGN", label: "NGN" }].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={"secondary"}>
          Market Price: xNGN {formatNumber(rate ?? 0)}{" "}
        </Badge>

        <Badge
          role="button"
          onClick={() => {
            if (!formik.values.asset) {
              Toast.warning("Please select an asset", "Asset required");
              return;
            }
            formik.setFieldValue("price", Number(rate));
            formik.validateField("price");
          }}
          variant={"success"}
          tabIndex={0}
        >
          <Check className="mr-1" />
          Use Market Price
        </Badge>
      </div>

      {/* SUB: PRICE RANGE */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-1">
          {/* SUB: Lower Limit */}
          <PrimaryInput
            className="w-full"
            label="Lower Price Limit"
            name="priceLowerLimit"
            type="number"
            step="any"
            error={formik.errors.priceLowerLimit}
            value={formik.values.priceLowerLimit}
            touched={formik.touched.priceLowerLimit}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

              if (isValidDecimal) {
                formik.setFieldValue(
                  "priceLowerLimit",
                  value === "" ? undefined : Number(value)
                );
                formik.validateField("priceLowerLimit");
              }
            }}
          />

          {/* SUB: Upper Limit */}
          <PrimaryInput
            className="w-full p-2.5"
            label="Upper price Limit"
            name="priceUpperLimit"
            type="number"
            step="any"
            error={formik.errors.priceUpperLimit}
            value={formik.values.priceUpperLimit}
            touched={formik.touched.priceUpperLimit}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

              if (isValidDecimal) {
                formik.setFieldValue(
                  "priceUpperLimit",
                  value === "" ? undefined : Number(value)
                );
              }
            }}
          />
        </div>

        {/* SUB: Percentage Buttons */}
        <div className="flex gap-1 mb-2 items-center">
          <p className="text-gray-500 text-xs">Or Percentage difference :</p>
          {PERCENTAGES.map((percent) => (
            <Badge
              role="button"
              onClick={() => {
                handlePercentageClick(percent);
              }}
              key={percent}
              variant={"success"}
              tabIndex={0}
              className={cn(
                "!p-2 size-8 rounded-full hover:bg-green-500/20",
                activePercentage === percent && "bg-green-500/30"
              )}
            >
              {percent}%
            </Badge>
          ))}
        </div>
        <Badge
          variant={"secondary"}
          className="animate-pulse flex items-center gap-1"
        >
          <TriangleAlert color="#F59E0C" />
          <span>
            Your ad would be paused if the market price gets to these prices
          </span>
        </Badge>
      </div>

      <Divider text=" Limits (in NGN)" />
      <div className="space-y-2">
        <div className="flex flex-col gap-4 lg:flex-wrap justify-between ">
          {/* SUB: Minimum */}
          <PrimaryInput
            className="w-full"
            label={`Minimum (xNGN${
              adType === "Buy"
                ? formatNumber(userTransactionLimits?.lower_limit_buy_ad)
                : formatNumber(userTransactionLimits?.lower_limit_sell_ad)
            })`}
            name="minimumLimit"
            type="number"
            step="any"
            min={
              adType === "Buy"
                ? userTransactionLimits?.lower_limit_buy_ad
                : userTransactionLimits?.lower_limit_sell_ad
            }
            error={formik.errors.minimumLimit}
            value={formik.values.minimumLimit}
            touched={formik.touched.minimumLimit}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+(\.\d{0,})?$/.test(value)) {
                formik.setFieldValue(
                  "minimumLimit",
                  value === "" ? undefined : Number(value)
                );
              }
            }}
          />

          {/* SUB: Maximum */}
          <PrimaryInput
            className="w-full p-2.5"
            label={`Maximum (xNGN ${
              adType === "Buy"
                ? formatNumber(userTransactionLimits?.upper_limit_buy_ad)
                : formatNumber(
                    Math.min(
                      userTransactionLimits?.upper_limit_sell_ad || Infinity,
                      Number(rate) * Number(formik.values.amountToken)
                    )
                  )
            })`}
            name="maximumLimit"
            type="number"
            step="any"
            max={
              adType === "Buy"
                ? userTransactionLimits?.upper_limit_buy_ad
                : userTransactionLimits?.upper_limit_sell_ad
            }
            error={formik.errors.maximumLimit}
            value={formik.values.maximumLimit}
            touched={formik.touched.maximumLimit}
            onBlur={formik.handleBlur}
            maxFnc={() => {
              if (formik.values.type || adType) {
                if (formik.values.type === "Buy" && !formik.values.amount) {
                  Toast.warning("Please enter an amount", "Amount required");
                  return;
                }
                if (
                  formik.values.type === "Sell" &&
                  !formik.values.amountToken
                ) {
                  Toast.warning(
                    "Please enter an amount token",
                    "Amount required"
                  );
                  return;
                }
              }
              if (adType.toLowerCase() === "sell") {
                const tokenValue = (
                  Number(rate) * Number(formik.values.amountToken)
                ).toFixed(2);
                const tokenPrice = Math.min(
                  userTransactionLimits?.upper_limit_sell_ad || Infinity,
                  parseFloat(tokenValue)
                );

                return formik.setFieldValue("maximumLimit", tokenPrice);
              } else {
                return formik.setFieldValue(
                  "maximumLimit",
                  Number(formik.values.amount) >=
                    userTransactionLimits?.upper_limit_buy_ad
                    ? userTransactionLimits?.upper_limit_buy_ad
                    : Number(formik.values.amount)
                );
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+(\.\d{0,})?$/.test(value)) {
                formik.setFieldValue(
                  "maximumLimit",
                  value === "" ? undefined : Number(value)
                );
              }
            }}
          />
        </div>
        <Badge variant={"success"}>
          <Info />
          <span>
            Set limits to control the size of transactions for this ad.
          </span>
        </Badge>
      </div>

      <PrimaryButton
        className={`w-full mt-8 `}
        disabled={!formik.isValid}
        text={"Continue"}
        type="button"
        loading={false}
        onClick={handleValidation}
      />
    </section>
  );
};

export default CreateAdDetails;

/* 
  .when(
      ["type", "asset", "$liveRate", "$userTransactionLimits"],
      ([type, assetValue, liveRate, userTransactionLimits], schema) => {
        let computedMax = 23_000_000;

        const limit =
          type.toLowerCase() === "buy"
            ? userTransactionLimits?.upper_limit_buy_ad
            : userTransactionLimits?.upper_limit_sell_ad;

        const tokenRate =
          convertAssetToNaira(assetValue as keyof Prices, 1, 0, liveRate) || 0;

        const tokenPrice = Math.min(
          limit || Infinity,
          Number( tokenRate) * Number(walletBalance)
        );

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

       .when(
      ["type", "$userTransactionLimits"],
      ([type, userTransactionLimits], schema) => {
        const limit =
          type.toLowerCase() === "buy"
            ? userTransactionLimits?.upper_limit_buy_ad
            : userTransactionLimits?.upper_limit_sell_ad;

        return schema.max(
          limit,
          `Maximum must not exceed ₦${formatNumber(limit)}`
        );
      }
    )

*/
