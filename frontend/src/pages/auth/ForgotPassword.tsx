import PrimaryInput from "../../components/Inputs/PrimaryInput";
import { PrimaryButton } from "../../components/buttons/Buttons";
import { BackArrow } from "../../assets/icons";
import OtherSide from "../../layouts/auth/OtherSide";
import { useFormik } from "formik";
import { useState } from "react";
import { EmailSchema } from "../../formSchemas";
import { ForgotPassword as FP } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/app_route";
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: EmailSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      // if (formik.touched.agreeToTerms && formik.errors.agreeToTerms) {
      //     Toast.warning(formik.errors.agreeToTerms, "Terms & Conditions")
      // }
      localStorage.setItem("f_email", values.email);
      const { ...payload } = values;
      const response = await FP(payload);
      if (response?.statusCode === 200) {
        navigate(APP_ROUTES.AUTH.OTP);
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Forgot password?"
        subHeader="Enter your registered email address or phone number, and we’ll send you a link to reset your password."
        upperSubHeader={
          <>
            {" "}
            <p
              className="text-[14px] text-[#707D96] leading-[24px] font-semibold text-left flex items-center cursor-pointer mb-2"
              onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
            >
              {" "}
              <span className="mr-2">
                <BackArrow />
              </span>{" "}
              Back to Log in
            </p>
          </>
        }
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mt-10">
          <div className="w-full mb-4">
            <PrimaryInput
              type="email"
              name="email"
              label="email"
              className="w-full h-[48px] px-3 outline-hidden "
              error={formik.errors.email}
              touched={formik.touched.email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full mb-3">
            <PrimaryButton
              className={""}
              text={"Send OTP"}
              loading={isLoading}
              type="submit"
            />
          </div>
          <p className="text-[14px] text-[#515B6E] leading-[24px] font-semibold text-left">
            Need help?
            <span className="text-[#C49600] pl-2 cursor-pointer">
              Contact Support
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
