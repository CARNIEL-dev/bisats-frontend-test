import { useSelector } from "react-redux"
import ID from "../assets/student-card.svg"
import { APP_ROUTES } from "../constants/app_route"
import { UserState } from "../redux/reducers/userSlice"
import { PrimaryButton } from "./buttons/Buttons"
import { useNavigate } from "react-router-dom"

const KycBanner = () => {
     const navigate = useNavigate()
    const user: UserState = useSelector((state: any) => state.user);
    return (
        <div className="w-full bst-kyc-banner flex items-start py-5 px-7 rounded-[12px] ">
            <div className="border-[1px] border-[#FFFFFF] rounded-[100px] w-[49px] h-[49px] flex justify-center pt-1.5">
                <img className="w-[33px] h-[33px] " src={ID} alt="id-card" />
            </div>
            <div className="mx-5">
                <h1 className=" text-white text-[14px] leading-[24px] lg:text-[28px] lg:leading-[40px] font-[600]">Unlock Full Access: Complete Your KYC</h1>
                <p className="text-[#C2C7D2] text-[12px] leading-[16px] py-1 lg:text-[16px] lg:leading-[28px] font-[400]">Verify your identity to enjoy unlimited access to all features. It only takes a few minutes to complete your KYC.</p>
                <PrimaryButton text={"Complete KYC"} loading={false} css={"w-fit px-5"} onClick={() => !user?.user?.phoneNumberVerified ? navigate(APP_ROUTES.KYC.PHONEVERIFICATION) : navigate(APP_ROUTES.KYC.PERSONAL)} />
            </div>


        </div>
    )
}
export default KycBanner