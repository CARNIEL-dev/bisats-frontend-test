import TokenSelect from "../../../components/Inputs/TokenSelect"
import Head from "../Head"
import { MultiSelectDropDown } from "../../../components/Inputs/MultiSelectInput"
import { TokenData } from "../../../data"
import { useEffect, useState } from "react"
import { PrimaryButton } from "../../../components/buttons/Buttons"
import PrimaryInput from "../../../components/Inputs/PrimaryInput"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import { UserState } from "../../../redux/reducers/userSlice"
import { TopUpSchema } from "../../../formSchemas"
import { DepositTranscBreakDown, TopUpNGNBalance } from "../../../redux/actions/walletActions"
import Toast from "../../../components/Toast"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../../constants/app_route"
import { setDepositTranscBreakDown } from "../../../helpers"
import KycRouteGuard from "../../../components/KycGuard"
import { ACTIONS } from "../../../utils/transaction_limits"

export type TNetwork = {
    label: string,
    value: string
}
const DepositPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedToken, setSelectedToken] = useState<string>()
    const [networks, setNetworks] = useState<TNetwork[]>([])
    const [selectedNetwork, setSelectedNetworks] = useState<string>()
    const [paymentOption, setPaymentOption] = useState<string>("")
    const navigate = useNavigate()

    const user: UserState = useSelector((state: any) => state.user);


    useEffect(() => {
        for (let token of TokenData) {
            if (token.id === selectedToken) {
                setNetworks(token.networks)
                return
            }
        }
    }, [selectedToken])

    const formik = useFormik({
        initialValues: { amount: "" },
        validationSchema: TopUpSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const { ...payload } = values
            const payloadd = {
                ...payload,
                userId: `${user?.user?.userId}`,
                amount: Number(payload.amount)
            }
            const response = await DepositTranscBreakDown(payloadd)
            setIsLoading(false)
            if (response.statusCode === 200) {
                setDepositTranscBreakDown(response.data)
                navigate(APP_ROUTES.WALLET.TRANSACTION_BREAKDOWN)
                return
            } else {
                Toast.error(response.message, "Error")
                return
            }
        },
    });

    return (
        <KycRouteGuard requiredAction={ACTIONS.DEPOSIT}
            fallbackRedirect={APP_ROUTES.DASHBOARD}
        >
        <div>
            <Head header={"Make a Deposit"} subHeader={"Securely deposit fiat or crypto to fund your account and start trading."} />

            <form className="mt-10" onSubmit={formik.handleSubmit}>
                <TokenSelect title={"Select option"} label={"Select Asset"} error={undefined} touched={undefined} handleChange={(e) => { setSelectedToken(e); setSelectedNetworks(""); setPaymentOption("") }} />

                {
                    selectedToken &&

                    <div className="my-4">
                        {
                                selectedToken !== "ngn"
                                && <MultiSelectDropDown parentId={""} title={"Select"} choices={networks} error={undefined} touched={undefined} label={"Select Network"} handleChange={(e) => setSelectedNetworks(e)} />

                        }
                    </div>
                }
                {selectedToken === "ngn" &&
                    <div>
                        <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Amount"} placeholder="Enter amount" name="amount" error={formik.errors.amount} value={formik.values.amount} touched={formik.touched.amount} onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                formik.setFieldValue('amount', value);
                            }
                        }} />
                        <PrimaryButton css={"w-full"} text={"Proceed"} loading={isLoading} />
                    </div>}
                {
                    ((selectedNetwork)) && (


                            <div>
                                <div className="lg:h-[84px] rounded border border-dashed  border-[#F59E0C] bg-[#FFFBEB] rounded-[12px] py-1 lg:py-3 px-2 lg:px-5">
                                    <h1 className="text-[#2B313B] text-[14px] leading-[24px] font-[600]">Wallet Address</h1>
                                    <div className="flex  flex-wrap lg:flex-nowrap text-wrap items-center justify-between mt-2">
                                        <p className="text-[#515B6E] text-[14px] leading-[24px] font-[400] break-all">0x8708bcabde9d58fedcd164ebf0d3742486284b90</p>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="#515B6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="#515B6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </div>
                                </div>
                                <div className="lg:h-[88px] rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 flex items-start my-5 ">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8 5.33301V8.66634" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.99609 10.667H8.00208" stroke="#858FA5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <p className="text-[#606C82] text-[12px] leading-[16px] font-[400] ml-2">Please confirm that you are depositing<span className="fomt-600">{selectedToken}</span> to this address on the <span className="fomt-600">Arbitrum One</span>  network.
                                        <br />
                                        Mismatched address indivation may result in the permanent loss of your assets.</p>

                                </div>

                            </div>)
                }


            </form>

            </div>
        </KycRouteGuard>

    )
}

export default DepositPage