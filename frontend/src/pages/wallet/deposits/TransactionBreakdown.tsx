import React, { useEffect, useState } from 'react'
import Head from '../Head'
import { PrimaryButton, WhiteTransparentButton } from '../../../components/buttons/Buttons'
import { getDepositBreakDown } from '../../../helpers'
import { ConfirmDeposit, TopUpNGNBalance } from '../../../redux/actions/walletActions'
import { MultiSelectDropDown } from '../../../components/Inputs/MultiSelectInput'
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from '../../../constants/app_route'
import { useSelector } from 'react-redux'
import { UserState } from '../../../redux/reducers/userSlice'
import Toast from '../../../components/Toast'

type TBank = {
    id: string,
    bankName: string,
    accountName: string,
    accountNumber: string

}
const TransactionBreakdown = () => {
    const user: UserState = useSelector((state: any) => state.user);
    const [isBreakDown, setIsBreakDown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)


    const [selectedBank, setSelectedBank] = useState<TBank>()

    const [selectedBankID, setSelectedBankID] = useState("")
    const [paymentID, setPaymentID] = useState("")

    const TransBreakDown = getDepositBreakDown()
    const banks = TransBreakDown.bankAccounts.map((tb: any) => ({
        value: tb?.id,
        label: <div className='text-[12px] flex flex-col '>
            <p>{tb?.bankName}</p>
            <p className='my-1'>{tb?.accountNumber}</p>
            <p>{tb?.accountName}</p> 
        </div>,
        labelDisplay: <div className='text-[12px] flex flex '>
            <p>{tb?.bankName}</p>
            <p className=''>- {tb?.accountNumber}</p>
            {/* <p>{tb?.accountName}</p> */}
        </div>,
    }))
    const navigate = useNavigate()


    useEffect(() => {
        for (let i of TransBreakDown?.bankAccounts) {
            if (i?.id === selectedBankID) {
                setSelectedBank(i)
            }
        }
    }, [selectedBankID])

    const onIntiateTopUp = async () => {
        setLoading(true)
        const response = await TopUpNGNBalance({
            userId: `${user?.user?.userId}`,
            amount: Number(TransBreakDown?.amount),
            bankAccountId: selectedBankID
        })
        setLoading(false)
        if (response?.status) {
            setPaymentID(response?.data?.id)
            setIsBreakDown(true)
            Toast.success(response.message, "Transaction Initiated")
        } else {
            Toast.error(response.message, "")
        }
    }

    const ConfirmPayment = async (prop: string) => {
        {
            prop === "confirmed" ?
        
                setConfirmLoading(true) : setCancelLoading(true)
        }
        const response = await ConfirmDeposit({
            userId: `${user?.user?.userId}`,
            status: `${prop}`,
            paymentId: paymentID
        })
        {
            prop === "confirmed" ?

                setConfirmLoading(false) : setCancelLoading(false)
        }
    if (response?.status) {
        navigate(APP_ROUTES.WALLET.HOME)
        Toast.success("", response?.message,)
    } else {
        Toast.error(response?.message, "Failed")
    }
    }

    return (
        <div>
            <div>
                <Head header={isBreakDown ? "Confirm Deposit" : "Select Bank"} subHeader={isBreakDown ? "Make sure to send the exact amount to avoid loss of funds." : "Select a bank you will be making payments into"} />
                {
                    isBreakDown ? <>
                        <div className='py-5'>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[#424A59] font-[400]">Amount:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.amount}</p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[#424A59] font-[400]">Stamp Duty:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.stampDuty}</p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[#424A59] font-[400]">Processing Charge:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.processingCharge}</p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[#424A59] font-[400]">VAT:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.vat}</p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[#424A59] font-[400]">Commission:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.commission}</p>
                            </div>

                            <div className="flex justify-between items-center border-t-[0.5px] border-[#606C82] pt-5">
                                <p className="text-[#424A59] font-[400]">Total:</p>
                                <p className="text-[#606C82]  font-[600]">NGN {TransBreakDown?.totalAmount}</p>
                            </div>
                        </div>
                        <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] p-2  my-5 text-[14px] leading-[24px] ">
                            <h1 className="text-[#424A59] font-[600] text-[16px]"> Bank details</h1>

                            <div className='mt-3'>
                                <div className="flex justify-between items-center mb-2 ">
                                    <p className="text-[#424A59] font-[400]">Bank Name:</p>
                                    <p className="text-[#606C82]  font-[600]"> {selectedBank?.bankName}</p>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[#424A59] font-[400]">Account Number:</p>
                                    <p className="text-[#606C82]  font-[600]">{selectedBank?.accountNumber} </p>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <p className="text-[#424A59] font-[400]">Account Name:</p>
                                    <p className="text-[#606C82]  font-[600]">{selectedBank?.accountName}</p>
                                </div>

                            </div>
                        </div>
                        <PrimaryButton text={'I have made payment'} loading={confirmLoading} css='w-full' onClick={() => ConfirmPayment("confirmed")} />
                        <WhiteTransparentButton text={'Cancel'} loading={cancelLoading} css='w-full mt-3' onClick={() => ConfirmPayment("cancel")} />
                    </> :
                        <>  <div className="h-fit rounded border border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] p-2  my-5 text-[14px] leading-[24px] ">
                        <h1 className="text-[#424A59] font-[600] text-[16px]"> Select Bank</h1>

                        <div>
                            <MultiSelectDropDown title={'Select a bank for payment'} choices={banks} error={undefined} touched={undefined} label={''} handleChange={(prop) => setSelectedBankID(prop)} />
                        </div>

                    </div>
                        <PrimaryButton text={'Proceed'} loading={loading} css='w-full' onClick={() => onIntiateTopUp()} />
                        <WhiteTransparentButton text={'Cancel'} loading={false} css='w-full mt-3' onClick={() => navigate(APP_ROUTES.WALLET.DEPOSIT)} /></>
                }
            </div>
        </div>
    )
}

export default TransactionBreakdown
