import { InputCheck } from "@/components/Inputs/CheckBox";
import { formatNumber } from "@/utils/numberFormat";
import { AdsProps } from "@/pages/p2p/ads/CreateAds";
import { formatter } from "@/utils";

const AdReview: React.FC<AdsProps> = ({ formik }) => {
  return (
    <div className="text-sm mb-3">
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">
            Transaction Type
          </span>
        </p>
        <p
          className={
            formik.values.type === "Buy"
              ? "text-green-600 border border-green-600 rounded-full px-3 py-0.5 bg-green-500/10 font-semibold"
              : "text-red-600 border border-red-600 rounded-full px-3 py-0.5 bg-red-500/10  font-semibold"
          }
        >
          {formik.values.type}
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Asset</span>
        </p>
        <p className="text-[#515B6E] font-semibold">{formik.values.asset}</p>
      </div>
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Limits</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          <span className="mr-2">
            Min: {formatNumber(formik.values.minimumLimit ?? 0)}
          </span>
          <span>Max: {formatNumber(formik.values.maximumLimit ?? 0)}</span>
        </p>
      </div>
      {/* <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Pricing Type</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          {formik.values.priceType}
        </p>
      </div> */}
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Amount</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          {formatter({
            decimal: formik.values.type.toLowerCase() === "sell" ? 6 : 2,
          }).format(
            formik.values.type.toLowerCase() === "sell"
              ? formik.values?.amountToken || 0
              : formik.values?.amount || 0
          )}
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Your Price</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          {formatNumber(formik.values.price ?? 0)}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Upper Limit</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          {formatNumber(formik.values.priceUpperLimit ?? 0)}
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Lower Limit</span>
        </p>
        <p className="text-[#515B6E] font-semibold">
          {formatNumber(formik.values.priceLowerLimit ?? 0)}
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between w-full">
        <p className="mb-1">
          <span className="text-[#606C82] font-light mr-2">Currency</span>
        </p>
        <p className="text-[#515B6E] font-semibold">{formik.values.currency}</p>
      </div>

      <div className="w-full p-3 rounded-[8px] border border-[#F3F4F6] bg-[#F9F9FB] my-4">
        <h1 className="text-[#2B313B] text-[14px] leading-[24px] font-semibold">
          Summary
        </h1>

        <p className="text-[#606C82] text-[13px] leading-[24px] font-normal">
          You are about to create an ad to{" "}
          <span className="font-semibold">
            {formik.values.type.toLowerCase() === "buy"
              ? `Buy ${formatter({ decimal: 2 }).format(
                  formik.values.amount || 0
                )} NGN worth of ${formik.values.asset}`
              : `Sell ${formatter({
                  decimal: 6,
                }).format(formik.values?.amountToken || 0)} ${
                  formik.values.asset
                }`}{" "}
            at{" "}
            {formik.values.priceType?.toLowerCase() === "static"
              ? `${formatter({ decimal: 0 }).format(
                  formik.values.price || 0
                )} NGN/USDT.`
              : ` a margin of ${formik.values.priceMargin}% ${
                  formik.values.type?.toLowerCase() === "buy"
                    ? "price increase"
                    : "price decrease"
                } at the current market price during fulfiment of the ad`}
          </span>{" "}
          <br />
          Your ad will be paused if market price goes higher than{" "}
          {formatNumber(formik.values.priceUpperLimit || 0)} NGN or Lower than{" "}
          {formatNumber(formik.values.priceLowerLimit || 0)} NGN.
          {/* Your ad expires on {formik.values.expiryDate} by {formik.values.expiryTime} */}
        </p>
      </div>
      <div className="flex items-center">
        <InputCheck
          type="checkbox"
          name="agree"
          checked={formik.values.agree}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span className="text-[12px] pl-2 text-[#515B6E]">
          I agree to the platform's Terms and Conditions.
        </span>
      </div>
    </div>
  );
};

export default AdReview;
