import {  useMemo, useState } from "react";
import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons"
import PrimaryInput from "../Inputs/PrimaryInput";
import ModalTemplate from "./ModalTemplate";
import { useSelector } from "react-redux";
import { UserState } from "../../redux/reducers/userSlice";
import Toast from "../Toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { formatNumber } from "../../utils/numberFormat";
import { AccountLevel, bisats_limit } from "../../utils/transaction_limits";
import * as Yup from 'yup'
import { WalletState } from "../../redux/reducers/walletSlice";

interface Props {
    close: () => void;
    ad?: { id: string; price: string; type: string; asset: string; amount: string; minimumLimit: string; maximumLimit: string; }
}


type TEditAd = {
    minimumLimit: string,
    maximumLimit: string,
    amount: string,
    price: string,
    agree?: boolean

}



const EditAd: React.FC<Props> = ({ close, ad }) => {
    const [amount, setAmount] = useState(ad?.amount)
    const [price, setPrice] = useState(ad?.price)

    const [minimumLimit, setMinimumLimit] = useState(ad?.minimumLimit)

    const [maximumLimit, setMaximumLimit] = useState(ad?.maximumLimit)

    const initialAd: TEditAd = {

        amount: ad?.amount??"0",
        price: ad?.price??"0",
        minimumLimit: ad?.minimumLimit??"0",
        maximumLimit: ad?.maximumLimit??"0",
        agree: false
    }
    const navigate= useNavigate()
    const walletState: WalletState = useSelector((state: any) => state.wallet);
    const userState: UserState = useSelector((state: any) => state.user);
    const user = userState.user
    
    const account_level=user?.accountLevel as AccountLevel
    const userTransactionLimits = bisats_limit[account_level]
 
    const walletData = walletState?.wallet
    const calculateDisplayWalletBallance: number  = useMemo(() => {
        if (ad?.type.toLowerCase() === "buy") {
            return walletData?.xNGN;
        } else {
            return walletData ? walletData?.[ad?.asset??"USDT"] : 0;
        }

    }, [ad?.asset, ad?.type, walletData]);
 
     const AdSchema = Yup.object().shape({

         
            price: Yup.number()
                .min(1, 'Price must be greater than 0')
                .required('Price is required'),
            amount: Yup.number()
                .min(1, 'Amount must be greater than 0')
                .max(userTransactionLimits?.maximum_ad_creation_amount, `Amount must not exceed ${formatNumber(userTransactionLimits?.maximum_ad_creation_amount)} xNGN`) 
                .test(
                    'max-wallet-balance',
                    'Amount cannot exceed your current wallet balance',
                    function (value) {
                        if (typeof value !== 'number') return false; // or return true if you want to skip
                        return value <= calculateDisplayWalletBallance;
                    }
            ).when('type', {
                is: (val: string) => val?.toLowerCase() === 'buy',
                then: schema => schema.required('Amount is required'),
                otherwise: schema => schema.notRequired(),
                  }),
        
            minimumLimit: Yup.number()
                .min(15000, 'Minimum must be greater than 15,000 xNGN')
                .max(23000000, 'Price must not exceed 23,000,000 xNGN').required()
    
                // .when('amount', (amount, schema) =>
                //     schema.max(Number(amount), 'Minimum must be less than or equal to amount')
                // )
                .required('Minimum is required'),
    
            maximumLimit: Yup.number()
                .min(15000, 'Maximum must be greater than Minimum')
                .max(23000000, 'Price must not exceed 23,000,000 xNGN').required(),
    
    
        });
    

    const [isLoading, setIsLoading] = useState(false)



     const formik = useFormik<TEditAd>({
            initialValues: { ...initialAd, agree: false  },
            validationSchema: AdSchema,
            onSubmit: async (values) => {
                console.log(values);
    
    
                if (!values.agree) {
                    Toast.error("Agree to the terms of use", "Agree to the terms")
                    return
                }

                setIsLoading(true);
    
                // try {
                //     const payload = {
                //         userId: user?.userId??"",
                //         amount: Number(values.amount),
                //         minimumLimit: Number(values.minimumLimit),
                //         maximumLimit: Number(values.maximumLimit),
                //         price: Number(values.price),
                    
    
                    
                //     };
                //     const response = await console.log(payload)
                //     if (response?.status) {
                //         Toast.success(response?.message, "Add created");
                //         navigate(APP_ROUTES.P2P.MY_ADS)
    
                //     } else {
                //         Toast.error(response.message, "Failed to create");
    
                //     }
                // } catch (error) {
                //     Toast.error("Failed to create ad", "Error");
                // } finally {
                //     setIsLoading(false);
                // }
            },
     });
    
   

  


    return (
        <ModalTemplate onClose={close}>
            <div className='relative text-left pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Edit Ad</h1>
                <div className="my-5">
                    <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] w-full ">
                        <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] ">{ad?.type} Ad</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">NGN/{ad?.asset}</p>
                        </div>
                        <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] ">Ad Price</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">{ formatNumber(ad?.price??0)}/NGN</p>
                        </div>
                        <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] ">{ad?.type} Ad</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">NGN/{ad?.asset}</p>
                        </div>
                        </div>
                  

                    <div className="my-3">
                        <PrimaryInput css={"w-full py-2 "} label={"Price"} error={undefined} touched={undefined}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits
                                const numericValue = value.replace(/\D/g, '');
                                setPrice(numericValue);
                                formik.setFieldValue('amount', numericValue)

                            }}
                            value={price}
                        />

                    </div>
                    <div className="my-3">
                        <PrimaryInput css={"w-full py-2 "} label={"Amount"} error={undefined} touched={undefined}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits
                                const numericValue = value.replace(/\D/g, '');
                                setAmount(numericValue);
                                formik.setFieldValue('amount',numericValue)
                            }}
                            value={amount}
                        />

                    </div>
                <div className="mb-4">
                <p className="mb-3 text-[#515B6E] font-semibold text-sm">Limits (in NGN)</p>
                <div className="flex flex-col lg:flex-wrap   justify-between mb-[1px]">
                    <PrimaryInput
                        css="w-[98%] p-2.5 mr-1"
                        label={`Minimum (xNGN${ad?.type === "buy" ? formatNumber(userTransactionLimits?.lower_limit_buy_ad) : formatNumber(userTransactionLimits?.lower_limit_sell_ad)})`}
                        placeholder="0"
                        name="minimumLimit"
                        min={ad?.type === "buy" ? userTransactionLimits?.lower_limit_buy_ad : userTransactionLimits?.lower_limit_sell_ad}
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
                        label={`Maximum (xNGN  ${formatNumber(ad?.type==="buy"? userTransactionLimits?.upper_limit_buy_ad:userTransactionLimits?.upper_limit_sell_ad)})`}
                        placeholder="0"
                        name="maximumLimit"
                        max={ad?.type === "buy" ? userTransactionLimits?.upper_limit_buy_ad : userTransactionLimits?.upper_limit_sell_ad}
                        error={formik.errors.maximumLimit}
                        value={formik.values.maximumLimit}
                        touched={formik.touched.maximumLimit}
                        maxFnc={() => formik.setFieldValue('maximumLimit', userTransactionLimits?.upper_limit_buy_ad)}
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

                </div>
                <div className='flex items-center w-full mt-5'>
                    <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                    <PrimaryButton text={'Update Ad'} loading={isLoading} css='w-1/2 ml-3' onClick={formik.submitForm} />
                </div>
            </div>
        </ModalTemplate>
    )
}

export default EditAd
