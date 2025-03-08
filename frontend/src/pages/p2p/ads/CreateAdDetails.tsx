import { Info } from "lucide-react";
import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput";
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import TokenSelect from "../../../components/Inputs/TokenSelect";
import { PrimaryButton } from "../../../components/buttons/Buttons";
 
const CreateAdDetails = ({ formik, setStage }: any) => {
    const loading = false;
    const transactionType = [
        { value: "Buy", label: "Buy" },
        { value: "Sell", label: "Sell" }
    ];

    const handleNextStage = async () => {
        try {
            console.log(formik.values)
            let errors = await formik.validateForm();
            console.log('errors', errors)
            const requiredFields = ["transactionType", "asset", "amount", "limits.min", "limits.max", "duration.days", "duration.hours", "duration.minutes"];
            errors = Object.keys(errors).filter(field => {
                console.log(field);
                return requiredFields.includes(field);
            });
            console.log('errors', errors)
            if (errors.length === 0) {
                setStage("pricing");
            } else {
                console.log(formik.values)
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
                    title="Buy"
                    choices={transactionType}
                    error={formik.errors.transactionType}
                    touched={formik.touched.transactionType}
                    label="Transaction Type"
                    handleChange={(value) => formik.setFieldValue("transactionType", value)}
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
                            console.log(value)
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
            <PrimaryButton css="w-full disabled" text="Continue" loading={loading} onClick={handleNextStage} />
        </>
    )
}

export default CreateAdDetails