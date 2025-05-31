import React, { useEffect, useMemo, useState } from 'react'
import PrimaryInput from '../../../components/Inputs/PrimaryInput'
import { PrimaryButton } from '../../../components/buttons/Buttons'
import { TokenData } from '../../../data'
import { AdSchema } from './ExpressSwap'
import { useNavigate } from 'react-router-dom'
import { assets, convertAssetToNaira, convertNairaToAsset } from '../../../utils/conversions'
import { useSelector } from 'react-redux'
import { WalletState } from '../../../redux/reducers/walletSlice'
import SwapConfirmation from '../../../components/Modals/SwapConfirmation'
import { GetLivePrice } from '../../../redux/actions/walletActions'
import { PriceData } from '../../wallet/Assets'
import { ACTIONS, bisats_charges } from '../../../utils/transaction_limits'
import Toast from '../../../components/Toast'
import Bisatsfetch from '../../../redux/fetchWrapper'
import { UserState } from '../../../redux/reducers/userSlice'
import KycManager from '../../kyc/KYCManager'
import { formatNumber } from '../../../utils/numberFormat'
// assets = isDev ? TestAssets : LiveAssets

export const assetIndexMap: Record<string, number> = Object.values(assets).reduce((acc, asset, index) => {
    acc[asset] = index;
    return acc;
}, {} as Record<string, number>);


export enum typeofSwam { "Buy", "Sell" }
const Swap = ({ type, adDetail }: { type: "buy" | "sell", adDetail?: AdSchema | undefined }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [amount, setAmount] = useState("0")
    const [tokenPrice, setTokenPrice] = useState<PriceData>()
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [networkFee, setNetworkFee] = useState<string | null>(null);
    const [transactionFee, setTransactionFee] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const walletState: WalletState = useSelector((state: any) => state.wallet);
    const user = useSelector((state: { user: UserState }) => state.user);
    const userId = user?.user?.userId || "";    
    const navigate = useNavigate()
    useEffect(() => {
        if (!adDetail) navigate(-1);

    },[])

     useEffect(() => {
                const fetchPrices = async () => {
                    const prices = await GetLivePrice();
                    setTokenPrice(prices);
                };
        
                fetchPrices();
     }, []);
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setAmount(e.target.value);
        setAmount( e.target.value )
    };
    const fetchNetworkFee = async () => {
        if ( !amount) return null;

        try {
            const adsId = adDetail?.id;
            const amountValue = parseFloat(amount);

            const response = await Bisatsfetch(
                `/api/v1/user/${userId}/ads/${adsId}/networkFee`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        userId: userId,
                        amount: amountValue,
                    }),
                }
            );


            if (response.status) {
                console.log(response)
                setNetworkFee(response?.data?.networkFee);
                setTransactionFee(response?.data?.transactionFee);
                return response;
            } else {
                setError("Failed to fetch network fee: " + response.message);
                return response;
            }
        } catch (err) {
            console.error("Error fetching network fee:", err);
            setError("Failed to fetch network fee. Please try again.");
            return null;
        }
    };


    const handleConfirmTransaction = async () => {
        if ( !amount) return;
        if (adDetail?.orderType === "buy") {
            if (Number(amount) > Number(walletState?.wallet?.xNGN)) {
                Toast.error("Your xNGN balance is not enough to carry out this transaction", "Insufficient Wallet Balance")
                return
            }
        } else {
            if (Number(amount) > Number(walletState?.wallet?.[adDetail?.asset??"BTC"])) {
                Toast.error(`Your ${adDetail?.asset} balance is not enough to carry out this transaction`, "Insufficient Wallet Balance")
                return
            }
        }
        setConfirmLoading(true);
        setOrderError(null);

        try {
            const feeData = await fetchNetworkFee();
            console.log(feeData)
            if (!feeData.status) {
                setOrderError(feeData?.message);
                Toast.error(feeData?.message, "Failed")
                setConfirmLoading(false);
                setShowConfirmation(false)
                return;
            }

            const orderResult = await placeOrder(feeData);
            if (orderResult?.success) {
                setShowConfirmation(false);
                setAmount("");
                setNetworkFee(null);
                setTransactionFee(null);

                // TODO: Show success notification
                Toast.success(orderResult?.message, "Success");
            } else {
                Toast.error(orderResult?.message, "Failed");
            }
        } catch (err) {
            console.error(err)
            Toast.error("An eeror occured", "Error");
            setOrderError("An unexpected error occurred. Please try again.");
        } finally {
            setConfirmLoading(false);
        }
    };
    const placeOrder = async (feeData: any) => {
        if ( !amount) return;

        try {
            const adsId = adDetail?.id;
            const amountValue = parseFloat(amount);

            const response = await Bisatsfetch(
                `/api/v1/user/${userId}/ads/${adsId}/order`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        userId: userId,
                        amount: amountValue,
                        networkFee: feeData.networkFee,
                        transactionFee: feeData.transactionFee,
                    }),
                }
            );

            console.log("Place Order API Response:", response);

            if (response.status) {
                return { success: true, data: response.data };
            } else {
                setOrderError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            console.error("Error placing order:", err);
            setOrderError("Failed to place order. Please try again.");
            return { success: false, message: "Failed to place order." };
        }
    };
    const calculateFee = () => {
            if (!amount || parseFloat(amount) <= 0) return "0";
            const feePercentage = bisats_charges.crypto_buy;
            return (parseFloat(amount) * feePercentage).toFixed(2);
        };

    const getCurrencyName = () =>
        adDetail?.orderType === "buy" ? adDetail?.asset : "xNGN";
    const calculateReceiveAmount = useMemo(() => {
            const inputAmount = parseFloat(amount);
            const price = adDetail?.price??0;
            
    
            if (adDetail?.orderType=== "buy") {
                // Buy
                const amount = tokenPrice ? convertNairaToAsset(adDetail?.asset as keyof typeof assets, inputAmount, price, tokenPrice) : null 
                return amount !== null ? amount.toFixed(2) : "0.00";
            } else {
                // Sell
                const amount = tokenPrice ?convertAssetToNaira(adDetail?.asset as keyof typeof assets, inputAmount, price, tokenPrice): null 
                return amount !== null ? amount.toFixed(2) : "0.00";
            }
    
    }, [adDetail?.asset, adDetail?.orderType, adDetail?.price, amount, tokenPrice])
    
    const sellError = useMemo(() => {
        if (((adDetail?.minimumLimit??0)/(adDetail?.price ?? 0)) > Number(amount)) return "Not within Limit"
        if (((adDetail?.maximumLimit??0) / (adDetail?.price ?? 0)) < Number(amount)) return "Not within Limit"

        if (amount > walletState?.wallet?.[adDetail?.asset??"USDT"]) return "Insufficient wallet balance"
        if (Number(calculateReceiveAmount) > (adDetail?.amountAvailable??0)) return "Available amount exceeded"
    }, [adDetail?.amountAvailable, adDetail?.maximumLimit, adDetail?.minimumLimit, amount, calculateReceiveAmount, walletState?.wallet?.xNGN])
    const buyError = useMemo(() => {
        if ((adDetail?.minimumLimit ?? 0) > Number(amount)) return "Not within Limit"
        if ((adDetail?.maximumLimit ?? 0) < Number(amount)) return "Not within Limit"

        if (amount > walletState?.wallet?.xNGN) return "Insufficient wallet balance"
        if (Number(calculateReceiveAmount) > (adDetail?.amountAvailable ?? 0)) return "Available amount exceeded"
    },[adDetail?.amountAvailable, adDetail?.maximumLimit, adDetail?.minimumLimit, amount, calculateReceiveAmount, walletState?.wallet?.xNGN])
    return (
        <div>
            <p className={`${type === "buy" ? "text-[#17A34A]" : "text-[#DC2625]"} text-[14px] font-[600] my-3`}> {type === "buy" ? "You’re Buying from" : "You’re Selling to"}</p>

            <h1 className='text-[28px] md:text-[34px] text-[#0A0E12] font-[600] leading-[40px] my-3'>Chinex exchanger</h1>

            <p className='text-[#515B6E] text-[14px] font-[400] my-2'><span>1 USDT</span>  ≈ <span>{formatNumber(Number(adDetail?.price))} xNGN</span>
                {/* <span className='text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]'> 30 s</span> */}
            </p>
            <div className='flex items-center my-1 w-2/3 justify-between'>
                <div className='text-[12px] text-[#515B6E]'>
                    <h2 className='font-[600]'>Available</h2>
                    {type === "buy" ?
                        <p>{adDetail?.amountAvailable} {adDetail?.asset}</p> :
                        <p>{adDetail && formatNumber(adDetail?.amountAvailable / adDetail?.price)} {adDetail?.asset}</p> 
                    }
                </div>
                <div className='text-[12px] text-[#515B6E]'>
                    <h2 className='font-[600]'>Limit</h2>
                    <p>{formatNumber(Number(adDetail?.minimumLimit))} - {formatNumber(Number(adDetail?.maximumLimit))} NGN</p>
                </div>
            </div>
            {
                type === "buy" ?
                    <div>
                        <div className='relative'>
                            <PrimaryInput css={'w-full h-[64px]'} label={'Amount'}
                                error={buyError}
                                touched={undefined}
                                min={adDetail?.minimumLimit}
                                max={adDetail?.maximumLimit}
                                value={amount}
                                onChange={handleAmountChange}
                            />
                            <div className='absolute right-3 top-10'>

                                <button

                                    className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                                    type="button"
                                >
                                    {/* <Typography.Text> */}
                                    {TokenData[0].tokenLogo}

                                    <div className="mx-3">

                                        {TokenData[0].tokenName}
                                    </div>
                                    {/* </Typography.Text> */}

                                </button>
                                {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                            </div>
                            <small className='text-[#606C82] text-[12px] font-[400]'>Balance: {walletState?.wallet?.xNGN} xNGN</small>
                        </div>
                        {/* <p className="text-[#FFCCCB] text-[12px] font-[400] mt-2">{amount></p> */}


                        <div className='relative my-10'>
                            <PrimaryInput css={'w-full h-[64px]'}
                                label={'You’ll receive at least'}
                                error={undefined}
                                touched={undefined}
                                readOnly
                                value={calculateReceiveAmount}
                            
                            />
                            <div className='absolute right-3 top-10'>

                                <button

                                    className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                                    type="button"
                                >
                                    {/* <Typography.Text> */}
                                    {TokenData?.[assetIndexMap?.[adDetail?.asset??"BTC"]]?.tokenLogo}

                                    <div className="mx-3">

                                        {TokenData?.[assetIndexMap?.[adDetail?.asset ?? "BTC"]]?.tokenName}
                                    </div>
                                    {/* </Typography.Text> */}



                                </button>
                                {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                            </div>
                        </div>


                    </div> :
                    <div>
                        <div className='relative'>
                            <PrimaryInput css={'w-full h-[64px]'} label={'Quanity'} error={sellError} touched={undefined}
                                value={amount}
                                onChange={handleAmountChange} />
                            
                            <div className='absolute right-3 top-10'>

                                <button

                                    className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                                    type="button"
                                >
                                    {/* <Typography.Text> */}
                                    {TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenLogo}

                                    <div className="mx-3">

                                        {TokenData[assetIndexMap?.[adDetail?.asset ?? "BTC"]].tokenName}
                                    </div>
                                    {/* </Typography.Text> */}

                                </button>
                                {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                            </div>
                            <small className='text-[#606C82] text-[12px] font-[400]'>Balance: {walletState?.wallet?.[adDetail?.asset ?? "USDT"]} {adDetail?.asset }</small>
                        </div>

                        <div className='relative my-10'>
                            <PrimaryInput css={'w-full h-[64px]'} label={'You’ll receive at least'} error={undefined} touched={undefined}
                            
                                readOnly
                                value={calculateReceiveAmount}
                            />
                            <div className='absolute right-3 top-10'>

                                <button

                                    className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                                    type="button"
                                >
                                    {/* <Typography.Text> */}
                                    {TokenData[0].tokenLogo}

                                    <div className="mx-3">

                                        {TokenData[0].tokenName}
                                    </div>
                                    {/* </Typography.Text> */}
                                </button>
                                {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                            </div>
                        </div>


                    </div>
}
            <KycManager
                action={ACTIONS.SWAP}
                func={() => setShowConfirmation(true)}
            >
                {(validateAndExecute) => (
                    type==='buy'?
                    <PrimaryButton text={`${type} ${TokenData?.[assetIndexMap?.[adDetail?.asset ?? "BTC"]]?.tokenName}`} loading={false} css='w-full capitalize'
                        disabled={buyError?true:false}

                        onClick={validateAndExecute}
                        />:
                        <PrimaryButton text={`${type} ${TokenData?.[assetIndexMap?.[adDetail?.asset ?? "BTC"]]?.tokenName}`} loading={false} css='w-full capitalize'
                            disabled={ sellError ? true : false}

                            onClick={validateAndExecute}
                        />
                    )}
                </KycManager>
            {showConfirmation && (
                <SwapConfirmation
                    close={() => setShowConfirmation(false)}
                    type={adDetail?.orderType === "buy" ? typeofSwam.Buy : typeofSwam.Sell}
                    amount={amount}
                    receiveAmount={calculateReceiveAmount}
                    fee={calculateFee()}
                    token={adDetail?.orderType === "buy" ? "xNGN" : adDetail?.asset}
                    currency={getCurrencyName()}
                    loading={confirmLoading}
                    onConfirm={handleConfirmTransaction}
                    networkFee={networkFee}
                    transactionFee={transactionFee}
                    error={orderError}
                />
            )}
        </div>
    )
}

export default Swap