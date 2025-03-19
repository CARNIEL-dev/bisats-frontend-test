import { useState } from "react"
import { FormikProps, useFormik } from "formik"
import { useSelector } from "react-redux"
import * as Yup from 'yup'

import { PrimaryButton } from "../../../components/buttons/Buttons"
import Toast from "../../../components/Toast"
import Head from "../../wallet/Head"
import { UserState } from "../../../redux/reducers/userSlice"
import CreateAdDetails from "./CreateAdDetails"
import CreateAdPricing from "./AdPricing"
import AdReview from "./AdReview"
import { BACKEND_URLS } from "../../../utils/backendUrls"
import Bisatsfetch from "../../../redux/fetchWrapper"

export type TNetwork = {
    label: string,
    value: string
}

export interface IAd {
    type: string,
    priceType: string,
    currency: string,
    priceMargin: number,
    asset: string,
    amount: number,
    price: number,
    minimumLimit: number,
    maximumLimit: number,
    priceUpperLimit: number, 
    priceLowerLimit: number,
    expiryDate: string
    agree?: boolean
}

const initialAd: IAd = {
    type: "Buy",
    asset: "",
    amount: 0,
    priceType: "Static",
    price: 0,
    currency: "NGN",
    priceMargin: 0.5,
    minimumLimit: 0,
    maximumLimit: 0,
    priceUpperLimit: 0, 
    priceLowerLimit: 0,
    expiryDate: "",
    agree: false
}

export interface AdsProps {
    formik: FormikProps<IAd>,
    setStage: React.Dispatch<React.SetStateAction<string>>
}

const AdSchema = Yup.object().shape({
    type: Yup.string().required('Transaction type is required'),
    asset: Yup.string().required('Asset selection is required'),
    amount: Yup.number()
        .min(1, 'Amount must be greater than 0')
        .required('Amount is required'),
    priceType: Yup.string().required('Pricing type is required'),
    currency: Yup.string().required('Currency selection is required'),
    priceMargin: Yup.number().nullable(),
    price: Yup.number()
        .min(1, 'Price must be greater than 0')
        .required('Price is required'),
    priceLowerLimits: Yup.number()
            .min(1, 'Lower limit must be greater than 0')
            .required('Lower limit is required'),
    priceUpperLimits:Yup.number()
        .min(Yup.ref('min'), 'Upper limit must be greater than lower limit')
        .required('Upper limit is required'),
    priceLowerLimit: Yup.number()
        .min(1, 'Minimum limit must be greater than 0')
        .required('Minimum limit is required'),
    priceUpperLimit: Yup.number()
        .min(Yup.ref('min'), 'Maximum limit must be greater than minimum limit')
        .required('Maximum limit is required'),
    expiryDate: Yup.date()
});

const CreateAd = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState("details")
    const user: UserState = useSelector((state: any) => state.user);

    const formik = useFormik<IAd>({
        initialValues: { ...initialAd, agree: false  },
        validationSchema: AdSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            console.log(values);
            try {
                const payload = {
                    ...values,
                    userId: user?.user?.userId,
                };
                console.log(payload)
                const response = await Bisatsfetch(BACKEND_URLS.P2P.ADS.CREATE, {
                    method: "POST",
                    body: JSON.stringify(payload),
                  });
                console.log(response)
                Toast.success(response.message, "Success");
            } catch (error) {
                Toast.error("Failed to create ad", "Error");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="w-full lg:w-1/3 mx-auto h-full lg:items-center px-4">
            <Head header="Create an Ad" subHeader="Buy or sell assets with your own preferred price." />

            <form>
                {
                    stage === "details" ? (
                        <CreateAdDetails formik={formik} setStage={setStage} />
                    ) : (
                        stage === "pricing" ? (
                            <CreateAdPricing formik={formik} setStage={setStage} />
                        ) : (
                            <>
                                <AdReview formik={formik}  />
                                <PrimaryButton css="w-full disabled" type="button" text="Continue" loading={isLoading} onClick={() => formik.handleSubmit()} />
                            </>
                        )
                    )
                }
            </form>
        </div>
    );
};

export default CreateAd;