import React from 'react'
import ModalTemplate from './ModalTemplate';

interface Props {
    close: () => void;
}
const SelectWithDrawalBankAccount: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={() => close()}>
            <div className='relative pt-10'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Add Withdrawal Bank Account</h1>      

                    <p className='text-[#17A34A] text-[14px] lg:text-[22px] leading-[24px] font-[600]'>Add New Account</p>
                </div>
            </div>
            </ModalTemplate>
  )
}

export default SelectWithDrawalBankAccount
