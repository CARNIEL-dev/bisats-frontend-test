import { useEffect, useState } from "react"
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

const AdSchema = Yup.object().shape({
    type: Yup.string().required('Transaction type is required'),
    asset: Yup.string().required('Asset selection is required'),
    amount: Yup.number()
        .min(1, 'Amount must be greater than 0')
        .required('Amount is required'),
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
        .min(1, 'Price must be greater than 0')
        .required('Price is required'),
    
    
    minimumLimit: Yup.number()
        .min(1, 'Minimum must be greater than 0')
        // .when('amount', (amount, schema) =>
        //     schema.max(Number(amount), 'Minimum must be less than or equal to amount')
        // )
        .required('Minimum is required'),

    maximumLimit: Yup.number()
        .when(['minimumLimit', 'amount'], ([min, amount], schema) =>
            schema
                .min(Number(min) + 1, 'Maximum limit must be greater than minimum limit')
                // .max(Number(amount), 'Maximum must be less than or equal to amount')
        )
        .required('Maximum limit is required'),
  
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

const CreateAd = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState("details")
    const [fetching, setIsFetching] = useState(true)
    const navigate= useNavigate()

    const [tokenLivePrices, setTokenLivePrices] = useState<PriceData>()
    const walletState: WalletState = useSelector((state: any) => state.wallet);
    const user: UserState = useSelector((state: any) => state.user);

 
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
        validationSchema: AdSchema,
        onSubmit: async (values) => {
            const expiryTimestamp = combineDateAndTimeToISO(values.expiryDate, values.expiryTime);

            console.log(values);
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
                    amount: Number(values.amount),
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

    return (
        <div className="w-full lg:w-1/3 mx-auto h-full lg:items-center px-4">
            <Head header="Create an Ad" subHeader="Buy or sell assets with your own preferred price." />
            <HeaderTabs activePage={stage} setActivePage={setStage }/>

            {
                fetching ? <p className="text-center">Loading...</p>:
            
                    <form  className="mt-5">
                        {
                            stage === "details" ? (
                                <CreateAdDetails formik={formik} setStage={setStage} wallet={walletState} />
                            ) : (
                                stage === "pricing" ? (
                                    <CreateAdPricing formik={formik} setStage={setStage} liveRate={tokenLivePrices} wallet={walletState} />
                                ) : (
                                    <>
                                        <AdReview formik={formik} setStage={setStage} />
                                        <PrimaryButton css="w-full disabled" type="button" text="PublishAd" loading={isLoading} onClick={() => formik.handleSubmit()} />
                                    </>
                                )
                            )
                        }
                    </form>}
        </div>
    );
};

export default CreateAd;