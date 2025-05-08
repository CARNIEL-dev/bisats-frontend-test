import TokenSelect from "../../../components/Inputs/TokenSelect"
import Head from "../Head"
import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput"
import { TokenData } from "../../../data"
import { useEffect, useState } from "react"
import { PrimaryButton } from "../../../components/buttons/Buttons"
import PrimaryInput from "../../../components/Inputs/PrimaryInput"
import WithdrawalConfirmationNGN from "../../../components/Modals/WithdrawalConfirmationNGN"
import WithdrawalConfirmationCrypto from "../../../components/Modals/WithdrawalConfirmationCrypto"
import SecurityVerification from "../../../components/Modals/SecurityVerification"
import {  GetLivePrice, GetUserBank, Withdraw_Crypto, Withdraw_xNGN } from "../../../redux/actions/walletActions"
import { useSelector } from "react-redux"
import { UserState } from "../../../redux/reducers/userSlice"
import AddWithdrawalBankAccount from "../../../components/Modals/AddWithdrawalBankAccount"
import Toast from "../../../components/Toast"
import { APP_ROUTES } from "../../../constants/app_route"
import { useLocation, useNavigate } from "react-router-dom";
import { AccountLevel, bisats_limit } from "../../../utils/transaction_limits"
import { PriceData } from "../Assets"
import { assets, convertUSDToAsset } from "../../../utils/conversions"


export type TNetwork = {
    label: string,
    value: string
}
const WithdrawalPage = () => {
    const userState: UserState = useSelector((state: any) => state.user);
    const user = userState.user
    const location = useLocation();

    const linkedAsset = location.state?.asset;

    const [selectedToken, setSelectedToken] = useState<string>(linkedAsset)
    const [withdrwalAmount, setWithdrwalAmount] = useState<string>()
    const [cryptoWithdrwalAddress, setCryptoWithdrwalAddress] = useState<string>()
    const [cryptoWithdrwalAmount, setCryptoWithdrwalAmount] = useState<string>()

    const [networks, setNetworks] = useState<TNetwork[]>([])
    const [selectedNetwork, setSelectedNetworks] = useState<string>()
    const [bankAccountId, setbankAccountId] = useState<string>()
    const [withdrawalModal, setWithDrawalModal] = useState(false)
    const [addBankModal, setAddBankModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)
    const [bankList, setBankList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [tokenPrice,setTokenPrice]=useState<PriceData>()
    

    
    const FetchMyBankList = async () => {

        let res = await GetUserBank(user?.userId)
         setBankList(res?.map((choice: { bankName: string; id: string; accountName: string;accountNumber:string }) => ({
             label: <div className='text-[12px] flex flex-col '>
                 <p>{choice?.bankName}</p>
                 <p className='my-1'>{choice?.accountNumber}</p>
                 <p>{choice?.accountName}</p>
             </div>,
             labelDisplay: <div className='text-[12px] flex flex '>
                 <p>{choice?.bankName}</p>
                 <p className='mx-2'>- {choice?.accountNumber}</p>
                 <p> {choice?.accountName}</p>
             </div>,
             value: choice?.id
         })))
        }
        useEffect(() => {
            FetchMyBankList()
        }, [ addBankModal])
    
    useEffect(() => {
        for (let token of TokenData) {
            if (token.id === selectedToken) {
                setNetworks(token.networks)
                return
            }
        }
    }, [selectedToken])

    const handleSelectToken = (prop: string) => {
        setSelectedToken(prop);
        if(prop==="xNGN" &&( bankList.length===0||!bankList))setAddBankModal(true)
        setSelectedNetworks("");
    }

    const handleWithdrawal = async() => {
        setIsLoading(true)
        const response = await Withdraw_xNGN({
            userId: `${user?.userId}`,
            amount: Number(withdrwalAmount),
            bankAccountId: bankAccountId??""
        })
        setIsLoading(false)
        console.log(response)
        if (response?.ok) {
          
            Toast.success(response.message, "Withdrawal Initiated")
            setWithDrawalModal(false)
            // navigate(APP_ROUTES.WALLET.HOME)
        } else {
            Toast.error(response.message, "")
            setWithDrawalModal(false)
        }
    }


    const handleCryptoWithdrawal = async () => {
        setIsLoading(true)
        const response = await Withdraw_Crypto({
            userId: `${user?.userId}`,
            amount: Number(cryptoWithdrwalAmount),
            address: cryptoWithdrwalAddress ?? "",
            asset: selectedToken as keyof typeof assets,
        })
        setIsLoading(false)
        console.log(response)
        if (response?.ok) {

            Toast.success(response.message, "Withdrawal Initiated")
            setWithDrawalModal(false)
            // navigate(APP_ROUTES.WALLET.HOME)
        } else {
            Toast.error(response.message, "")
            setWithDrawalModal(false)
        }
    }

     useEffect(() => {
                const fetchPrices = async () => {
                    const prices = await GetLivePrice();
                    setTokenPrice(prices);
                };
        
                fetchPrices();
            }, []);

    const account_level=user?.accountLevel as AccountLevel
    const userTransactionLimits = bisats_limit[account_level]


    return (
        <div>
            <Head header={"Make a Withdrawal"} subHeader={"Securely withdraw fiat or crypto from your account."} />

            <div className="mt-10">
                <TokenSelect title={selectedToken ?? "Select option"} label={"Select Asset"} error={undefined} touched={undefined} handleChange={(e) => handleSelectToken(e)} />

                {
                    selectedToken &&

                    <div className="my-4">
                        {
                            selectedToken === "xNGN" &&
                                // <MultiSelectDropDown parentId={""} title={"Select option"} choices={networks} error={undefined} touched={undefined} label={"Select Network"} handleChange={(e) => setSelectedNetworks(e)} />

                                    
                                    <div>
                                        <MultiSelectDropDown parentId={""} title={"Select"} choices={bankList} error={undefined} touched={undefined} label={"Select Bank"} handleChange={(e) => setbankAccountId(e)} />
                                        
                                        </div>

                        }
                    </div>
                }

                {
                    ((bankAccountId) || selectedToken) && (
                        selectedToken === "xNGN" ?
                            <div>
                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Amount"} placeholder="Enter amount"
                                    type="number"
                                    min={0}
                                    max={300}
                                    error={Number(withdrwalAmount) >userTransactionLimits?.withdrawal_per_transaction_fiat?true:false}
                                    touched={Number(withdrwalAmount) > userTransactionLimits?.withdrawal_per_transaction_fiat ? true : false}
                                    value={withdrwalAmount}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        const max = userTransactionLimits?.withdrawal_per_transaction_fiat;

                                        if (max && Number(value) > max) {
                                            value = max.toString();
                                        }

                                        setWithdrwalAmount(value);
                                    }}
                                />
                                <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5  my-5 text-[14px] leading-[24px] ">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Daily remaining limit:</p>
                                        <p className="text-[#606C82]  font-[600]">NGN {userTransactionLimits?.daily_withdrawal_limit_fiat - 0}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Transaction fee:</p>
                                        <p className="text-[#606C82]  font-[600]">{ userTransactionLimits?.charge_on_single_withdrawal_fiat} xNGN</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Withdrawal amount:</p>
                                        <p className="text-[#606C82]  font-[600]">{withdrwalAmount??"-"} xNGN</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Total:</p>
                                        <p className="text-[#606C82]  font-[600]">{`${(Number(withdrwalAmount ?? 0)) + userTransactionLimits?.charge_on_single_withdrawal_fiat}`||"-"} xNGN</p>
                                    </div>
                                </div>
                                <PrimaryButton css={"w-full"} text={"Withdraw"} loading={false} onClick={() => setWithDrawalModal(true)} />
                            </div>
                            :
                            <div>

                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Wallet Address"}
                                    placeholder="Enter address"
                                    error={undefined}
                                    value={cryptoWithdrwalAddress}
                                    onChange={(e)=>setCryptoWithdrwalAddress(e.target.value)}
                                    touched={undefined} />
                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Amount"}
                                    placeholder="Enter amount"
                                    value={cryptoWithdrwalAmount}
                                    onChange={(e) => setCryptoWithdrwalAmount(e.target.value)}
                                    error={undefined}
                                    touched={undefined}
                                />


                                <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] ">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Daily remaining limit:</p>
                                        <p className="text-[#606C82]  font-[600]"> {userTransactionLimits?.daily_withdrawal_limit_crypto} {selectedToken}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Transaction fee:</p>
                                        <p className="text-[#606C82]  font-[600]">{userTransactionLimits?.charge_on_single_withdrawal_crypto} USDT</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Withdrawal amount:</p>
                                        <p className="text-[#606C82]  font-[600]">{ cryptoWithdrwalAmount} { selectedToken}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Total:</p>
                                        <p className="text-[#606C82] font-[600]">
                                            {(parseFloat(cryptoWithdrwalAmount ?? "0") +
                                                (tokenPrice
                                                    ? convertUSDToAsset(
                                                        selectedToken as keyof typeof assets,
                                                        userTransactionLimits?.charge_on_single_withdrawal_crypto ?? 0,
                                                        tokenPrice
                                                    ) ?? 0
                                                    : 0)) || "-"}  
                                            
                                            {selectedToken}
                                        </p>
                                    </div>
                                </div>
                                <PrimaryButton css={"w-full"} text={"Withdraw"} loading={false} onClick={() => setWithDrawalModal(true)} />
                            </div>)
                }


            </div>

            {withdrawalModal && (selectedToken === "xNGN" ? <WithdrawalConfirmationNGN close={() => setWithDrawalModal(false)}
                transactionFee={`${userTransactionLimits?.charge_on_single_withdrawal_fiat}`}
                withdrawalAmount={`${withdrwalAmount}`}
                total={`${Number(withdrwalAmount ?? 0) + userTransactionLimits?.charge_on_single_withdrawal_fiat}`}
                submit={handleWithdrawal}
                isLoading={isLoading} /> :
                <WithdrawalConfirmationCrypto close={() => setWithDrawalModal(false)} isLoading={isLoading}  amount={cryptoWithdrwalAmount ?? "0"} address={cryptoWithdrwalAddress ?? '-'} livePricesData={tokenPrice} submit={() => handleCryptoWithdrawal()} asset={selectedToken as keyof typeof assets } />)}
            {/* {verificationModal && <SecurityVerification close={() => setVerificationModal(false)} />} */}
            {addBankModal &&<AddWithdrawalBankAccount close={()=>setAddBankModal(false)}/>}

        </div>
    )
}

export default WithdrawalPage