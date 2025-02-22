import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons"
import { MultiSelectDropDown } from "../Inputs/MultiSelectInput";
import PrimaryInput from "../Inputs/PrimaryInput";
import ModalTemplate from "./ModalTemplate";
interface Props {
    close: () => void;
}

const AddWithdrawalBankAccount: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={close}>

            <div className='relative pt-10'>
                <h1 className='text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-[600]'>Add Withdrawal Bank Account</h1>
                <div className="my-5">
                    <MultiSelectDropDown title={"Select Bank"} choices={[]} error={undefined} touched={undefined} label={"Bank"} handleChange={function (prop: string): void {
                        throw new Error("Function not implemented.");
                    }} />
                    <div className="my-3">
                        <PrimaryInput css={"w-full py-2 "} label={"Account Number"} error={undefined} touched={undefined} />

                    </div>
                    <PrimaryInput css={"w-full py-2"} label={"Bank Branch"} error={undefined} touched={undefined} />


                </div>
                <div className='flex items-center w-full mt-5'>
                    <WhiteTransparentButton text={'Cancel'} loading={false} onClick={close} css='w-[]' style={{ width: "50%" }} />
                    <PrimaryButton text={'Save Account'} loading={false} css='w-1/2 ml-3' />
                </div>
            </div>
        </ModalTemplate>
    )
}

export default AddWithdrawalBankAccount
