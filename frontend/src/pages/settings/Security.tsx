import { useState } from "react";
import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import ResetPasswordModal from "@/components/Modals/ResetPassword";
import SetPinModal from "@/components/Modals/SetPinModal";
import { UserState } from "@/redux/reducers/userSlice";
import { useSelector } from "react-redux";
import TwoFactorAuthModal from "@/components/Modals/2FAModal";

const Security = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [twoFAModal, setTwoFaModal] = useState(false);

  return (
    <div>
      <h1 className="text-[22px] lg:text-[22px] leading-[32px] font-semibold text-[#2B313B]">
        Security
      </h1>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-[#606C82] font-normal">
            <h1 className="text-[16px] lg:text-[16px] leading-[28px]   mb-2">
              Password
            </h1>
            <p className="text-[12px] lg:text-[12px] leading-[16px]  ">
              Set a unique password for better protection
            </p>
          </div>

          <WhiteTransparentButton
            text={"Change Password"}
            loading={false}
            size="sm"
            css="w-[137px]"
            onClick={() => setOpenResetPasswordModal(true)}
          />
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="text-[#606C82] font-normal">
            <h1 className="text-[16px] lg:text-[16px] leading-[28px]   mb-2">
              2FA (Two-Factor Authentication)
            </h1>
            <p className="text-[12px] lg:text-[12px] leading-[16px]  ">
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

          {!user?.twoFactorAuthEnabled && (
            <WhiteTransparentButton
              text={"Enable"}
              loading={false}
              size="sm"
              css="w-[137px]"
              onClick={() => setTwoFaModal(true)}
            />
          )}
        </div>
        <div className="flex justify-between my-3">
          <div className="text-[#606C82] font-normal">
            <h1 className="text-[16px] lg:text-[16px] leading-[28px] font-normal text-[#606C82]">
              Wallet Pin
            </h1>
            <p className="text-[12px] lg:text-[12px] leading-[16px]  ">
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

          {
            <WhiteTransparentButton
              text={user?.wallet?.pinSet ? "Update Pin" : "Set Pin"}
              loading={false}
              css="px-7 w-[137px]"
              size="sm"
              onClick={() => setPinModal(true)}
            />
          }
        </div>
      </div>

      {openResetPasswordModal && (
        <ResetPasswordModal close={() => setOpenResetPasswordModal(false)} />
      )}
      {pinModal && (
        <SetPinModal
          close={() => setPinModal(false)}
          type={user?.wallet?.pinSet ? "change" : "create"}
        />
      )}
      {twoFAModal && <TwoFactorAuthModal close={() => setTwoFaModal(false)} />}
    </div>
  );
};

export default Security;
