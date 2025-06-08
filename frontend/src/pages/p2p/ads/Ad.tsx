import { useEffect, useMemo, useState } from "react"
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
import { combineDateAndTimeToISO } from "../../../utils/dateTimeConverter"
import { CreateAds, GetLivePrice } from "../../../redux/actions/walletActions"
import { PriceData } from "../../wallet/Assets"
import { WalletState } from "../../../redux/reducers/walletSlice"
import HeaderTabs from "./HeaderTabs"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../../constants/app_route"
import { AccountLevel, bisats_limit } from "../../../utils/transaction_limits"
import { formatNumber } from "../../../utils/numberFormat"

export type TNetwork = {
    label: string,
    value: string
}

export interface IAdRequest {
    type: string,
    priceType: string,
    currency: string,
    priceMargin: number,
    asset: string,
    amount: number,
    amountToken:number,
    price: number,
    minimumLimit: number,
    maximumLimit: number,
    priceUpperLimit: number, 
    priceLowerLimit: number,
    expiryDate: string,
    expiryTime: string ,
    agree?: boolean
}

const initialAd: IAdRequest = {
    type: "Buy",
    asset: "",
    amount: 0,
    amountToken:0,
    priceType: "Static",
    price: 0,
    currency: "NGN",
    priceMargin: 0.0,
    minimumLimit: 0,
    maximumLimit: 0,
    priceUpperLimit: 0, 
    priceLowerLimit: 0,
    expiryDate: "",
    expiryTime: "",
    agree: false
}

export interface AdsProps {
    formik: FormikProps<IAdRequest>,
    setStage: React.Dispatch<React.SetStateAction<string>>
    liveRate?: PriceData
    wallet?:WalletState
}

const toke_100_ngn = {
    BTC: 0.55,
    USDT: 60000,
    SOL: 370,
    ETH:20
}

const CreateAd = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState("details")
    const [fetching, setIsFetching] = useState(true)
      const user: UserState= useSelector((state: any) => state.user);
        const userr = user.user
       const account_level=userr?.accountLevel as AccountLevel
        const userTransactionLimits = bisats_limit[account_level]
    
    const navigate= useNavigate()

    const [tokenLivePrices, setTokenLivePrices] = useState<PriceData>()
    const walletState: WalletState = useSelector((state: any) => state.wallet);

    const AdSchema = Yup.object().shape({
        type: Yup.string().required('Transaction type is required'),
        asset: Yup.string().oneOf(['BTC', 'USDT', 'SOL', 'ETH']).required('Asset selection is required'),
        // amount: Yup.number()
        //     .min(1, 'Amount must be greater than 0')
        //     .required('Amount is required'),
        priceType: Yup.string().required('Pricing type is required'),
        currency: Yup.string().required('Currency selection is required'),
        // //decimal margin
        // priceMargin: Yup.number()
        //     .typeError('Margin must be a number')
        //     .transform((value, originalValue) =>
        //         originalValue === '' || originalValue === null ? null : Number(originalValue)
        //     )
        //     .nullable()
        //     .min(0, 'Margin must be at least 0')
        //     .max(1, 'Margin cannot be more than 1'),

        //for % margin
        priceMargin: Yup.number()
            .nullable()
            .min(0, 'Margin must be at least 0%')
            .max(100, 'Margin cannot be more than 100%'),

        price: Yup.number()
            .transform((value, originalValue) => {
                if (originalValue === '' || isNaN(originalValue)) return undefined;
                return Number(originalValue);
            })
            .min(1, 'Price must be greater than 0')
            .required('Price is required'),
        
        
      
          
        amount: Yup.number()

            .transform((value, originalValue) => {
                if (originalValue === '' || isNaN(originalValue)) return undefined;
                return Number(originalValue);
            })
            // .min(0.00000, 'Amount must be greater than 0')
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
        amountToken: Yup.number()
            .min(0, 'Token amount must be greater than 0')

            .when(['asset'], (assetValue, schema) => {
                // Safely type asset as one of the known keys
                const asset = assetValue as unknown as keyof typeof toke_100_ngn;

                const maxAmount = toke_100_ngn?.[asset] ?? 0;;
                return schema.max(
                    maxAmount,
                    `Amount must not exceed ₦100,000,000 worth of ${asset}`
                );
            })
            .when('type', {
                is: (val: string) => val?.toLowerCase() === 'sell',
                then: schema => schema.required('Token amount is required'),
                otherwise: schema => schema.notRequired(),
            })
            .test(
                'max-wallet-balance',
                'Amount cannot exceed your current wallet balance',
                function (value) {
                    if (typeof value !== 'number') return false;
                    return value !== undefined && value <= calculateDisplayWalletBallance;
                }
            )
,
    
        minimumLimit: Yup.number()
            .min(15000, 'Minimum must be greater than 15,000 xNGN')
            .max(23000000, 'Price must not exceed 23,000,000 xNGN').required()

            // .when('amount', (amount, schema) =>
            //     schema.max(Number(amount), 'Minimum must be less than or equal to amount')
            // )
            .required('Minimum is required'),

        maximumLimit: Yup.number()
            .min(15000, 'Maximum must be greater than Minimum')
            .when(['type', 'amount', 'amountToken', 'price'], ([type, amount, amountToken, price], schema) => {
                let computedMax = 23000000;

                if (type?.toLowerCase() === 'buy') {
                    if (typeof amount === 'number') {
                        computedMax = Math.min(amount, 23000000);
                    }
                }

                if (type?.toLowerCase() === 'sell') {
                    if (typeof amountToken === 'number' && typeof price === 'number') {
                        const product = amountToken * price;
                        computedMax = Math.min(product, 23000000);
                    }
                }

                return schema.max(
                    computedMax,
                    `Maximum must not exceed ₦${formatNumber(computedMax)}`
                );
            })
            .required('Maximum is required'),
        

        priceLowerLimit: Yup.number()
            .min(1, 'Lower Price Limit must be greater than 0')
            // .when('price', (price, schema) =>
            //     schema.max(Number(price), 'Lower price must be less than or equal to amount')
            // )
            .required('Lower price is required'),
        priceUpperLimit: Yup.number()
            .when(['priceLowerLimit', 'price'], ([priceLowerLimit, price], schema) =>
                schema
                    .min(Number(priceLowerLimit) + 1, 'Upper price limit must be greater than minimum limit')
            )
            .required('Upper limit price is required'),
        expiryDate: Yup.date().required('Expiry date is required'),
        expiryTime: Yup.string().required('Expiry time is required')

    });
    const [currentSchema, setCurrentSchema] = useState<Yup.ObjectSchema<any>>(AdSchema);

    useEffect(() => {
        if (!user.loading && !walletState.loading) {
            setIsFetching(false)
        }
        
    },[])

    useEffect(() => {
        const fetchPrices = async () => {
            const prices = await GetLivePrice();
            console.log(prices)
            setTokenLivePrices(prices);
        };

        fetchPrices();
    }, []);
    const formik = useFormik<IAdRequest>({
        initialValues: { ...initialAd, agree: false  },
        validationSchema: currentSchema,
        onSubmit: async (values) => {
            console.log(values);

            const expiryTimestamp = combineDateAndTimeToISO(values.expiryDate, values.expiryTime);

            if (!values.agree) {
                Toast.error("Agree to the terms of use", "Agree to the terms")
                return
            }
            setIsLoading(true);

            try {
                const payload = {
                    userId: user?.user?.userId??"",
                    asset: values.asset,
                    type: values.type.toLowerCase(),
                    amount: Number(values.type.toLowerCase()==="buy"?values.amount:values?.amountToken),
                    minimumLimit: Number(values.minimumLimit),
                    maximumLimit: Number(values.maximumLimit),
                    expiryDate: expiryTimestamp,
                    priceType: values.priceType.toLowerCase(),
                    price: Number(values.price),
                    priceMargin: Number(values.priceMargin??0),
                    priceUpperLimit: Number(values.priceUpperLimit),
                    priceLowerLimit: Number(values.priceLowerLimit)

                
                };
                const response = await CreateAds(payload)
                if (response.status) {
                    Toast.success(response.message, "Add created");
                    navigate(APP_ROUTES.P2P.MY_ADS)

                } else {
                    Toast.error(response.message, "Failed to create");

                }
            } catch (error) {
                Toast.error("Failed to create ad", "Error");
            } finally {
                setIsLoading(false);
            }
        },
    });
    const walletData = walletState?.wallet
    const calculateDisplayWalletBallance: number  = useMemo(() => {
        if (formik.values.type.toLowerCase() === "buy") {
            return walletData?.xNGN;
        } else {
            return walletData ? walletData?.[formik.values.asset] : 0;
        }

    }, [walletData, formik.values.type, formik.values.asset]);
 
    
    return (
        <div className="w-full lg:w-2/3 mx-auto h-full lg:items-center px-4">
            <Head header="Create an Ad" subHeader="Buy or sell assets with your own preferred price." />
            <HeaderTabs activePage={stage} setActivePage={setStage }/>

            {
                fetching ? <p className="text-center">Loading...</p>:
            
                    <form  className="mt-5">
                        {
                            stage === "details" ? (
                                <CreateAdDetails formik={formik} setStage={setStage} wallet={walletState} liveRate={tokenLivePrices} />
                            )
                                // : (
                                // stage === "pricing" ? (
                                //     <CreateAdPricing formik={formik} setStage={setStage} liveRate={tokenLivePrices} wallet={walletState} />
                                //     )
                                        : (
                                    <>
                                        <AdReview formik={formik} setStage={setStage} />
                                                <PrimaryButton css="w-full disabled" type="button" text="PublishAd" loading={isLoading}
                                                    onClick={() => {
                                                        const newSchema = formik.values.type.toLowerCase() === "buy"
                                                            ? AdSchema.omit(['amountToken'])
                                                            : AdSchema.omit(['amount']);
                                                        setCurrentSchema(newSchema);
                                                        formik.validateForm(); // force validation with new schema
                                                        formik.handleSubmit();
                  }}
                                                />
                                    </>
                                )
                            
                        }
                    </form>}
        </div>
    );
};

export default CreateAd;