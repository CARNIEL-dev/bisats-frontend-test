import React, { useState } from 'react'
import { WhiteTransparentButton } from '../../components/buttons/Buttons'
import DeleteWithdrawalAccount from '../../components/Modals/DeleteWithdrawalAccount'
import AddWithdrawalBankAccount from '../../components/Modals/AddWithdrawalBankAccount'

const Payment = () => {
    const [openDeleteBankAccount, setOpenDeleteBankAccount] = useState(false)
    const [openAddBankAccount, setOpenAddBankAccount] = useState(false)

    const BankDetails = [
        {
            label: "Account Name",
            value: "ADEBISI CYNTHIA"
        },
        {
            label: "Account Number ",
            value: "2084178722"
        },
        {
            label: "Bank Name",
            value: "UBA"
        },
        {
            label: "Bank Branch",
            value: "-"
        },
    ]
    return (
        <div>
            <h1 className="text-[22px] lg:text-[22px] leading-[32px] font-[600] text-[#2B313B]">Payment</h1>

            <div className="flex justify-between my-3">

                <h1 className="text-[16px] lg:text-[16px] leading-[28px] font-[400] text-[#606C82]">Withdrawal Pin</h1>
                <WhiteTransparentButton text={"Set Pin"} loading={false} css="px-7 w-[117px]" size="sm" />
            </div>
            <div className="flex justify-between my-5">

                <h1 className="text-[18px] lg:text-[18px] leading-[32px] font-[600] text-[#2B313B]">Withdrawal Accounts</h1>
                <button onClick={() => setOpenAddBankAccount(true)} className={`  h-[32px] text-[12px] py-0.5 px-3 w-[117px] rounded-[6px] bg-transparent text-[#525C76] border-[1px] border-[#D6DAE1]  leading-[24px] font-[600] text-center py-3 `}>
                    <span className='text-[#624B00]'>+</span> Add
                </button>

            </div>


            <div className='bg-[#F9F9FB] rounded-[8px] p-3 px-10 my-5'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-[14px] leading-[24px] font-[400] text-[#2B313B]'>Account 1</h1>
                    <div className='flex items-center w-[9%] justify-between text-[12px] font-[600]'>
                        <p className='text-[#515B6E] cursor-pointer'>Edit</p>
                        <p className='text-[#B91C1B] cursor-pointer' onClick={() => setOpenDeleteBankAccount(true)}>Delete</p>

                    </div>
                </div>
                <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
                    {BankDetails.map((item, idx) =>
                        <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                            <p className="text-[12px]  leading-[16px] font-[400] text-[#515B6E] mb-2"> {item.label}</p>
                            <h1 className="text-[12px]  leading-[16px] font-[400] text-[#2B313B]">{item.value}</h1>
                        </div>
                    )}
                </div>

            </div>
            {openDeleteBankAccount && <DeleteWithdrawalAccount close={() => setOpenDeleteBankAccount(false)} />
            }
            {openAddBankAccount && <AddWithdrawalBankAccount close={() => setOpenAddBankAccount(false)} />
            }
        </div>
    )
}

export default Payment