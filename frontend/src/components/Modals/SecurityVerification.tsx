import ModalTemplate from "./ModalTemplate";
import PrimaryInput from "../Inputs/PrimaryInput";
import { PrimaryButton } from "../buttons/Buttons";

interface Props {
    close: () => void;

}
const SecurityVerification: React.FC<Props> = ({ close }) => {
    return (
        <ModalTemplate onClose={close}>

            <div className="flex flex-col justify-center w-full  mx-auto">
                <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-[600] text-left mt-5">Security Verification</h1>
                <form className="mt-5">
                    <div className="relative mb-4">
                        <span className="text-[#937000] text-[14px] leading-[24px] font-[600] absolute bottom-3 right-5">Get Code</span>
                        <PrimaryInput css={"w-full p-2.5"} label={"Email Verification"} placeholder="Enter code" error={undefined} touched={undefined} />
                    </div>
                    <PrimaryInput css={"w-full p-2.5 mb-7"} label={"Wallet password"} placeholder="Enter password" error={undefined} touched={undefined} />

                    <PrimaryButton css={""} text={"Confirm"} loading={false} />
                </form>


            </div>
        </ModalTemplate>
    )
}

export default SecurityVerification
