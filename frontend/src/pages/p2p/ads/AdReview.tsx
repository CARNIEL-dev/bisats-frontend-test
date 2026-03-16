import { InputCheck } from "@/components/Inputs/CheckBox";
import { formatNumber } from "@/utils/numberFormat";
import { AdsProps } from "@/pages/p2p/ads/CreateAds";
import { formatter } from "@/utils";
import TextBox from "@/components/shared/TextBox";

const AdReview: React.FC<AdsProps> = ({ formik }) => {
  return (
    <div className="text-sm mb-3 flex flex-col gap-4">
      <TextBox
        label="Transaction Type"
        value={
          <span
            className={
              formik.values.type === "Buy"
                ? "text-green-600 border border-green-600 rounded-full px-3 py-0.5 bg-green-500/10 font-semibold"
                : "text-red-600 border border-red-600 rounded-full px-3 py-0.5 bg-red-500/10  font-semibold"
            }
          >
            {formik.values.type}
          </span>
        }
        showIndicator={false}
      />

      <TextBox
        label="Asset"
        value={<span className="font-semibold">{formik.values.asset}</span>}
        showIndicator={false}
      />
      <TextBox
        label="Limits"
        value={
          <span className=" font-semibold">
            <span className="mr-2">
              Min: {formatNumber(formik.values.minimumLimit ?? 0)}
            </span>
            <span>Max: {formatNumber(formik.values.maximumLimit ?? 0)}</span>
          </span>
        }
        showIndicator={false}
      />
      <TextBox
        label="Amount"
        value={
          <span className=" font-semibold">
            {formatter({
              decimal: formik.values.type.toLowerCase() === "sell" ? 6 : 2,
            }).format(
              formik.values.type.toLowerCase() === "sell"
                ? formik.values?.amountToken || 0
                : formik.values?.amount || 0,
            )}
          </span>
        }
        showIndicator={false}
      />
      <TextBox
        label="Your Price"
        value={
          <span className=" font-semibold">
            {formatNumber(formik.values.price ?? 0)}
          </span>
        }
        showIndicator={false}
      />

      <TextBox
        label="Upper Limit"
        value={
          <span className=" font-semibold">
            {formatNumber(formik.values.priceUpperLimit ?? 0)}
          </span>
        }
        showIndicator={false}
      />
      <TextBox
        label="Lower Limit"
        value={
          <span className=" font-semibold">
            {formatNumber(formik.values.priceLowerLimit ?? 0)}
          </span>
        }
        showIndicator={false}
      />

      <TextBox
        label="Currency"
        value={<span className=" font-semibold">{formik.values.currency}</span>}
        showIndicator={false}
      />

      <TextBox
        label="Transaction fee"
        value={
          <span className=" font-semibold">
            {formik.values.type === "Buy"
              ? formatter({
                  decimal: 2,
                  currency: "NGN",
                  style: "currency",
                }).format(0.0002 * (formik.values.amount ?? 0))
              : "-"}
          </span>
        }
        showIndicator={false}
      />

      <div className="w-full p-3 rounded-[8px] border border-border bg-secondary mb-4 mt-6">
        <h1 className=" text-[14px] leading-[24px] font-semibold">Summary</h1>

        <p className="text-muted-foreground text-[13px] leading-[24px] font-normal">
          You are about to create an ad to{" "}
          <span className="font-semibold text-primary">
            {formik.values.type.toLowerCase() === "buy"
              ? `Buy ${formatter({ decimal: 2 }).format(
                  formik.values.amount || 0,
                )} NGN worth of ${formik.values.asset}`
              : `Sell ${formatter({
                  decimal: 6,
                }).format(formik.values?.amountToken || 0)} ${
                  formik.values.asset
                }`}{" "}
            at{" "}
            {formik.values.priceType?.toLowerCase() === "static"
              ? `${formatter({ decimal: 0 }).format(
                  formik.values.price || 0,
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
        </p>
      </div>
      <div className="flex items-start">
        <InputCheck
          type="checkbox"
          name="agree"
          checked={formik.values.agree}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <span className="text-[12px] pl-2 text-muted-foreground">
          I agree to the platform's Terms and Conditions.
        </span>
      </div>
    </div>
  );
};

export default AdReview;
