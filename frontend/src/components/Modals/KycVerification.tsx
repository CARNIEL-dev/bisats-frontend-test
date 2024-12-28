import ModalTemplate from "./ModalTemplate"
import StudentCard from "../../assets/student-card.svg"
import { PrimaryButton, RedTransparentButton } from "../buttons/Buttons"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../constants/app_route"
import { getUser } from "../../helpers"

interface Props {
    close: () => void;

}
const KycVerification: React.FC<Props> = ({ close }) => {
    const navigate = useNavigate()
    const user = getUser()
    return (
        <ModalTemplate onClose={close} >
            <div className="flex flex-col justify-center w-full text-center mx-auto">
                <img src={StudentCard} alt="student-card" className="w-[80px] h-[60px] mx-auto mt-7" />
                <h1 className="text-[#0A0E12] text-[18px] leading-[32px] lg:text-[18px] lg:leading-[32px] font-[600] ">KYC Verification Required</h1>
                <p className="text-[#606C82] text-[14px] leading-[24px] lg:text-[14px] lg:leading-[24px] font-[400] my-3">To proceed with this action, we need to verify your identity. Completing KYC ensures a secure and compliant trading experience for all users.</p>
                <PrimaryButton css={"w-full"} text={"Start Verification"} loading={false} onClick={() => !user.phoneNumberVerified ? navigate(APP_ROUTES.KYC.PHONEVERIFICATION) : navigate(APP_ROUTES.KYC.PERSONAL)} />
                <RedTransparentButton css={"w-full my-3"} text={"Maybe Later"} loading={false} onClick={close} />
            </div>
        </ModalTemplate>

    )
}

export default KycVerification
