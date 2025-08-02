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
import { UserState } from "@/redux/reducers/userSlice";
import { cn } from "@/utils";
import { convertAssetToNaira } from "@/utils/conversions";
import { formatNumber } from "@/utils/numberFormat";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { Info, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
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

const CreateAdDetails: React.FC<AdsProps> = ({
  formik,
  setStage,
  wallet,
  liveRate,
}) => {
  const [adType, setAdType] = useState("Buy");
  const [token, setToken] = useState("");

  const loading = false;
  const walletData = wallet?.wallet;

  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  //SUB: Handle Next Stage
  const handleNextStage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      let errors = await formik.validateForm();

      let updatedErrors = Object.keys(errors).filter((field) => {
        return formik.values.type.toLowerCase() === "buy"
          ? requiredFields.includes(field)
          : requiredFieldsForToken.includes(field);
      });
      if (updatedErrors.length === 0) {
        setStage("review");
      } else {
        Toast.error(`Please fill all required fields`, "ERROR");
        formik.values.type.toLowerCase() === "buy"
          ? formik.setTouched(
              requiredFields.reduce(
                (acc, field) => ({ ...acc, [field]: true }),
                {}
              )
            )
          : formik.setTouched(
              requiredFieldsForToken.reduce(
                (acc, field) => ({ ...acc, [field]: true }),
                {}
              )
            );
      }
    } catch (err) {
      console.error("Validation failed", err);
    }
  };

  // SUB: Calculate wallet balance
  const calculateDisplayWalletBallance = useMemo(() => {
    if (adType.toLowerCase() === "buy") {
      return `${formatNumber(walletData?.xNGN)} xNGN`;
    } else {
      return walletData ? `${formatNumber(walletData?.[token])} ${token}` : "-";
    }
  }, [adType, token, walletData]);

  const walletBalance: number = useMemo(() => {
    if (formik.values.type.toLowerCase() === "buy") {
      return walletData?.xNGN;
    } else {
      return walletData ? walletData?.[formik.values.asset] : 0;
    }
  }, [adType, token, walletData]);

  // SUB: Rate
  const rate = convertAssetToNaira(
    formik.values.asset as keyof typeof liveRate,
    1,
    0,
    liveRate
  );

  return (
    <section className="flex flex-col gap-5">
      {/* SUB: TRANSACTION TYPE */}
      <div className="flex gap-2 flex-col">
        <Label text="Transaction Type" css="" />
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
        title={formik.values.asset || ""}
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
          css=""
          label="Amount to be deposited in Ad Escrow"
          type="number"
          step="any"
          inputMode="decimal"
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
          maxFnc={() =>
            formik.values.type.toLowerCase() === "buy"
              ? formik.setFieldValue(
                  "amount",
                  walletData?.xNGN === "" ? 0 : Number(walletData?.xNGN)
                )
              : formik.setFieldValue(
                  "amountToken",
                  walletData?.token === "" ? 0 : Number(walletData?.[token])
                )
          }
          onChange={(e) => {
            const value = e.target.value;
            const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
            if (isValidDecimal) {
              const fieldName =
                formik.values.type.toLowerCase() === "buy"
                  ? "amount"
                  : "amountToken";

              if (Number(value) >= walletBalance) {
                formik.setFieldError(fieldName, "Insufficient wallet balance");
              } else {
                formik.setFieldValue(fieldName, value);
              }
            }
          }}
        />

        <Badge variant={"success"}>
          Wallet Balance: {calculateDisplayWalletBallance}
        </Badge>
      </div>

      <div className="flex items-start gap-1">
        {/* SUB: PRICE */}
        <div className="flex-[80%]">
          <PrimaryInput
            css=""
            label="Price"
            type="number"
            step="any"
            inputMode="decimal"
            name="price"
            error={formik.errors.price}
            value={formik.values.price}
            touched={formik.touched.price}
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
        <div className="flex-[20%] flex gap-1 flex-col">
          <Label text="Currency" css="" />
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
      <Badge variant={"secondary"}>
        Market Price: xNGN {formatNumber(rate ?? 0)}{" "}
      </Badge>

      {/* SUB: PRICE RANGE */}
      <div className="space-y-4">
        <div className="flex justify-between gap-1">
          {/* SUB: Lower Limit */}
          <PrimaryInput
            css="w-full"
            label="Lower Price Limit"
            name="priceLowerLimit"
            type="number"
            step="any"
            error={formik.errors.priceLowerLimit}
            value={formik.values.priceLowerLimit}
            touched={formik.touched.priceLowerLimit}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

              if (isValidDecimal) {
                formik.setFieldValue(
                  "priceLowerLimit",
                  value === "" ? undefined : Number(value)
                );
              }
            }}
          />

          {/* SUB: Upper Limit */}
          <PrimaryInput
            css="w-full p-2.5"
            label="Upper price Limit"
            name="priceUpperLimit"
            type="number"
            step="any"
            error={formik.errors.priceUpperLimit}
            value={formik.values.priceUpperLimit}
            touched={formik.touched.priceUpperLimit}
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
          <PrimaryInput
            css="w-full"
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
          <PrimaryInput
            css="w-full p-2.5"
            label={`Maximum (xNGN ${
              adType === "Buy"
                ? formatNumber(userTransactionLimits?.upper_limit_buy_ad)
                : formatNumber(
                    Math.min(
                      userTransactionLimits?.upper_limit_sell_ad || Infinity,
                      Number(formik.values.amountToken) *
                        Number(formik.values.price)
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
            maxFnc={() => {
              if (adType.toLowerCase() === "sell") {
                const tokenPrice =
                  Number(formik.values.amountToken) *
                  Number(formik.values.price);

                return formik.setFieldValue(
                  "maximumLimit",
                  tokenPrice >= userTransactionLimits?.upper_limit_sell_ad
                    ? userTransactionLimits?.upper_limit_sell_ad
                    : tokenPrice
                );
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
        css={`w-full mt-8 `}
        disabled={!formik.isValid || !formik.dirty}
        text={"Continue"}
        type="button"
        loading={loading}
        onClick={(e) => handleNextStage(e)}
      />
    </section>
  );
};

export default CreateAdDetails;
