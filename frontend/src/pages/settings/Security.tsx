import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import TwoFactorAuthModal from "@/components/Modals/2FAModal";
import ForgotPinModal from "@/components/Modals/ForgotPinModal";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Reset2FAModal from "@/components/Modals/Reset2FAModal";
import ResetPasswordModal from "@/components/Modals/ResetPassword";
import PinForm from "@/components/shared/PinForm";
import TextBox from "@/components/shared/TextBox";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { FORGOT_PIN } from "@/redux/actions/userActions";
import { cn } from "@/utils";
import { Key, Loader2, Lock, ShieldCheck } from "lucide-react";

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
      <h4 className="text-[22px] lg:text-[22px] leading-[32px] font-semibold">
        Security
      </h4>

      <div className="flex flex-col gap-6 md:gap-8 mt-6 border border-border rounded-xl p-6 bg-neutral-50 dark:bg-secondary/20">
        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-md text-muted-foreground">
              <Lock className="size-6" />
            </div>

            <TextBox
              label={"Password"}
              value={
                <p
                  className={cn(
                    "flex items-center gap-2 font-medium text-xs text-muted-foreground",
                  )}
                >
                  Set a unique password for better protection
                </p>
              }
              labelClass=" text-base text-foreground font-semibold"
              direction="column"
              containerClassName="gap-0.5"
              showIndicator={false}
            />
          </div>

          <div className="flex flex-col items-end">
            <WhiteTransparentButton
              text={"Change Password"}
              loading={false}
              size="sm"
              className="w-[137px]"
              onClick={() => setOpenResetPasswordModal(true)}
            />
          </div>
        </div>

        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-md text-muted-foreground">
              <ShieldCheck className="size-6" />
            </div>

            <TextBox
              label={"2FA (Two-Factor Authentication)"}
              value={
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  <span
                    className={`px-3 py-0.5 rounded-md ${
                      !user?.twoFactorAuthEnabled
                        ? "text-red-500 bg-destructive/40"
                        : "text-[#17A34A] bg-[#17A34A]/40"
                    }`}
                  >
                    {!user?.twoFactorAuthEnabled ? "Off" : "On"}
                  </span>
                </p>
              }
              labelClass=" text-base text-foreground font-semibold"
              direction="column"
              containerClassName="gap-0.5"
              showIndicator={false}
            />
          </div>

          <div className="flex flex-col items-end">
            {!user?.twoFactorAuthEnabled ? (
              <WhiteTransparentButton
                text={"Enable"}
                loading={false}
                size="sm"
                className="w-[137px]"
                onClick={() =>
                  setShow2FAModal({
                    disable: false,
                    enable: true,
                    reset: false,
                  })
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
        </div>
        <div className="flex justify-between md:flex-row flex-col  md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-md text-muted-foreground">
              <Key className="size-6" />
            </div>

            <TextBox
              label={"Wallet Pin"}
              value={
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  <span
                    className={`px-3 py-0.5 rounded-md ${
                      !user?.wallet?.pinSet
                        ? "text-red-500 bg-destructive/40"
                        : "text-[#17A34A] bg-[#17A34A]/40"
                    }`}
                  >
                    {!user?.wallet?.pinSet ? "Off" : "On"}
                  </span>
                </p>
              }
              labelClass=" text-base text-foreground font-semibold"
              direction="column"
              containerClassName="gap-0.5"
              showIndicator={false}
            />
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
              <div className="flex items-center text-xs font-normal text-muted-foreground ">
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
          <h1 className=" text-[22px]  font-semibold">Security Verification</h1>

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
