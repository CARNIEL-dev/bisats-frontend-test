import ID from "@/assets/student-card.svg";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { UserState } from "@/redux/reducers/userSlice";
import { useSelector } from "react-redux";

const KycBanner = () => {
  const user: UserState = useSelector((state: any) => state.user);

  const clickHandler = () => {
    if (!user?.user?.phoneNumberVerified) {
      window.location.href = APP_ROUTES.KYC.PHONEVERIFICATION;
    } else if (!user.kyc?.personalInformationVerified) {
      window.location.href = APP_ROUTES.KYC.PERSONAL;
    } else if (!user?.kyc.identificationVerified) {
      window.location.href = APP_ROUTES.KYC.IDENTITY;
    } else if (!user?.kyc?.bvnVerified) {
      window.location.href = APP_ROUTES.KYC.BVNVERIFICATION;
    } else {
      window.location.href = APP_ROUTES.KYC.LEVEL3VERIFICATION;
    }
  };
  return (
    <div className="w-full bst-kyc-banner flex items-start py-5 md:px-7 px-3 rounded-[12px] gap-3">
      <div className="border shrink-0  rounded-full size-12 flex justify-center pt-1.5">
        <img className="w-[33px] h-[33px] " src={ID} alt="id-card" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className=" text-white text-base lg:text-[28px] font-semibold">
          Unlock Full Access: Complete Your KYC
        </h4>
        <p className="text-gray-400  text-xs md:text-sm font-normal">
          Verify your identity to enjoy unlimited access to all features. It
          only takes a few minutes to complete your KYC.
        </p>

        <Button
          type="button"
          className="!py-3 h-fit md:w-fit mt-3"
          onClick={clickHandler}
        >
          Complete KYC
        </Button>
      </div>
    </div>
  );
};
export default KycBanner;
