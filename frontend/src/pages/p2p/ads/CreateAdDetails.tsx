import { Info } from "lucide-react";
import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput";
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import TokenSelect from "../../../components/Inputs/TokenSelect";
import { PrimaryButton } from "../../../components/buttons/Buttons";
import { AdsProps, } from "./Ad";
import Toast from "../../../components/Toast";
import DateInput from "../../../components/Inputs/DateInput";
import DateTimePicker from "../../../components/Inputs/DateTimePicker";
import TimePicker from "../../../components/Inputs/TimePicker";
import { useMemo, useState } from "react";
// import DateInput from "../../../components/Inputs/DateInput";

const CreateAdDetails: React.FC<AdsProps> = ({ formik, setStage,wallet }) => {
    const [adType, setAdType] = useState('Buy'); 
    const [token, setToken] = useState(''); 

    const loading = false;
    const walletData = wallet?.wallet

    console.log(wallet)
    const type = [
        { value: "Buy", label: "Buy" },
        { value: "Sell", label: "Sell" }
    ];

    const handleNextStage = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            let errors = await formik.validateForm();
            console.log('errors', errors)
            const requiredFields = ["type", "asset", "amount", "minimumLimit", "maximumLimit", "expiryDate", "expiryTime"];
            let updatedErrors = Object.keys(errors).filter(field => {
                return requiredFields.includes(field);
            });
            console.log('errors', errors,updatedErrors)
            if (updatedErrors.length === 0) {
                setStage("pricing");
            } else {
                Toast.error(`Please fill all required fields`, "ERROR" );                
                formik.setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            }
        } catch (err) {
            console.error("Validation failed", err);
        }
    };

   
    const calculateDisplayWalletBallance = useMemo(() => {
        if (adType.toLowerCase() === "buy") {
            return `${walletData?.xNGN} xNGN`
        } else {
            return walletData? `${walletData?.[token]} ${token}`:"-"
        }
    },[adType, token, walletData])
    return (
        <>
            <div className="my-4">
                <MultiSelectDropDown
                    parentId=""
                    title="Buy"
                    choices={type}
                    error={formik.errors.type}
                    touched={formik.touched.type}
                    label="Transaction Type"
                    handleChange={(value) => { formik.setFieldValue("type", value); setAdType(value) }}
                />
            </div>

            <div className="my-4">
                <TokenSelect
                    title="Select option"
                    label="Asset"
                    error={formik.errors.asset}
                    touched={formik.touched.asset}
                    handleChange={(value) => { formik.setFieldValue("asset", value); setToken(value) }}
                    removexNGN={true}
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
                <p className="text-[#515B6E] text-xs font-light">Wallet Balance: {calculateDisplayWalletBallance}</p>
            </div>

            <div className="mb-4">
                <p className="mb-3 text-[#515B6E] font-semibold text-sm">Limits (in NGN)</p>
                <div className="flex justify-between mb-[1px]">
                    <PrimaryInput
                        css="w-[98%] p-2.5 mr-1"
                        label="Minimum"
                        placeholder="0"
                        name="minimumLimit"
                        error={formik.errors.minimumLimit}
                        value={formik.values.minimumLimit}
                        touched={formik.touched.minimumLimit}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('minimumLimit', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                    <PrimaryInput
                        css="w-[100%] p-2.5"
                        label="Maximum"
                        placeholder="0"
                        name="maximumLimit"
                        error={formik.errors.maximumLimit}
                        value={formik.values.maximumLimit}
                        touched={formik.touched.maximumLimit}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('maximumLimit', value === '' ? 0 : Number(value));
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

            <div className="mb-4 w-full flex items-center">
                <div className="flex justify-between mb-[1px] w-1/2">
                <DateInput 
                        name="expiryDate"
                        label="Expiry Date"
                        error={formik.errors.expiryDate}
                        touched={formik.errors.expiryDate}
                        handleChange={(e) => {
                            const value = e.target.value;
                            
                                formik.setFieldValue('expiryDate', value);
                            
                        } } title="expiryDate" />
                    {/* <p className="mb-3 text-[#515B6E] font-semibold text-sm">Expiry Date</p> */}
                </div>
                <div className="flex justify-between mb-[1px] w-1/2 ml-3">

                <TimePicker
                    label="Expiry Time"
                    error={formik.errors.expiryTime}
                    touched={formik.errors.expiryTime}
                    handleChange={(value) => { formik.setFieldValue('expiryTime', value.target.value) }}
                    title={"expiryTime"}
                    name={"expiryTime"} />
</div>
                
            </div>
            <PrimaryButton
                css={`w-full `}
                // disabled={formik.errors ? true : false}
                text="Continue"
                type="button"
                loading={loading}
                onClick={(e) => handleNextStage(e)}
 />
            
        </>
    )
}

export default CreateAdDetails