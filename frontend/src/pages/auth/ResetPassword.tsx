import { PrimaryButton } from "@/components/buttons/Buttons";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { ResetPasswordSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { ResetPassword as RP } from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("f_email");
  const [passwordBody] = useState({
    email: email ?? "",
    newPassword: "",
    confirmPassword: "",
  });

  const formik = useFormik({
    initialValues: { ...passwordBody },
    validationSchema: ResetPasswordSchema,
    validateOnMount: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const response = await RP(payload);
      if (response?.statusCode === 200) {
        Toast.success(response.message, "Success");
        navigate(APP_ROUTES.AUTH.LOGIN);
      }
    },
  });
  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Set a new password"
        subHeader="Your new password should be strong and easy to remember."
        upperSubHeader={<></>}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mb-4">
          <div className="w-full mb-2">
            <AuthPasswordInput
              className="w-full h-[48px] px-3 outline-hidden"
              handleChange={formik.handleChange}
              name="newPassword"
              error={formik.errors.newPassword}
              touched={formik.touched.newPassword}
              check={true}
              text="Password"
              value={formik.values.newPassword}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className="w-full mb-4">
          <AuthPasswordInput
            className="w-full h-[48px] px-3 outline-hidden "
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
        <div className="w-full mb-3">
          <PrimaryButton
            className={""}
            text={"Save password"}
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting || !formik.isValid}
            type="submit"
          />
        </div>
        <div className="text-[14px] text-[#515B6E] font-semibold text-center flex items-center gap-2">
          Don’t have an account?
          <button
            className="text-[#C49600]  cursor-pointer"
            onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
