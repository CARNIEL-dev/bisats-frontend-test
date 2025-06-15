import {  useMemo, useState } from "react";
import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons"
import PrimaryInput from "../Inputs/PrimaryInput";
import ModalTemplate from "./ModalTemplate";
import { useSelector } from "react-redux";
import { UserState } from "../../redux/reducers/userSlice";
import Toast from "../Toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Info, TriangleAlert } from "lucide-react";
import { formatNumber } from "../../utils/numberFormat";
import { AccountLevel, bisats_limit } from "../../utils/transaction_limits";
import * as Yup from 'yup'
import { WalletState } from "../../redux/reducers/walletSlice";
import { IAd } from "./TableActionMenu";
import { UpdateAd } from "../../redux/actions/adActions";
import { APP_ROUTES } from "../../constants/app_route";

interface Props {
    close: () => void;
    ad?:IAd
    // ad?: { id: string; price: string; type: string; asset: string; amount: string; minimumLimit: string; maximumLimit: string; }
}


type TEditAd = {
    minimumLimit: string,
    maximumLimit: string,
    priceUpperLimit: string,
    priceLowerLimit: string,
    amount: string,
    price: string,
    agree?: boolean

}



const EditAd: React.FC<Props> = ({ close, ad }) => {
    const [amount, setAmount] = useState(`${ad?.amount}`)
    const [price, setPrice] = useState(`${ad?.price}`)
   
    const initialAd: TEditAd = {
        amount: `${ad?.amount}`,
        price: `${ad?.price}`,
        minimumLimit: ad?.minimumLimit??"0",
        maximumLimit: ad?.maximumLimit ?? "0",
        priceUpperLimit: ad?.priceUpperLimit??"0",
        priceLowerLimit: ad?.priceLowerLimit??"0",
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
    
    //   priceLowerLimit: Yup.number()
    //             .min(1, 'Lower Price Limit must be greater than 0')
    //             // .when('price', (price, schema) =>
    //             //     schema.max(Number(price), 'Lower price must be less than or equal to amount')
    //             // )
    //             .required('Lower price is required'),
    //         priceUpperLimit: Yup.number()
    //             .when(['priceLowerLimit', 'price'], ([priceLowerLimit, price], schema) =>
    //                 schema
    //                     .min(Number(priceLowerLimit) + 1, 'Upper price limit must be greater than minimum limit')
    //             )
    //             .required('Upper limit price is required'),
        });
    

    const [isLoading, setIsLoading] = useState(false)



    const formik = useFormik<TEditAd>({
        
            initialValues: { ...initialAd, agree: false  },
            validationSchema: AdSchema,
            onSubmit: async (values) => {
                setIsLoading(true);
    
                try {
                    const payload = {
                        userId: user?.userId ?? "",
                        adId:ad?.id??"",
                        amount: Number(values.amount),
                        minimumLimit: Number(values.minimumLimit),
                        maximumLimit: Number(values.maximumLimit),
                        price: Number(values.price),
                        // expiryDate: ad?.expiryDate ??"",
                        priceType: ad?.priceType??"",
                        priceMargin: ad?.priceMargin,
                        // priceUpperLimit: Number(values?.priceUpperLimit),
                        // priceLowerLimit: Number(values?.priceLowerLimit)
                    
                    };

                    // console.log(payload)
                    const response = await UpdateAd(payload)
                    
                    if (response?.status) {
                        Toast.success(response?.message, "Add Updated");
                        close()
                        navigate(APP_ROUTES.P2P.MY_ADS)
    
                    } else {
                        Toast.error(response.message, "Failed to update");
    
                    }
                } catch (error) {
                    Toast.error("Failed to create ad", "Error");
                } finally {
                    setIsLoading(false);
                }
            },
     });
    
   

  


    return (
        <ModalTemplate onClose={close}>
            <div className='relative text-left pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Edit Ad</h1>
                <div className="my-5">
                    <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] w-full ">
                        <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] capitalize font-bold">{ad?.type} Ad</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">NGN/{ad?.asset}</p>
                        </div>
                        <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] ">Ad Price</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">{ formatNumber(ad?.price??0)}/NGN</p>
                        </div>
                        {/* <div className="flex justify-between items-start mb-2 text-wrap w-full">
                            <p className="text-[#424A59] font-[400] ">{ad?.type} Ad</p>
                            <p className="text-[#606C82]  font-[600]  text-right w-1/2 break-all ">NGN/{ad?.asset}</p>
                        </div> */}
                    </div>
                     

                    <div className="my-3">
                        <PrimaryInput css={"w-full py-2 "} label={" Price"} error={undefined} touched={undefined}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits
                                const numericValue = value.replace(/\D/g, '');
                                setPrice(numericValue);
                                formik.setFieldValue('price', numericValue)
                            }}
                            value={price}
                        />
                    </div>
                    {/* <div className="mb-4">
                        <div className="flex justify-between mb-[1px]">
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
                                css="w-[100%] p-2.5"
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
                    </div> */}

                    <div className="my-3">
                        <PrimaryInput css={"w-full py-2 "} label={"Top Up Amount"} error={undefined} touched={undefined}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits
                                const numericValue = value.replace(/\D/g, '');
                                setAmount(numericValue);
                                formik.setFieldValue('amount',numericValue)
                            }}
                            // value={amount}
                        />

                    </div>
                    {ad?.type.toLowerCase() === "buy" ?
                        <small className='text-[#606C82] text-[12px] font-[400]'>Balance: {formatNumber(walletState?.wallet?.xNGN)} xNGN</small>
                        : <small className='text-[#606C82] text-[12px] font-[400]'>Balance: {walletState?.wallet?.[ad?.asset ?? "USDT"]} {ad?.asset}</small>
                    }

                    
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
                                maxFnc={() => formik.setFieldValue('maximumLimit', ad?.type === "buy" ? ad?.amountAvailable : Number(ad?.amountFilled) * Number(ad?.price))}
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
