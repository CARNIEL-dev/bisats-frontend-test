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


export type TNetwork = {
    label: string,
    value: string
}
const WithdrawalPage = () => {
    const [selectedToken, setSelectedToken] = useState<string>()
    const [networks, setNetworks] = useState<TNetwork[]>([])
    const [selectedNetwork, setSelectedNetworks] = useState<string>()
    const [paymentOption, setPaymentOption] = useState<string>()
    const [withdrawalModal, setWithDrawalModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)



    useEffect(() => {
        for (let token of TokenData) {
            if (token.id === selectedToken) {
                setNetworks(token.networks)
                return
            }
        }
    }, [selectedToken])


    return (
        <div>
            <Head header={"Make a Withdrawal"} subHeader={"Securely withdraw fiat or crypto from your account."} />

            <div className="mt-10">
                <TokenSelect title={"Select option"} label={"Select Asset"} error={undefined} touched={undefined} handleChange={(e) => { setSelectedToken(e); setSelectedNetworks(""); setPaymentOption("") }} />

                {
                    selectedToken &&

                    <div className="my-4">
                        {
                            selectedToken === "ngn" ?
                                <MultiSelectDropDown parentId={""} title={"Select option"} choices={networks} error={undefined} touched={undefined} label={"Payment options"} handleChange={(e) => setPaymentOption(e)} />

                                : <MultiSelectDropDown parentId={""} title={"Select"} choices={networks} error={undefined} touched={undefined} label={"Select Network"} handleChange={(e) => setSelectedNetworks(e)} />

                        }
                    </div>
                }

                {
                    ((selectedNetwork || paymentOption) && selectedToken) && (
                        selectedToken === "ngn" ?
                            <div>
                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Amount"} placeholder="Enter amount" error={undefined} touched={undefined} />
                                <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5  my-5 text-[14px] leading-[24px] ">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Daily remaining limit:</p>
                                        <p className="text-[#606C82]  font-[600]">NGN 20,000,000.00</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Transaction fee:</p>
                                        <p className="text-[#606C82]  font-[600]">5 xNGN</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Withdrawal amount:</p>
                                        <p className="text-[#606C82]  font-[600]">200,000.00 xNGN</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Total:</p>
                                        <p className="text-[#606C82]  font-[600]">200,005.00 xNGN</p>
                                    </div>
                                </div>
                                <PrimaryButton css={""} text={"Withdraw"} loading={false} onClick={() => setWithDrawalModal(true)} />
                            </div>
                            :
                            <div>

                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Wallet Address"} placeholder="Enter address" error={undefined} touched={undefined} />
                                <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Amount"} placeholder="Enter amount" error={undefined} touched={undefined} />


                                <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] ">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Daily remaining limit:</p>
                                        <p className="text-[#606C82]  font-[600]">NGN 20,000,000.00</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Transaction fee:</p>
                                        <p className="text-[#606C82]  font-[600]">0.005 ETH</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Withdrawal amount:</p>
                                        <p className="text-[#606C82]  font-[600]">5 ETH</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[#424A59] font-[400]">Total:</p>
                                        <p className="text-[#606C82]  font-[600]">5.005 ETH</p>
                                    </div>
                                </div>
                                <PrimaryButton css={""} text={"Withdraw"} loading={false} onClick={() => setWithDrawalModal(true)} />
                            </div>)
                }


            </div>

            {withdrawalModal && (selectedToken === "ngn" ? <WithdrawalConfirmationNGN close={() => setWithDrawalModal(false)}
                transactionFee="5"
                withdrawalAmount="200,000"
                total="200,005" /> : <WithdrawalConfirmationCrypto close={() => setWithDrawalModal(false)} />)}
            {verificationModal && <SecurityVerification close={() => setVerificationModal(false)} />}

        </div>
    )
}

export default WithdrawalPage