import { useState } from 'react'
import { WhiteTransparentButton } from '../../components/buttons/Buttons'
import ResetPasswordModal from '../../components/Modals/ResetPassword'

const Security = () => {
    const [openResetPasswordModal, setOpenResetPasswordModal] = useState(true);

    return (
        <div>
            <h1 className="text-[22px] lg:text-[22px] leading-[32px] font-[600] text-[#2B313B]">Security</h1>


            <div className='mt-5'>

                <div className='flex items-center justify-between'>
                    <div className='text-[#606C82] font-[400]'>
                        <h1 className='text-[16px] lg:text-[16px] leading-[28px]   mb-2'>Password</h1>
                        <p className='text-[12px] lg:text-[12px] leading-[16px]  '>Set a unique password for better protection</p>
                    </div>

                    <WhiteTransparentButton text={'Change Password'} loading={false} size='sm' css='w-[137px]' />
                </div>

                <div className='flex items-center justify-between mt-5'>
                    <div className='text-[#606C82] font-[400]'>
                        <h1 className='text-[16px] lg:text-[16px] leading-[28px]   mb-2'>2FA (Two-Factor Authentication)</h1>
                        <p className='text-[12px] lg:text-[12px] leading-[16px]  '>Status: <span className={`text-[#DC2625]`}>Off</span></p>
                    </div>

                    <WhiteTransparentButton text={'Enable'} loading={false} size='sm' css='w-[137px]' />
                </div>

            </div>

            {openResetPasswordModal && <ResetPasswordModal close={() => setOpenResetPasswordModal(false)} />}

        </div>
    )
}

export default Security