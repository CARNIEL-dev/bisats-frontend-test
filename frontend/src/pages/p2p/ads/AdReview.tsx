import { Pen } from "lucide-react";
import { InputCheck } from "../../../components/Inputs/CheckBox";
import { FormikProps } from "formik";
import { IAdRequest } from "./Ad";

const AdReview: React.FC<{ formik: FormikProps<IAdRequest> }> = ({ formik }) => {
    return (
        <div className="text-sm mb-3">
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Transaction Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className={formik.values.type === "Buy" ? "text-[#606C82] font-semibold" : "text-red font-semibold"}>
                    {formik.values.type}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Asset
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.asset}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Limits
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    <span className="mr-2">Min: {formik.values.minimumLimit}</span>
                    <span>Max: {formik.values.maximumLimit}</span>
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Pricing Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceType}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Amount
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.amount}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Your Price
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.price}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Margin
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceMargin}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Upper Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceUpperLimit}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Lower Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.priceLowerLimit}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Currency
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {formik.values.currency}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Duration
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold text-bold">
                    {/* {formik.values.duration.days}days, {formik.values.duration.hours}hrs, {formik.values.duration.minutes}mins */}
                    {formik.values.expiryDate}
                </p>
            </div>
            <div>
                <InputCheck type="checkbox"
                    name="agreeToTerms"
                    checked={formik.values.agree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <span className="text-xs text-[#606C82]">
                    I agree to the platform's Terms and Conditions.
                </span>
            </div>
        </div>
    )
};

export default AdReview;