import { Info, TriangleAlert } from "lucide-react";
import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput";
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import TokenSelect from "../../../components/Inputs/TokenSelect";
import { PrimaryButton } from "../../../components/buttons/Buttons";
import { AdsProps, } from "./Ad";
import Toast from "../../../components/Toast";
import DateInput from "../../../components/Inputs/DateInput";
import TimePicker from "../../../components/Inputs/TimePicker";
import { useMemo, useState } from "react";
import { AccountLevel, bisats_limit } from "../../../utils/transaction_limits"
import { UserState } from "../../../redux/reducers/userSlice";
import { useSelector } from "react-redux";
import { formatNumber } from "../../../utils/numberFormat";
// import DateInput from "../../../components/Inputs/DateInput";

const CreateAdDetails: React.FC<AdsProps> = ({ formik, setStage, wallet ,liveRate}) => {
        const [pricingType, setPricingType] = useState("Static")
    const [adType, setAdType] = useState('Buy'); 
    const [token, setToken] = useState(''); 

    const currency = [
        { value: "NGN", label: "NGN" },
 
    ];
    const loading = false;
    const walletData = wallet?.wallet

    const userState: UserState= useSelector((state: any) => state.user);
    const user = userState.user
   const account_level=user?.accountLevel as AccountLevel
    const userTransactionLimits = bisats_limit[account_level]

    const type = [
        { value: "Buy", label: "Buy" },
        { value: "Sell", label: "Sell" }
    ];

    const handleNextStage = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            let errors = await formik.validateForm();
            console.log('errors', errors)
            const requiredFields = ["type", "asset", "amount", "minimumLimit", "maximumLimit", "expiryDate", "expiryTime", "price", "priceLowerLimit", "priceUpperLimit"];
            const requiredFieldsForToken = ["type", "asset", "amountToken", "minimumLimit", "maximumLimit", "expiryDate", "expiryTime", "price", "priceLowerLimit", "priceUpperLimit"];

            let updatedErrors = Object.keys(errors).filter(field => {
                return formik.values.type.toLowerCase() === "buy" ? requiredFields.includes(field) : requiredFieldsForToken.includes(field);
            });
            console.log('errors', errors,updatedErrors)
            if (updatedErrors.length === 0) {
                setStage("review");
            } else {
                Toast.error(`Please fill all required fields`, "ERROR");    
                formik.values.type.toLowerCase() === "buy" ?
                    formik.setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})):
                formik.setTouched(requiredFieldsForToken.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            }
        } catch (err) {
            console.error("Validation failed", err);
        }
    };

   
    const calculateDisplayWalletBallance = useMemo(() => {
        console.log(adType)
        if (adType.toLowerCase() === "buy") {
            return `${formatNumber(walletData?.xNGN)} xNGN`
        } else {
            return walletData? `${formatNumber( walletData?.[token])} ${token}`:"-"
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
                    type="text" // or at least if it's number, make sure you add step="any"
                    step="any"
                    inputMode="decimal"
                    format={true}
                    name={formik.values.type.toLowerCase() === "buy" ? "amount":"amountToken"}
                    error={formik.values.type.toLowerCase() === "buy" ? formik.errors.amount : formik.errors.amountToken}
                    value={formik.values.type.toLowerCase() === "buy" ? formik.values.amount : formik.values.amountToken}
                    touched={formik.values.type.toLowerCase() === "buy" ? formik.touched.amount : formik.touched.amountToken}
                    maxFnc={() =>
                        formik.values.type.toLowerCase() === "buy" ? formik.setFieldValue('amount', walletData?.xNGN === '' ? 0 : Number(walletData?.xNGN)) :
                            formik.setFieldValue('amountToken', walletData?.token === '' ? 0 : Number(walletData?.[token]))}
                    onChange={(e) => {
                        const value = e.target.value;

                        const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

                        if (isValidDecimal) {
                            const fieldName = formik.values.type.toLowerCase() === 'buy' ? 'amount' : 'amountToken';
                            formik.setFieldValue(fieldName, value);
                        }
                    }}
                              
                              
                />
                <p className="text-[#515B6E] text-xs font-light">Wallet Balance: { (calculateDisplayWalletBallance)}</p>
            </div>
               <div className="flex mb-1">
                            <div className="w-[90%] mr-1">
                                <PrimaryInput
                                    css="w-full p-2.5"
                                    label={pricingType === "Static" ? "Price" : "Current Market Price"}
                                    disabled={pricingType === "Static" ? false : true}
                        placeholder="0.00 xNGN"
                        type="text" // or at least if it's number, make sure you add step="any"
                        step="any"
                        name="price"
                        format={true}

                                    error={formik.errors.price}
                                    value={pricingType === "Static" ?formik.values.price:liveRate?.xNGN}
                        touched={formik.touched.price}
                        
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
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
             <div className="mb-4">
                            <div className="flex justify-between mb-[1px]">
                                <PrimaryInput
                                    css="w-[98%] p-2.5 mr-1"
                                    label="Lower Price Limit"
                                    placeholder="0.00 xNGN"
                        name="priceLowerLimit"
                        format

                                    error={formik.errors.priceLowerLimit}
                                    value={formik.values.priceLowerLimit}
                                    touched={formik.touched.priceLowerLimit}
                                    onChange={(e) => {
                                        const value = e.target.value;
            
                                        if (/^\d+(\.\d{0,})?$/.test(value)) {
                                            formik.setFieldValue('priceLowerLimit', value === '' ? 0 : Number(value));
                                        }
                                    }}
                                />
                                <PrimaryInput
                                    css="w-[100%] p-2.5"
                                    label="Upper price Limit"
                                    name="priceUpperLimit"
                        placeholder="0.00 xNGN"
                        format

                                    error={formik.errors.priceUpperLimit}
                                    value={formik.values.priceUpperLimit}
                                    touched={formik.touched.priceUpperLimit}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d+(\.\d{0,})?$/.test(value)) {
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

            <div className="mb-4">
                <p className="mb-3 text-[#515B6E] font-semibold text-sm">Limits (in NGN)</p>
                <div className="flex flex-col lg:flex-wrap   justify-between mb-[1px]">
                    <PrimaryInput
                        css="w-[98%] p-2.5 mr-1"
                        label={`Minimum (xNGN${formik.values.type === "buy" ? formatNumber(userTransactionLimits?.lower_limit_buy_ad) : formatNumber(userTransactionLimits?.lower_limit_sell_ad)})`}
                        placeholder="0"
                        name="minimumLimit"
                        format

                        min={formik.values.type === "buy" ? userTransactionLimits?.lower_limit_buy_ad : userTransactionLimits?.lower_limit_sell_ad}
                        error={formik.errors.minimumLimit}
                        value={formik.values.minimumLimit}
                        touched={formik.touched.minimumLimit}

                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d+(\.\d{0,})?$/.test(value)) {
                                formik.setFieldValue('minimumLimit', value === '' ? 0 : Number(value));
                            }
                        }}
                    />
                    <PrimaryInput
                        css="w-[100%] p-2.5"
                        label={`Maximum (xNGN  ${formatNumber(formik.values.type==="buy"? userTransactionLimits?.upper_limit_buy_ad:userTransactionLimits?.upper_limit_sell_ad)})`}
                        placeholder="0"
                        name="maximumLimit"
                        format

                        max={formik.values.type === "buy" ? userTransactionLimits?.upper_limit_buy_ad : userTransactionLimits?.upper_limit_sell_ad}
                        error={formik.errors.maximumLimit}
                        value={formik.values.maximumLimit}
                        touched={formik.touched.maximumLimit}
                        maxFnc={() =>
                        {
                            if (adType.toLowerCase()=== "sell") {
                                console.log(formik.values.amountToken,formik.values.price)
                               return formik.setFieldValue('maximumLimit', (Number(  formik.values.amountToken) * Number(formik.values.price)) >= userTransactionLimits?.upper_limit_buy_ad ? userTransactionLimits?.upper_limit_buy_ad : (Number(formik.values.amountToken) * Number(formik.values.price)))

                            } else {
                                return formik.setFieldValue('maximumLimit', (Number(formik.values.amount) >= userTransactionLimits?.upper_limit_buy_ad ? userTransactionLimits?.upper_limit_buy_ad : (Number(formik.values.amount))))
                            }
                        }
                            
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d+(\.\d{0,})?$/.test(value)) {
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