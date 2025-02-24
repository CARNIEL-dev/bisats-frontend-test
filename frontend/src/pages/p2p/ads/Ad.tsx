import { useState } from "react"
import { useFormik, useFormikContext } from "formik"
import { useSelector } from "react-redux"
import * as Yup from 'yup'

import { PrimaryButton } from "../../../components/buttons/Buttons"
import Toast from "../../../components/Toast"
import Head from "../../wallet/Head"
import { UserState } from "../../../redux/reducers/userSlice"
import CreateAdDetails from "./CreateAdDetails"
import CreateAdPricing from "./AdPricing"
import AdReview from "./AdReview"

export type TNetwork = {
    label: string,
    value: string
}

interface IAd {
    transactionType: string,
    pricingType: string,
    currency: string,
    margin: number,
    asset: string,
    amount: number,
    price: number,
    limits: {
        min: number,
        max: number
    },
    priceLimits: {
        upper: number,
        lower: number
    };
    duration: {
        days: number,
        hours: number,
        minutes: number
    }
}

const initialAd: IAd = {
    transactionType: "",
    asset: "",
    amount: 0,
    pricingType: "",
    price: 0,
    currency: "NGN",
    margin: 0.5,
    limits: {
        min: 0,
        max: 0
    },
    priceLimits: {
        upper: 0,
        lower: 0
    },
    duration: {
        days: 0,
        hours: 0,
        minutes: 0
    }
}

const AdSchema = Yup.object().shape({
    transactionType: Yup.string().required('Transaction type is required'),
    asset: Yup.string().required('Asset selection is required'),
    amount: Yup.number()
        .min(0, 'Amount must be greater than 0')
        .required('Amount is required'),
    pricingType: Yup.string().required('Pricing type is required'),
    currency: Yup.string().required('Currency selection is required'),
    margin: Yup.number().nullable(),
    price: Yup.number()
        .min(0, 'Price must be greater than 0')
        .required('Price is required'),
    priceLimits: Yup.object().shape({
        lower: Yup.number()
            .min(0, 'Lower limit must be greater than 0')
            .required('Lower limit is required'),
        upper: Yup.number()
            .min(Yup.ref('min'), 'Upper limit must be greater than lower limit')
            .required('Upper limit is required')
    }),
    limits: Yup.object().shape({
        min: Yup.number()
            .min(0, 'Minimum limit must be greater than 0')
            .required('Minimum limit is required'),
        max: Yup.number()
            .min(Yup.ref('min'), 'Maximum limit must be greater than minimum limit')
            .required('Maximum limit is required')
    }),
    duration: Yup.object().shape({
        days: Yup.number()
            .min(0, 'Days must be greater than or equal to 0')
            .required('Days is required'),
        hours: Yup.number()
            .min(0, 'Hours must be greater than or equal to 0')
            .max(23, 'Hours must be less than 24')
            .required('Hours is required'),
        minutes: Yup.number()
            .min(0, 'Minutes must be greater than or equal to 0')
            .max(59, 'Minutes must be less than 60')
            .required('Minutes is required')
    })
});

const CreateAd = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState("details")
    const user: UserState = useSelector((state: any) => state.user);

    const formik = useFormik({
        initialValues: initialAd,
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
        <div className="w-full lg:w-1/3 mx-auto h-full lg:items-center">
            <Head header="Create an Ad" subHeader="Buy or sell assets with your own preferred price." />

            <form onSubmit={formik.handleSubmit}>
                {
                    stage === "details" ? (
                        <CreateAdDetails formik={formik} setStage={setStage} />
                    ) : (
                        stage === "pricing" ? (
                            <CreateAdPricing formik={formik} setStage={setStage} />
                        ) : (
                            <>
                                <AdReview adValues={formik.values}  />
                                <PrimaryButton css="w-full" text="Continue" loading={isLoading} />
                            </>
                        )
                    )
                }
            </form>
        </div>
    );
};

export default CreateAd;