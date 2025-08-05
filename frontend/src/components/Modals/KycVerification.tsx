import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentCard from "@/assets/student-card.svg";
import { APP_ROUTES } from "@/constants/app_route";
import { UserState } from "@/redux/reducers/userSlice";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { Button } from "@/components/ui/Button";
import ModalTemplate from "@/components/Modals/ModalTemplate";

interface Props {
  close: () => void;
}
const KycVerification: React.FC<Props> = ({ close }) => {
  const navigate = useNavigate();
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full text-center mx-auto">
        <img
          src={StudentCard}
          alt="student-card"
          className="w-[80px] h-[60px] mx-auto mt-7"
        />
        <h1 className="text-[#0A0E12] text-[18px] leading-[32px] lg:text-[18px] lg:leading-[32px] font-semibold ">
          KYC Verification Required
        </h1>
        <p className="text-[#606C82] text-[14px] leading-[24px] lg:text-[14px] lg:leading-[24px] font-normal my-3">
          To proceed with this action, we need to verify your identity.
          Completing KYC ensures a secure and compliant trading experience for
          all users.
        </p>
        <PrimaryButton
          css={"w-full"}
          text={"Start Verification"}
          loading={false}
          onClick={() =>
            !user?.phoneNumberVerified
              ? navigate(APP_ROUTES.KYC.PHONEVERIFICATION)
              : navigate(APP_ROUTES.KYC.PERSONAL)
          }
        />

        <Button
          variant="ghost"
          className="w-full my-3 text-sm text-gray-600"
          onClick={close}
        >
          Maybe Later
        </Button>
      </div>
    </ModalTemplate>
  );
};

export default KycVerification;
