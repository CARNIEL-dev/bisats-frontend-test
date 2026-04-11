import React from "react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import LogOutIcon from "@/assets/icons/logout-icon.svg";
import { Clock } from "lucide-react";
import { logoutUser } from "@/redux/actions/userActions";
import queryClient from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/app_route";

interface SessionExpiredModalProps {
  variant: "inactivity" | "expired";
  onStay?: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  variant,
  onStay,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    queryClient.clear();
    navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <ModalTemplate onClose={() => {}} isOpen showCloseButton={false}>
      <div className="flex flex-col gap-4">
        {variant === "inactivity" ? (
          <Clock className="size-[32px] lg:size-[50px] text-primary" />
        ) : (
          <img
            src={LogOutIcon}
            alt="session expired"
            className="size-[32px] lg:size-[50px]"
          />
        )}

        <p className="font-semibold lg:text-lg">
          {variant === "inactivity"
            ? "Are You Still There?"
            : "Session Expired"}
        </p>

        <p className="text-sm text-muted-foreground">
          {variant === "inactivity"
            ? "You've been inactive for a while. For your security, you'll be signed out shortly."
            : "Your session has expired. Please sign in again to continue."}
        </p>

        <div className="flex flex-col items-center gap-3 w-full mt-2">
          {variant === "inactivity" ? (
            <>
              <PrimaryButton
                text="Stay Signed In"
                loading={false}
                className="w-full"
                onClick={onStay}
              />
              <WhiteTransparentButton
                text="Sign Out"
                loading={false}
                className="w-full"
                onClick={handleLogout}
              />
            </>
          ) : (
            <PrimaryButton
              text="Sign In Again"
              loading={false}
              className="w-full"
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SessionExpiredModal;
