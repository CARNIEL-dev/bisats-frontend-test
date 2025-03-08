import { useState } from "react"
import { TriangleAlert } from "lucide-react"

import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput"
import PrimaryInput from "../../../components/Inputs/PrimaryInput"
import { PrimaryButton } from "../../../components/buttons/Buttons";

const CreateAdPricing = ({ formik, setStage }: any) => {
    const [pricingType, setPricingType] = useState("Static")
    const loading = false;

    const currency = [
        { value: "NGN", label: "NGN" },
        { value: "USD", label: "USD" },
        { value: "GBP", label: "GBP" },
        { value: "CAD", label: "CAD" },
    ];

    const pricingTypes = [
        { value: "Static", label: "Static" },
        { value: "Dynamic", label: "Dynamic" },
    ];

    const handleNextStage = async () => {
        try {
            let errors = await formik.validateForm();
            const requiredFields = ["pricingType", "price", "priceLimits.lower", "priceLimits.upper"];
            errors = Object.keys(errors).filter(field => requiredFields.includes(field));
            if (errors.length === 0) {
                setStage("review");
            } else {
                formik.setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            }
        } catch (err) {
            console.error("Validation failed", err);
        }
    };

    return (
        <>
            <div className="my-4">
                <MultiSelectDropDown
                    parentId=""
                    title="Static"
                    choices={pricingTypes}
                    error={formik.errors.pricingType}
                    touched={formik.touched.pricingType}
                    label="Pricing Type"
                    handleChange={(value) => {
                        setPricingType(value)
                        formik.setFieldValue("pricingType", value)
                    }}
                />
                <p className="mt-1">
                    <TriangleAlert color="#F59E0C" size={12} className="inline mr-1" />
                    <span className="text-[#515B6E] text-xs font-light">
                        Static places a fixed price, while dynamic gives room for adjustment based fluctuations in market rates.
                    </span>
                </p>
            </div>

            <div className="flex mb-1">
                <div className="w-[90%] mr-1">
                    <PrimaryInput
                        css="w-full p-2.5"
                        label={pricingType === "Static" ? "Price" : "Market Price"}
                        placeholder="0.0"
                        name="price"
                        error={formik.errors.price}
                        value={formik.values.price}
                        touched={formik.touched.price}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('price', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                </div>
                <div className="w-[20%]">
                    <MultiSelectDropDown
                        parentId=""
                        title="NGN"
                        choices={currency}
                        error={formik.errors.currency}
                        touched={formik.touched.currency}
                        label="Currency"
                        handleChange={(value) => formik.setFieldValue("currency", value)}
                    />
                </div>
            </div>
            {
                pricingType === "Dynamic" ? (
                    <>
                        <div className="mt-3 mb-1">
                            <PrimaryInput
                                css="w-full p-2.5"
                                label="Margin relative to the market price (%)"
                                placeholder="0.5"
                                name="margin"
                                error={formik.errors.margin}
                                value={formik.values.margin}
                                touched={formik.touched.margin}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        formik.setFieldValue('margin', value === '' ? 0 : Number(value));
                                    }
                                }}
                            />
                        </div>
                    </>
                ) : <></>
            }
            
            <p className="text-[#515B6E] text-xs font-light mb-4">Market Price: 1 USDT ≈ 1,661.66166 xNGN</p>

            <div className="mb-4">
                <div className="flex justify-between mb-[1px]">
                    <PrimaryInput
                        css="w-[98%] p-2.5 mr-1"
                        label="Lower Price Limit"
                        placeholder="0"
                        name="priceLimits.lower"
                        error={formik.errors.limits?.lower}
                        value={formik.values.limits.lower}
                        touched={formik.touched.limits?.lower}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('priceLimits.lower', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                    <PrimaryInput
                        css="w-[100%] p-2.5"
                        label="Upper price Limit"
                        name="upperLimits.upper"
                        error={formik.errors.limits?.upper}
                        value={formik.values.limits.upper}
                        touched={formik.touched.limits?.upper}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('upperLimits.upper', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                </div>
                <p>
                    <TriangleAlert color="#F59E0C" size={12} className="inline mr-1" />
                    <span className="text-[#515B6E] text-xs font-light">
                        Your ad will be paused if the market price gets to these prices
                    </span>
                </p>
            </div>
            <PrimaryButton css="w-full disabled" text="Continue" loading={loading} onClick={handleNextStage} />
        </>
    );
};

export default CreateAdPricing;