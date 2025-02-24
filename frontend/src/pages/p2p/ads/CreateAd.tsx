import { useState } from "react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import { Info } from "lucide-react"
import * as Yup from 'yup'

import TokenSelect from "../../../components/Inputs/TokenSelect"
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

interface IAd {
    type: string,
    asset: string,
    amount: number,
    limits: {
        min: number,
        max: number
    },
    duration: {
        days: number,
        hours: number,
        minutes: number
    }
}

const initialAd: IAd = {
    type: "",
    asset: "",
    amount: 0,
    limits: {
        min: 0,
        max: 0
    },
    duration: {
        days: 0,
        hours: 0,
        minutes: 0
    }
}

const AdSchema = Yup.object().shape({
    type: Yup.string().required('Transaction type is required'),
    asset: Yup.string().required('Asset selection is required'),
    amount: Yup.number()
        .min(0, 'Amount must be greater than 0')
        .required('Amount is required'),
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
    const user: UserState = useSelector((state: any) => state.user);

    const networks = [
        { value: "Buy", label: "Buy" },
        { value: "Sell", label: "Sell" }
    ];

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
                <div className="my-4">
                    <MultiSelectDropDown
                        parentId=""
                        title="Buy"
                        choices={networks}
                        error={formik.errors.type}
                        touched={formik.touched.type}
                        label="Transaction Type"
                        handleChange={(value) => formik.setFieldValue("type", value)}
                    />
                </div>

                <div className="my-4">
                    <TokenSelect
                        title="Select option"
                        label="Asset"
                        error={formik.errors.asset}
                        touched={formik.touched.asset}
                        handleChange={(value) => formik.setFieldValue("asset", value)}
                    />
                </div>

                <div className="mb-4">
                    <PrimaryInput
                        css="w-full p-2.5"
                        label="Amount to be deposited in Ad Escrow"
                        placeholder="0"
                        name="amount"
                        error={formik.errors.amount}
                        value={formik.values.amount}
                        touched={formik.touched.amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('amount', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                    <p className="text-[#515B6E] text-xs font-light">Wallet Balance: {/* Add wallet balance here */}</p>
                </div>

                <div className="mb-4">
                    <p className="mb-3 text-[#515B6E] font-semibold text-sm">Limits (in NGN)</p>
                    <div className="flex justify-between mb-[1px]">
                        <PrimaryInput
                            css="w-[98%] p-2.5 mr-1"
                            label="Minimum"
                            placeholder="0"
                            name="limits.min"
                            error={formik.errors.limits?.min}
                            value={formik.values.limits.min}
                            touched={formik.touched.limits?.min}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('limits.min', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                        <PrimaryInput
                            css="w-[100%] p-2.5"
                            label="Maximum"
                            placeholder="0"
                            name="limits.max"
                            error={formik.errors.limits?.max}
                            value={formik.values.limits.max}
                            touched={formik.touched.limits?.max}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('limits.max', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                    </div>
                    <p>
                        <Info color="#17A34A" size={12} className="inline mr-1" />
                        <span className="text-[#515B6E] text-xs font-light">
                            Set limits to control the size of transactions for this ad.
                        </span>
                    </p>
                </div>

                <div className="mb-4">
                    <p className="mb-3 text-[#515B6E] font-semibold text-sm">Ad Duration</p>
                    <div className="flex justify-between mb-[1px]">
                        <PrimaryInput
                            css="w-[96%] p-2.5 mr-1"
                            label="Days"
                            placeholder="0"
                            name="duration.days"
                            error={formik.errors.duration?.days}
                            value={formik.values.duration.days}
                            touched={formik.touched.duration?.days}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('duration.days', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                        <PrimaryInput
                            css="w-[96%] p-2.5 mr-1"
                            label="Hours"
                            placeholder="0"
                            name="duration.hours"
                            error={formik.errors.duration?.hours}
                            value={formik.values.duration.hours}
                            touched={formik.touched.duration?.hours}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('duration.hours', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                        <PrimaryInput
                            css="w-[100%] p-2.5"
                            label="Minutes"
                            placeholder="0"
                            name="duration.minutes"
                            error={formik.errors.duration?.minutes}
                            value={formik.values.duration.minutes}
                            touched={formik.touched.duration?.minutes}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    formik.setFieldValue('duration.minutes', value === '' ? 0 : Number(value));
                                }
                            }}
                        />
                    </div>
                </div>

                <PrimaryButton css="w-full" text="Continue" loading={isLoading} />
            </form>
        </div>
    );
};

export default CreateAd;