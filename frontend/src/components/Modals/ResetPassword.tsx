import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { ChangePasswordSchema } from "@/formSchemas";
import { rehydrateUser, UpdatePassword } from "@/redux/actions/userActions";

import { useFormik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import BackButton from "@/components/shared/BackButton";

interface Props {
  close: () => void;
  open?: boolean;
}
const ResetPasswordModal: React.FC<Props> = ({ close, open }) => {
  const [show2faScreen, setShow2faScreen] = useState(false);
  const [code, setCode] = useState("");

  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const is2faEnabled = user?.twoFactorAuthEnabled;

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: ChangePasswordSchema,
    validateOnMount: false,

    onSubmit: async (values) => {
      if (is2faEnabled && !show2faScreen) {
        setShow2faScreen(true);
        return;
      }

      if (is2faEnabled && show2faScreen && code.length < 6) {
        Toast.error("Please enter a valid code", "2FA Verification failed");
        return;
      }
      const response = await UpdatePassword({ ...values, code });
      if (response?.statusCode === 200 || response?.success) {
        close();
        rehydrateUser({
          userId: user?.userId,
          token: user?.token,
        });
        // logoutUser();
        // navigate(APP_ROUTES.AUTH.LOGIN);
        Toast.success(response.message, "Success");
      } else {
        Toast.error(response.error?.message, "Error");
      }
    },
  });
  return (
    <ModalTemplate onClose={close} isOpen={open} className="md:!max-w-md">
      <div className="mt-2">
        <h1 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Reset Password
        </h1>
        <form onSubmit={formik.handleSubmit}>
          {show2faScreen ? (
            <div>
              {is2faEnabled ? (
                <div className="space-y-4 my-4">
                  <BackButton onClick={() => setShow2faScreen(false)} />
                  <div>
                    <PrimaryInput
                      label="Enter 2FA code"
                      type="code"
                      otpLength={6}
                      error={undefined}
                      touched={undefined}
                      name={"code"}
                      value={code}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        setCode(value);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="my-4">
                  <p className="font-semibold text-gray-600">
                    You have not enabled 2FA
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please enable 2FA to reset your password
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full ">
              <AuthPasswordInput
                className="w-full h-[44px] px-3 outline-hidden"
                handleChange={formik.handleChange}
                name="oldPassword"
                error={formik.errors.oldPassword}
                touched={formik.touched.oldPassword}
                check={false}
                text="Old Password"
                value={formik.values.oldPassword}
                // onBlur={formik.handleBlur}
              />

              <AuthPasswordInput
                className="w-full h-[44px] px-3 outline-hidden"
                handleChange={formik.handleChange}
                name="newPassword"
                error={formik.errors.newPassword}
                touched={formik.touched.newPassword}
                check={true}
                text="New Password"
                value={formik.values.newPassword}
                // onBlur={formik.handleBlur}
              />

              <AuthPasswordInput
                className="w-full h-[44px] px-3 outline-hidden"
                check={false}
                text="Repeat password"
                name="confirmPassword"
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                value={formik.values.confirmPassword}
                handleChange={formik.handleChange}
                // onBlur={formik.handleBlur}
              />
            </div>
          )}
          <div className="flex items-center w-full mt-5">
            <WhiteTransparentButton
              text={"Cancel"}
              loading={false}
              onClick={close}
              type="button"
              className="w-[]"
              style={{
                width: show2faScreen && !is2faEnabled ? "100%" : "50%",
              }}
            />
            {(!show2faScreen || is2faEnabled) && (
              <PrimaryButton
                text={"Proceed"}
                disabled={
                  formik.isSubmitting || !formik.isValid || !formik.dirty
                }
                loading={formik.isSubmitting}
                className="w-1/2 ml-3"
              />
            )}
          </div>
        </form>
      </div>
    </ModalTemplate>
  );
};

export default ResetPasswordModal;
