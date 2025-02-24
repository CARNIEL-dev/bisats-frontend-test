import { useState } from "react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import { TriangleAlert } from "lucide-react"
import * as Yup from 'yup'

import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput"
import { PrimaryButton } from "../../../components/buttons/Buttons"
import PrimaryInput from "../../../components/Inputs/PrimaryInput"
import Toast from "../../../components/Toast"
import Head from "../../wallet/Head"
import { UserState } from "../../../redux/reducers/userSlice"

export type TNetwork = {
    label: string,
    value: string
}

interface IPricingAd {
    pricingType: string,
    price: number,
    currency: string,
    margin: number,
    limits: {
        upper: number,
        lower: number
    };
}

const initialPricingAd: IPricingAd = {
    pricingType: "",
    price: 0,
    currency: "NGN",
    margin: 0.5,
    limits: {
        lower: 0,
        upper: 0
    },
}

const AdSchema = Yup.object().shape({
    pricingType: Yup.string().required('Pricing type is required'),
    currency: Yup.string().required('Currency selection is required'),
    margin: Yup.number().nullable(),
    price: Yup.number()
        .min(0, 'Price must be greater than 0')
        .required('Price is required'),
    limits: Yup.object().shape({
        lower: Yup.number()
            .min(0, 'Lower limit must be greater than 0')
            .required('Lower limit is required'),
        upper: Yup.number()
            .min(Yup.ref('min'), 'Upper limit must be greater than lower limit')
            .required('Upper limit is required')
    })
});

const CreateAdPricing = () => {
    const [isLoading, setIsLoading] = useState(false);
    const user: UserState = useSelector((state: any) => state.user);
    const [pricingType, setPricingType] = useState("Static")

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

    const formik = useFormik({
        initialValues: initialPricingAd,
        validationSchema: AdSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = {
                    ...values,
                    userId: user?.user?.userId,
                };
                console.log(payload)
                // const response = await submitAds(payload);
                // if (response.statusCode === 200) {
                //     Toast.success(response.message, "Success");
                // } else {
                //     Toast.error(response.message, "Error");
                // }
            } catch (error) {
                Toast.error("Failed to create ad", "Error");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="w-full lg:w-1/3 mx-auto h-full lg:items-center sm:px-4">
            <Head header="Create an Ad" subHeader="Buy or sell assets with your own preferred price." />

            <form onSubmit={formik.handleSubmit}>
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
                                    name="amount"
                                    error={formik.errors.margin}
                                    value={formik.values.margin}
                                    touched={formik.touched.margin}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            formik.setFieldValue('amount', value === '' ? 0.5 : Number(value));
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
                            name="limits.lower"
                            error={formik.errors.limits?.lower}
                            value={formik.values.limits.lower}
                            touched={formik.touched.limits?.lower}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('limits.lower', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                        <PrimaryInput
                            css="w-[100%] p-2.5"
                            label="Upper price Limit"
                            name="limits.upper"
                            error={formik.errors.limits?.upper}
                            value={formik.values.limits.upper}
                            touched={formik.touched.limits?.upper}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('limits.upper', value === '' ? 0 : Number(value));
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

                <PrimaryButton css="w-full" text="Continue" loading={isLoading} />
            </form>
        </div>
    );
};

export default CreateAdPricing;