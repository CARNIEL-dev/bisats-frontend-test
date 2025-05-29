import { Pen } from "lucide-react";
import { InputCheck } from "../../../components/Inputs/CheckBox";
import { AdsProps,   } from "./Ad";
import { formatNumber } from "../../../utils/numberFormat";

const AdReview:  React.FC<AdsProps>  = ({ formik, setStage }) => {
    return (
        <div className="text-sm mb-3">
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Transaction Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  onClick={()=>setStage("details")} />
                </p> 
                <p className={formik.values.type === "Buy" ? "text-[#606C82] font-semibold" : "text-red font-semibold"}>
                    {formik.values.type}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Asset
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("details")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.asset}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Limits
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("details")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    <span className="mr-2">Min: {formatNumber(formik.values.minimumLimit)}</span>
                    <span>Max: {formatNumber( formik.values.maximumLimit)}</span>
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Pricing Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceType}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Amount
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formatNumber(formik.values.amount)}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Your Price
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formatNumber(formik.values.price)}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Margin
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceMargin}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Upper Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formatNumber(formik.values.priceUpperLimit)}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Lower Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("pricing")} />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formatNumber(formik.values.priceLowerLimit)}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Currency
                    </span>
                    {/* <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  /> */}
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.currency}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Duration
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82" onClick={() => setStage("details")} />
                </p> 
                <p className="text-[#515B6E] font-semibold text-bold">
                    {/* {formik.values.duration.days}days, {formik.values.duration.hours}hrs, {formik.values.duration.minutes}mins */}
                    {formik.values.expiryDate}
                </p>
            </div>

            <div className="w-full p-3 rounded-[8px] border-[1px] border-[#F3F4F6] bg-[#F9F9FB] my-4">
                <h1 className="text-[#2B313B] text-[14px] leading-[24px] font-[600]">Summary</h1>

                <p className="text-[#606C82] text-[13px] leading-[24px] font-[400]">
                    You are about to create an ad to  <span className="font-[600]">{formik.values.type.toLowerCase() === "buy" ? `Buy ${formatNumber(formik.values.amount)} NGN worth of ${formik.values.asset}` : `Sell ${formatNumber(formik.values.amount)} ${formik.values.asset}`} at {formik.values.priceType?.toLowerCase() === "static" ? `${formik.values.price} NGN/USDT.` : ` a margin of ${formik.values.priceMargin}% ${formik.values.type?.toLowerCase() === "buy" ? "price increase" : "price decrease"} at the current market price during fulfiment of the ad`}</span> <br />
                    Your ad will be paused if market price goes higher than {formatNumber(formik.values.priceUpperLimit)} NGN or Lower than {formatNumber(formik.values.priceLowerLimit)} NGN.
                    Your ad expires on {formik.values.expiryDate} by {formik.values.expiryTime}
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
    )
};

export default AdReview;