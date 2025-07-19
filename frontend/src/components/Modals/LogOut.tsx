import React from 'react'
import ModalTemplate from './ModalTemplate';
import { PrimaryButton, WhiteTransparentButton } from '../buttons/Buttons';
import LogOutIcon from "../../assets/icons/logout-icon.svg"
import { logoutUser } from '../../redux/actions/userActions';

interface Props {
    close: () => void;
}
const LogOutModal: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={close} >

            <div className='relative'>
                <img src={LogOutIcon} alt='logout text' className='w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] ' />
                <h1 className='text-[#001140] text-[18px] lg:text-[22px] leading-[32px] font-semibold my-5'>Are you sure you want to Sign out of your Bisats account?</h1>

                <div className='flex items-center w-full'>
                    <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                    <PrimaryButton text={'Log Out'} loading={false} css='w-1/2 ml-3' onClick={() => logoutUser()} />
                </div>
            </div>

        </ModalTemplate>
    )

}

export default LogOutModal
