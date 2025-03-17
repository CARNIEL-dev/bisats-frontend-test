import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons"
import PrimaryInput from "../Inputs/PrimaryInput"
import ModalTemplate from "./ModalTemplate"
interface Props {
    close: () => void;
}
const DeleteWithdrawalAccount: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={() => close()}>

            <div className='relative pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Delete withdrawal account?</h1>
                <p className='text-[#606C82] text-[14px] lg:text-[14px] leading-[24px] font-[400] mt-3'>
                    Are you sure you want to delete withdrawal account?
                </p>

                <div className='flex items-center w-full mt-5'>
                    <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                    <PrimaryButton text={'Proceed'} loading={false} css='w-1/2 ml-3' />
                </div>
            </div>
        </ModalTemplate>
    )
}

export default DeleteWithdrawalAccount