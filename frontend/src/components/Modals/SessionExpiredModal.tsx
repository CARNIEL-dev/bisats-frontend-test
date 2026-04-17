import LogOutIcon from "@/assets/icons/logout-icon.svg";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { APP_ROUTES } from "@/constants/app_route";
import queryClient from "@/lib/queryClient";
import { logoutUser } from "@/redux/actions/userActions";
import { Frown } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface SessionExpiredModalProps {
  variant: "inactivity" | "expired";
  onStay?: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  variant,
  onStay,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const currentPath = location.pathname + location.search;
    logoutUser();
    queryClient.clear();
    navigate(APP_ROUTES.AUTH.LOGIN, {
      replace: true,
      state: { from: { pathname: currentPath } },
    });
  };

  return (
    <ModalTemplate onClose={() => {}} isOpen showCloseButton={false}>
      <div className="flex flex-col gap-4">
        {variant === "inactivity" ? (
          <Frown
            strokeWidth={1.5}
            className="size-[32px] lg:size-[50px] text-primary"
          />
        ) : (
          <img
            src={LogOutIcon}
            alt="session expired"
            className="size-[32px] lg:size-[50px]"
          />
        )}
        <div>
          <p className="font-semibold lg:text-lg">
            {variant === "inactivity"
              ? "Are You Still There?"
              : "Session Expired"}
          </p>

          <p className="text-sm text-muted-foreground">
            {variant === "inactivity"
              ? "You've been inactive for a while."
              : "Your session has expired. Please sign in again to continue."}
          </p>
        </div>

        <div className="flex  items-center gap-2 w-full mt-4">
          {variant === "inactivity" ? (
            <>
              <Button
                size="lg"
                className="text-sm text-muted-foreground rounded-full py-6 hover:text-destructive"
                variant={"secondary"}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
              <Button
                size="lg"
                className="text-sm font-semibold rounded-full py-6 flex-1 hover:scale-[103%]"
                onClick={onStay}
              >
                Stay Signed In
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="text-sm font-semibold rounded-full py-6 flex-1 hover:scale-[103%]"
              onClick={handleLogout}
            >
              Sign In Again
            </Button>
          )}
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SessionExpiredModal;
