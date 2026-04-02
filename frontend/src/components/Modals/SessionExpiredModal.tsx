import React from "react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { PrimaryButton } from "@/components/buttons/Buttons";
import LogOutIcon from "@/assets/icons/logout-icon.svg";
import { logoutUser } from "@/redux/actions/userActions";
import queryClient from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/app_route";

const SessionExpiredModal: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    logoutUser();
    queryClient.clear();
    navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <ModalTemplate
      onClose={() => {}}
      isOpen
      showCloseButton={false}
    >
      <div className="flex flex-col gap-4">
        <img
          src={LogOutIcon}
          alt="session expired"
          className="size-[32px] lg:size-[50px]"
        />

        <p className="font-semibold lg:text-lg">Session Expired</p>
        <p className="text-sm text-muted-foreground">
          Your session has expired due to inactivity or an expired session.
          Please log in again.
        </p>

        <div className="flex items-center w-full mt-2">
          <PrimaryButton
            text={"Go to Login"}
            loading={false}
            className="w-full"
            onClick={handleGoToLogin}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SessionExpiredModal;
