import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import TwoFactorAuthModal from "@/components/Modals/2FAModal";
import ForgotPinModal from "@/components/Modals/ForgotPinModal";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Reset2FAModal from "@/components/Modals/Reset2FAModal";
import ResetPasswordModal from "@/components/Modals/ResetPassword";
import PinForm from "@/components/shared/PinForm";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { FORGOT_PIN } from "@/redux/actions/userActions";
import { Loader2 } from "lucide-react";

import { useState } from "react";
import { useSelector } from "react-redux";

const Security = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [forgotPinLoading, setForgotPinLoading] = useState(false);

  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [pinModal, setPinModal] = useState({
    forgot: false,
    mode: false,
  });

  const [show2FAModal, setShow2FAModal] = useState({
    enable: false,
    disable: false,
    reset: false,
  });

  const handleForgotPin = async () => {
    setForgotPinLoading(true);

    const res = await FORGOT_PIN();
    if (res.status || res.statusCode === 200 || res.statusCode === 201) {
      setPinModal({
        ...pinModal,
        forgot: true,
      });
    } else {
      Toast.error(res?.message, "Failed");
    }
    setForgotPinLoading(false);
  };

  return (
    <div>
      <h4 className="text-[22px] lg:text-[22px] leading-[32px] font-semibold text-[#2B313B]">
        Security
      </h4>

      <div className="flex flex-col gap-6 md:gap-8 mt-5">
        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="text-[#606C82] font-normal">
            <h4 className="font-semibold mb-2">Password</h4>
            <p className="text-xs ">
              Set a unique password for better protection
            </p>
          </div>

          <WhiteTransparentButton
            text={"Change Password"}
            loading={false}
            size="sm"
            className="w-[137px]"
            onClick={() => setOpenResetPasswordModal(true)}
          />
        </div>

        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="text-[#606C82] font-normal">
            <h4 className="font-semibold mb-2">
              2FA (Two-Factor Authentication)
            </h4>
            <p className="text-xs ">
              Status:{" "}
              <span
                className={`${
                  !user?.twoFactorAuthEnabled
                    ? "text-[#DC2625]"
                    : "text-[#17A34A]"
                }`}
              >
                {!user?.twoFactorAuthEnabled ? "Off" : "On"}
              </span>
            </p>
          </div>

          {!user?.twoFactorAuthEnabled ? (
            <WhiteTransparentButton
              text={"Enable"}
              loading={false}
              size="sm"
              className="w-[137px]"
              onClick={() =>
                setShow2FAModal({ disable: false, enable: true, reset: false })
              }
            />
          ) : (
            <div className="flex gap-1">
              <WhiteTransparentButton
                text={"Disable"}
                loading={false}
                size="sm"
                className="w-[100px]"
                onClick={() =>
                  setShow2FAModal({
                    disable: true,
                    enable: false,
                    reset: false,
                  })
                }
              />
              <WhiteTransparentButton
                text={"Reset"}
                loading={false}
                size="sm"
                className="w-[100px] hidden"
                onClick={() => {
                  setShow2FAModal({
                    disable: false,
                    enable: false,
                    reset: true,
                  });
                }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="text-[#606C82] font-normal">
            <h4 className="mb-2 font-semibold">Wallet Pin</h4>
            <p className="text-xs ">
              Status:{" "}
              <span
                className={`${
                  !user?.wallet?.pinSet ? "text-[#DC2625]" : "text-[#17A34A]"
                }`}
              >
                {!user?.wallet?.pinSet ? "Off" : "On"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end">
            <WhiteTransparentButton
              text={user?.wallet?.pinSet ? "Update Pin" : "Set Pin"}
              loading={false}
              className="px-7 w-[137px]"
              size="sm"
              onClick={() => setPinModal({ forgot: false, mode: true })}
            />
            {user?.wallet?.pinSet && (
              <div className="flex items-center text-xs font-normal text-[#606C82] ">
                <p>Forgot PIN?</p>
                <Button
                  className="text-sm px-1"
                  onClick={handleForgotPin}
                  variant={"link"}
                  size={"sm"}
                  aria-label="Forgot pin, click here"
                  disabled={forgotPinLoading}
                >
                  {forgotPinLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Click here"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {openResetPasswordModal && (
        <ResetPasswordModal close={() => setOpenResetPasswordModal(false)} />
      )}

      {show2FAModal.enable && (
        <TwoFactorAuthModal
          close={() =>
            setShow2FAModal({ disable: false, enable: false, reset: false })
          }
        />
      )}
      {show2FAModal.disable && (
        <TwoFactorAuthModal
          close={() =>
            setShow2FAModal({ disable: false, enable: false, reset: false })
          }
          enable={false}
        />
      )}
      {show2FAModal.reset && (
        <Reset2FAModal
          close={() =>
            setShow2FAModal({ disable: false, enable: false, reset: false })
          }
        />
      )}

      <ModalTemplate
        onClose={() => {
          setPinModal({ forgot: false, mode: false });
        }}
        isOpen={pinModal.mode}
        className="md:!max-w-md"
      >
        <div className="flex flex-col ">
          <h1 className="text-[#0A0E12] text-[22px]  font-semibold">
            Security Verification
          </h1>

          <PinForm
            close={() => {
              setPinModal({ forgot: false, mode: false });
            }}
            type={user?.wallet?.pinSet ? "change" : "create"}
          />
        </div>
      </ModalTemplate>
      {pinModal.forgot && (
        <ForgotPinModal
          open={pinModal.forgot}
          close={() => setPinModal({ forgot: false, mode: false })}
        />
      )}
    </div>
  );
};

export default Security;
