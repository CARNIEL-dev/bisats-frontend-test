import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import { APP_ROUTES } from "@/constants/app_route";
import { ChangePasswordSchema } from "@/formSchemas";
import { logoutUser, UpdatePassword } from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons";
import Toast from "@/components/Toast";
import ModalTemplate from "@/components/Modals/ModalTemplate";

interface Props {
  close: () => void;
}
const ResetPasswordModal: React.FC<Props> = ({ close }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const navigate = useNavigate();
  const [passwordBody] = useState({});

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: ChangePasswordSchema,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const payload = { ...values, userId: user?.userId };
      const response = await UpdatePassword(payload);
      if (response?.statusCode === 200) {
        logoutUser();
        navigate(APP_ROUTES.AUTH.LOGIN);
        Toast.error(response.message, "Error");
      } else {
        Toast.error(response.message, "Error");
      }
    },
  });
  return (
    <ModalTemplate onClose={close}>
      <div className="mt-2">
        <h1 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Reset Password
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <AuthPasswordInput
              css="w-full h-[44px] px-3 outline-hidden"
              handleChange={formik.handleChange}
              name="oldPassword"
              error={formik.errors.oldPassword}
              touched={formik.touched.oldPassword}
              check={false}
              text="Old Password"
              value={formik.values.oldPassword}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="w-full ">
            <AuthPasswordInput
              css="w-full h-[44px] px-3 outline-hidden"
              handleChange={formik.handleChange}
              name="newPassword"
              error={formik.errors.newPassword}
              touched={formik.touched.newPassword}
              check={true}
              text="New Password"
              value={formik.values.newPassword}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="w-full ">
            <AuthPasswordInput
              css="w-full h-[44px] px-3 outline-hidden"
              check={false}
              text="Repeat password"
              name="confirmPassword"
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              value={formik.values.confirmPassword}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="flex items-center w-full mt-5">
            <WhiteTransparentButton
              text={"Cancel"}
              loading={false}
              onClick={close}
              css="w-[]"
              style={{ width: "50%" }}
            />
            <PrimaryButton
              text={"Proceed"}
              disabled={formik.isSubmitting || !formik.isValid}
              loading={formik.isSubmitting}
              css="w-1/2 ml-3"
            />
          </div>
        </form>
      </div>
    </ModalTemplate>
  );
};

export default ResetPasswordModal;
