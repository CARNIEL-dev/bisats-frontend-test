import PrimaryInput from "@/components/Inputs/PrimaryInput";
import P2PConfirmation from "@/components/Modals/P2PConfirmation";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import AutoRefreshTimer from "@/components/shared/AutoRefresh";
import { Badge } from "@/components/ui/badge";
import { TokenData } from "@/data";
import { swapSchema } from "@/formSchemas";
import KycManager from "@/pages/kyc/KYCManager";

import { formatter } from "@/utils";
import { assets } from "@/utils/conversions";
import { formatNumber } from "@/utils/numberFormat";
import { ACTIONS, bisats_charges } from "@/utils/transaction_limits";
import Decimal from "decimal.js";
import { FormikProps, useFormik } from "formik";
import { BadgeCheck } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// assets = isDev ? TestAssets : LiveAssets

export const assetIndexMap: Record<string, number> = Object.values(
  assets,
).reduce(
  (acc, asset, index) => {
    acc[asset] = index;
    return acc;
  },
  {} as Record<string, number>,
);

export enum typeofSwam {
  "Buy",
  "Sell",
}
const P2PMarket = ({
  type,
  adDetail,
}: {
  type: "buy" | "sell";
  adDetail?: AdsType | undefined;
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "amount" | "otherAmount" | null
  >("amount");

  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const user = useSelector((state: { user: UserState }) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!adDetail) navigate(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //SUB: Query function

  // SUB: Formik
  const formik = useFormik({
    initialValues: {
      amount: "",
      otherAmount: "",
    },
    validate: async (values) => {
      try {
        await swapSchema.validate(values, {
          abortEarly: false,
          context: { focusedField, walletState, adDetail, type },
        });
        return {};
      } catch (err: any) {
        const errors: Record<string, string> = {};
        if (err.inner) {
          err.inner.forEach((e: any) => {
            if (e.path) errors[e.path] = e.message;
          });
        }
        return errors;
      }
    },
    onSubmit: (values) => {
      setShowConfirmation(true);
      // console.log(values);
    },
  });

  const calculateFee = () => {
    if (!formik.values.amount || parseFloat(formik.values.amount) <= 0)
      return "0";
    const feePercentage = bisats_charges.crypto_buy;
    return (parseFloat(formik.values.amount) * feePercentage).toFixed(2);
  };

  // SUB: Converts the equivalent values
  useEffect(() => {
    const price = adDetail?.price ?? 0;
    if (!price) return;
    const amt = parseFloat(formik.values.amount);
    const otherAmt = parseFloat(formik.values.otherAmount);

    if (focusedField === "amount" && !isNaN(amt)) {
      if (adDetail?.orderType === "buy") {
        const val = new Decimal(amt / price).toFixed(6);
        formik.setFieldValue("otherAmount", val);
        // formik.setFieldValue("otherAmount", (amt / price).toFixed(6));
      } else if (adDetail?.orderType === "sell") {
        formik.setFieldValue("otherAmount", (amt * price).toFixed(2));
      }
    } else if (focusedField === "otherAmount" && !isNaN(otherAmt)) {
      if (adDetail?.orderType === "buy") {
        formik.setFieldValue("amount", (otherAmt * price).toFixed(2));
      } else if (adDetail?.orderType === "sell") {
        formik.setFieldValue("amount", (otherAmt / price).toFixed(6));
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adDetail?.orderType,
    adDetail?.price,
    focusedField,
    formik.values.amount,
    formik.values.otherAmount,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <p
        className={`${
          type === "buy" ? "text-green-600" : "text-red-600"
        } text-sm font-semibold`}
      >
        {" "}
        {type === "buy" ? "You're Buying from" : "You're Selling to"}
      </p>

      <h3 className="text-[28px] md:text-[34px] flex items-center gap-2  font-semibold leading-[40px]">
        {adDetail?.user?.userName}{" "}
        {adDetail?.user?.accountLevel === "level_3" && (
          <BadgeCheck fill="#F5BB00" stroke="#fff" size={30} />
        )}
      </h3>

      <div className="text-[#515B6E] text-sm flex items-center gap-1 font-normal ">
        <p>1 {adDetail?.asset}</p>  ≈ 
        <div className="flex items-center gap-1">
          <p>{formatNumber(Number(adDetail?.price))} xNGN</p>
          <AutoRefreshTimer
            queryKey={["searchDetails", user.user?.userId, adDetail?.id]}
          />
        </div>
      </div>
      <div className="flex items-center w-2/3 justify-between">
        <div className="text-[12px] text-[#515B6E]">
          <h4 className="font-semibold">
            {type === "buy" ? "Available" : "Maximum"}
          </h4>
          {type === "buy" ? (
            <p>
              {adDetail &&
                formatter({
                  decimal: adDetail?.asset === "USDT" ? 2 : 6,
                }).format(adDetail?.amountAvailable)}{" "}
              {adDetail?.asset}
            </p>
          ) : (
            <p>
              {adDetail &&
                formatter({
                  decimal: adDetail?.asset === "USDT" ? 2 : 6,
                }).format(adDetail?.amountAvailable / adDetail?.price)}{" "}
              {adDetail?.asset}
            </p>
          )}
        </div>
        <div className="text-[12px] text-[#515B6E]">
          <h2 className="font-semibold">Limit</h2>
          <p>
            {formatNumber(Number(adDetail?.minimumLimit))} -{" "}
            {formatNumber(Number(adDetail?.maximumLimit))} xNGN
          </p>
        </div>
      </div>

      <div className="mt-2 mb-3">
        {type === "buy" ? (
          <BuyForm
            adDetail={adDetail}
            walletState={walletState}
            formik={formik}
            setFocusedField={setFocusedField}
          />
        ) : (
          <SellForm
            adDetail={adDetail}
            walletState={walletState}
            formik={formik}
            setFocusedField={setFocusedField}
          />
        )}
      </div>

      <KycManager
        action={type === "buy" ? ACTIONS.P2P_BUY : ACTIONS.P2P_SELL}
        func={() => setShowConfirmation(true)}
      >
        {(validateAndExecute) => (
          <PrimaryButton
            text={`${type} ${
              TokenData?.[assetIndexMap?.[adDetail?.asset ?? "BTC"]]?.tokenName
            }`}
            loading={false}
            className="w-full capitalize"
            disabled={!(formik.isValid && formik.dirty)}
            onClick={validateAndExecute}
          />
        )}
      </KycManager>

      {showConfirmation && (
        <P2PConfirmation
          close={() => setShowConfirmation(false)}
          orderType={adDetail?.orderType as "string"}
          amount={formik.values.amount}
          receiveAmount={formik.values.otherAmount ?? "0"}
          fee={calculateFee()}
          token={adDetail?.orderType === "buy" ? "xNGN" : adDetail?.asset}
          currency={adDetail?.orderType === "buy" ? adDetail?.asset : "xNGN"}
          setShowConfirmation={setShowConfirmation}
          userId={user?.user?.userId || ""}
          adsId={adDetail?.id || ""}
          adType={adDetail?.type as string}
        />
      )}
    </div>
  );
};

export default P2PMarket;

type SwapFormType = {
  adDetail: AdsType | undefined;
  walletState: WalletState;
  formik: FormikProps<{
    amount: string;
    otherAmount: string;
  }>;
  setFocusedField: React.Dispatch<
    React.SetStateAction<"amount" | "otherAmount" | null>
  >;
};

// HDR: BuyForm
const BuyForm = ({
  adDetail,
  walletState,
  formik,
  setFocusedField,
}: SwapFormType) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <InputField
            label="Amount"
            id="amt"
            logoName={TokenData[0].tokenName}
            logo={TokenData[0].tokenLogo}
            value={formik.values.amount}
            error={formik.errors.amount}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
              if (isValidDecimal) {
                formik.setFieldValue("amount", value);
              }
            }}
            onFocus={() => {
              setFocusedField("amount");
            }}
            maxFunc={() => {
              const walletBalance = walletState?.wallet?.xNGN;
              if (walletBalance <= 0) {
                Toast.error("Insufficient Wallet Balance", "Wallet Balance");
                return;
              }

              const availableAmount = adDetail?.maximumLimit || 0;
              const maxValue = Math.min(walletBalance, availableAmount);

              setFocusedField("amount");
              formik.setFieldTouched("amount", true);

              formik.setFieldValue("amount", `${maxValue.toFixed(2)}`);
            }}
            format
          />

          <Badge variant={"success"}>
            Balance:{" "}
            {formatter({ decimal: 2 }).format(walletState?.wallet?.xNGN)} xNGN
          </Badge>
        </div>

        <InputField
          label="You'll receive at least"
          id="otherAmount"
          logoName={
            TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenName
          }
          logo={TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenLogo}
          value={formik.values.otherAmount}
          error={formik.errors.otherAmount}
          onChange={(e) => {
            const value = e.target.value;
            const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
            if (isValidDecimal) {
              formik.setFieldValue("otherAmount", value);
            }
          }}
          onFocus={() => {
            setFocusedField("otherAmount");
          }}
        />
      </div>
    </>
  );
};

// HDR: SellForm
const SellForm = ({
  adDetail,
  walletState,
  formik,
  setFocusedField,
}: SwapFormType) => {
  const balance = walletState?.wallet?.[adDetail?.asset ?? "USDT"];
  const isUSDT = adDetail?.asset === "USDT";
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-0.5">
          <InputField
            label="Quanity"
            id="quantity"
            logoName={
              TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenName
            }
            logo={
              TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenLogo
            }
            value={formik.values.amount}
            error={formik.errors.amount}
            onChange={(e) => {
              const value = e.target.value;
              const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
              if (isValidDecimal) {
                formik.setFieldValue("amount", value);
              }
            }}
            onFocus={() => {
              setFocusedField("amount");
            }}
            maxFunc={() => {
              const maxVal = walletState?.wallet?.[adDetail?.asset ?? "USDT"];

              if (maxVal <= 0) {
                Toast.error("Insufficient Wallet Balance", "Wallet Balance");
                return;
              }

              const availableAmount =
                (adDetail?.maximumLimit || 0) / (adDetail?.price || 0);

              const maxValue = Math.min(maxVal, availableAmount);

              setFocusedField("amount");
              // formik.setFieldValue("amount", `1.00`);
              formik.setFieldValue("amount", maxValue);
            }}
          />

          <Badge variant={"success"}>
            Balance: {formatter({ decimal: isUSDT ? 2 : 7 }).format(balance)}{" "}
            {adDetail?.asset}
          </Badge>
        </div>

        <InputField
          label="You'll receive at least"
          id="otherAmount"
          logoName={TokenData[0].tokenName}
          logo={TokenData[0].tokenLogo}
          value={formik.values.otherAmount}
          error={formik.errors.otherAmount}
          onChange={(e) => {
            const value = e.target.value;
            const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
            if (isValidDecimal) {
              formik.setFieldValue("otherAmount", value);
            }
          }}
          onFocus={() => {
            setFocusedField("otherAmount");
          }}
          format
        />
      </div>
    </>
  );
};

type InputFieldProps = {
  label: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  logo: React.ReactElement;
  logoName: string;
  maxFunc?: () => void;
  onFocus: () => void;
  value: string;
  error: string | boolean | undefined | null;
  format?: boolean;
};
const InputField = ({
  label,
  id,
  onChange,
  logo,
  logoName,
  maxFunc,
  value,
  onFocus,
  error,
  format,
}: InputFieldProps) => {
  return (
    <div className="relative h-32">
      <PrimaryInput
        className={"w-full h-[58px] no-spinner"}
        label={label}
        type="number"
        inputMode="decimal"
        error={error}
        id={id}
        touched={undefined}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        maxFnc={maxFunc ? maxFunc : undefined}
        format={format}
      />

      <div className="absolute right-1 top-1/2 -translate-y-[63%]">
        <button
          className={`text-gray-600 p-2.5 px-4  border cursor-default h-[48px] rounded-md items-center bg-gradient-to-r from-[#FFFFFF] to-[#dfe2e9]  flex justify-center gap-2 font-semibold text-sm `}
          type="button"
        >
          <span className="shrink-0">{logo}</span>

          <div className="">{logoName}</div>
        </button>
      </div>
    </div>
  );
};
