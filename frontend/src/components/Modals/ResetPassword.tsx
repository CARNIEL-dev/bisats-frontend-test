import React from 'react'
import ModalTemplate from './ModalTemplate';
import { PrimaryButton, WhiteTransparentButton } from '../buttons/Buttons';

interface Props {
    close: () => void;
}
const ResetPasswordModal: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={close} >

            <div className='relative pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Reset Password</h1>
                <p className='text-[#606C82] text-[14px] lg:text-[14px] leading-[24px] font-[400] mt-3'>
                    You will receive detailed instructions on how to reset your password via email. Please check your inbox and follow the steps provided to change your password.
                    If you don’t see the email, be sure to check your spam or junk folder.
                </p>

                <div className='flex items-center w-full mt-5'>
                    <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                    <PrimaryButton text={'Proceed'} loading={false} css='w-1/2 ml-3' />
                </div>
            </div>

        </ModalTemplate>
    )

}

export default ResetPasswordModal
