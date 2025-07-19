import React, { useEffect, useState } from 'react'
import DeleteWithdrawalAccount from '../../components/Modals/DeleteWithdrawalAccount'
import AddWithdrawalBankAccount from '../../components/Modals/AddWithdrawalBankAccount'
import { UserState } from '../../redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import { WalletState } from '../../redux/reducers/walletSlice';
import { WhiteTransparentButton } from '../../components/buttons/Buttons';
import { EditBankAccountForWithdrawal, GetWallet } from '../../redux/actions/walletActions';
import EditWithdrawalBankAccount from '../../components/Modals/EditWithDrawalBank';


type TBank = { id: string; accountNumber: string; accountName: string; bankName: string; bankCode: string; } 
const Payment = () => {
    const walletState: WalletState = useSelector((state: any) => state.wallet);

    const wallet = walletState?.wallet
    const [openDeleteBankAccount, setOpenDeleteBankAccount] = useState(false)
    const [openAddBankAccount, setOpenAddBankAccount] = useState(false)
    const [openEditBankAccount, setOpenEditBankAccount] = useState(false)
    const [selectedBank, setSelectedBank]=useState<TBank>()


 useEffect(() => {
        GetWallet()
    }, [openAddBankAccount,openDeleteBankAccount,openEditBankAccount])
    
    const BankDetails = wallet?.bankAccount.map((bank: { id: string; accountNumber: string; accountName: string; bankName: string; bankCode: string; }) => (
    {
        id: bank?.id,
        accountNumber: bank?.accountNumber,
        accountName: bank?.accountName,
        bankName: bank?.bankName,
        bankCode: bank?.bankCode
       
    }
    ))
    
   
    return (
        <div>

            
            <div className="flex justify-between my-5">

                <h1 className="text-[18px] lg:text-[18px] leading-[32px] font-semibold text-[#2B313B]">Withdrawal Accounts</h1>
                <WhiteTransparentButton text={<><span className='text-[#624B00]'>+</span> Add</>} size='sm' css='w-[137px]' loading={false} onClick={() => setOpenAddBankAccount(true)} />
           

            </div>


            {
                BankDetails.map((details: TBank, idx:number) =>
                    <div className='bg-[#F9F9FB] rounded-[8px] p-3 px-10 my-5' key={idx}>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-[14px] leading-[24px] font-normal text-[#2B313B]'>Account { idx+1}</h1>
                            <div className='flex items-center w-[9%] justify-between text-[12px] font-semibold'>
                                <p className='text-[#515B6E] cursor-pointer' onClick={() => {
                                    setSelectedBank(details);
                                    setOpenEditBankAccount(true)
                                }}>Edit</p>
                                <p className='text-[#B91C1B] cursor-pointer' onClick={() => {
                                    setSelectedBank(details);
                                    setOpenDeleteBankAccount(true)

                                }}>Delete</p>

                            </div>
                        </div>
                        <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
                                <div  className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-normal text-[#515B6E] mb-2"> Account Name</p>
                                    <h1 className="text-[12px]  leading-[16px] font-normal text-[#2B313B]">{details?.accountName}</h1>
                            </div>
                            <div  className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-normal text-[#515B6E] mb-2"> Account Number</p>
                                <h1 className="text-[12px]  leading-[16px] font-normal text-[#2B313B]">{details?.accountNumber}</h1>
                            </div>
                            <div  className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-normal text-[#515B6E] mb-2"> Bank Name</p>
                                <h1 className="text-[12px]  leading-[16px] font-normal text-[#2B313B]">{details?.bankName}</h1>
                            </div>
                            <div  className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-normal text-[#515B6E] mb-2"> Bank Branch</p>
                                <h1 className="text-[12px]  leading-[16px] font-normal text-[#2B313B]">{"-"}</h1>
                            </div>
                        </div>

                    </div>
                )
            }
           
            {openDeleteBankAccount && <DeleteWithdrawalAccount close={() => setOpenDeleteBankAccount(false)} bank={selectedBank} />
            }
            {openAddBankAccount && <AddWithdrawalBankAccount close={() => setOpenAddBankAccount(false)} />}
            {openEditBankAccount && <EditWithdrawalBankAccount close={() => setOpenEditBankAccount(false)} bank={ selectedBank} />}

        </div>
    )
}

export default Payment