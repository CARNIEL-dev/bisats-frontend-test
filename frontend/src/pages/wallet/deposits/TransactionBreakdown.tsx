import React from 'react'
import Head from '../Head'
import { PrimaryButton, WhiteTransparentButton } from '../../../components/buttons/Buttons'
import { getDepositBreakDown } from '../../../helpers'
import { ConfirmDeposit } from '../../../redux/actions/walletActions'

const TransactionBreakdown = () => {
    const TransBreakDown = getDepositBreakDown()

    const onSubmit = () => {
        const response = ConfirmDeposit()
    }
    return (
        <div>
            <div>
                <Head header={"Confirm Deposit"} subHeader={"Make sure to send the exact amount to avoid loss of funds."} />

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
                            <p className="text-[#606C82]  font-[600]"> {TransBreakDown?.bankAccounts[0].bankName}</p>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[#424A59] font-[400]">Account Number:</p>
                            <p className="text-[#606C82]  font-[600]">{TransBreakDown?.bankAccounts[0].accountNumber} </p>
                        </div>
                        <div className="flex justify-between items-center ">
                            <p className="text-[#424A59] font-[400]">Account Name:</p>
                            <p className="text-[#606C82]  font-[600]">{TransBreakDown?.bankAccounts[0].accountName}</p>
                        </div>

                    </div>
                </div>
                <PrimaryButton text={'I have made payment'} loading={false} css='w-full' />
                <WhiteTransparentButton text={'Cancel'} loading={false} css='w-full mt-3' />

            </div>
        </div>
    )
}

export default TransactionBreakdown
