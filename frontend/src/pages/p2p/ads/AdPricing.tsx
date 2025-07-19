import { useMemo, useState } from "react"
import { TriangleAlert } from "lucide-react"

import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput"
import PrimaryInput from "../../../components/Inputs/PrimaryInput"
import { PrimaryButton } from "../../../components/buttons/Buttons";
import { AdsProps } from "./Ad";
import Toast from "../../../components/Toast";
import { formatNumber } from "../../../utils/numberFormat";

const CreateAdPricing: React.FC<AdsProps> = ({ formik, setStage,liveRate }) => {
    const [pricingType, setPricingType] = useState("Static")
    const [margin, setMargin] = useState(0)

    const loading = false;

    const currency = [
        { value: "NGN", label: "NGN" },
        // { value: "USD", label: "USD" },
        // { value: "GBP", label: "GBP" },
        // { value: "CAD", label: "CAD" },
    ];

    const pricingTypes = [
        { value: "Static", label: "Static" },
        { value: "Dynamic", label: "Dynamic" },
    ];

    const handleNextStage = async () => {
        try {
            let errors = await formik.validateForm();
            const requiredFields = pricingType.toLowerCase() === "static" ? ["pricingType", "price", "priceLowerLimit", "priceUpperLimit"] : ["pricingType", "priceLowerLimit", "priceUpperLimit", "priceMargin"]
            let updatedErrors = Object.keys(errors).filter(field => requiredFields.includes(field));
            if (updatedErrors.length === 0) {
                setStage("review");
            } else {
                Toast.error(`Please fill all required fields`, "ERROR");                
                formik.setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            }
        } catch (err) {
            console.error("Validation failed", err);
        }
    };

    const CalculateDynamicPrice = useMemo(() => {
        const price =( (liveRate?.xNGN ?? 0) + (margin * (liveRate?.xNGN ?? 0))).toFixed(2)
        // formik.setFieldValue("price",price)
        return price
        
    },[formik, liveRate?.xNGN, margin])

    return (
        <>
            <div className="my-4">
                <MultiSelectDropDown
                    parentId=""
                    title="Static"
                    choices={pricingTypes}
                    error={formik.errors.priceType}
                    touched={formik.touched.priceType}
                    label="Pricing Type"
                    handleChange={(value) => {
                        setPricingType(value)
                        formik.setFieldValue("priceType", value)
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
                        label={pricingType === "Static" ? "Price" : "Current Market Price"}
                        disabled={pricingType === "Static" ? false : true}
                        placeholder="0.00 xNGN"
                        name="price"
                        error={formik.errors.price}
                        value={pricingType === "Static" ?formik.values.price:liveRate?.xNGN}
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
                                placeholder="%"
                                name="margin"
                                type="number"
                                error={formik.errors.priceMargin}
                                value={formik.values.priceMargin}
                                touched={formik.touched.priceMargin}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (/^\d*\.?\d*$/.test(value)) {
                                        formik.setFieldValue('priceMargin', value === '' ? 0 : Number(value));
                                        setMargin(Number(value))
                                    }

                                    // if (/^\d*\.?\d*$/.test(value)) {
                                    //     formik.setFieldValue('priceMargin', value === '' ? 0 : Number(value));
                                    //     setMargin(Number(value))
                                    // }
                                }}
                            />
                        </div>
                          <p>
                    <TriangleAlert color="#F59E0C" size={12} className="inline mr-1" />
                    <span className="text-[#515B6E] text-xs font-light">
                        This price is subject to change during fulfilment of this order due to current market conditions
                    </span>
                </p>
                        {/* <p className="text-[#515B6E] text-xs font-light mb-4">Your current price: <span className="text-[#17A34A]">1 USDT ≈ {CalculateDynamicPrice} xNGN</span></p> */}

                    </>
                ) : <></>
            }
            
            <p className="text-[#515B6E] text-xs font-light mb-4">Market Price: 1 USDT ≈ {formatNumber( liveRate?.xNGN??0)} xNGN</p>

            <div className="mb-4">
                <div className="flex justify-between mb-px">
                    <PrimaryInput
                        css="w-[98%] p-2.5 mr-1"
                        label="Lower Price Limit"
                        placeholder="0.00 xNGN"
                        name="priceLowerLimit"
                        error={formik.errors.priceLowerLimit}
                        value={formik.values.priceLowerLimit}
                        touched={formik.touched.priceLowerLimit}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('priceLowerLimit', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                    <PrimaryInput
                        css="w-full p-2.5"
                        label="Upper price Limit"
                        name="priceUpperLimit"
                        placeholder="0.00 xNGN"
                        error={formik.errors.priceUpperLimit}
                        value={formik.values.priceUpperLimit}
                        touched={formik.touched.priceUpperLimit}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('priceUpperLimit', value === '' ? 0 : Number(value));
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
            <PrimaryButton css="w-full disabled" type="button" text="Continue" loading={loading} onClick={handleNextStage} />
        </>
    );
};

export default CreateAdPricing;