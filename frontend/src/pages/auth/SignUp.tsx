import { slideInLeft } from "@/components/animation";
import { PrimaryButton } from "@/components/buttons/Buttons";
import GoogleButton from "@/components/buttons/GoogleButton";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import { InputCheck } from "@/components/Inputs/CheckBox";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { SignupSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { SignUp as Signup } from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlRefCode = searchParams.get("ref");
  const storedRefCode = sessionStorage.getItem("p2p_referral_code");

  const [signupBody] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: urlRefCode || storedRefCode || "",
  });

  useEffect(() => {
    if (urlRefCode) {
      sessionStorage.setItem("p2p_referral_code", urlRefCode);
    }
  }, [urlRefCode]);

  const isReferralCodeAutoFilled = !!urlRefCode || !!storedRefCode;

  const formik = useFormik({
    initialValues: { ...signupBody, agreeToTerms: false },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const { agreeToTerms, ...payload } = values;
      const response = await Signup(payload);

      if (response?.statusCode === 200) {
        sessionStorage.removeItem("p2p_referral_code");
        // ReSendverificationCode();
        return navigate(APP_ROUTES.AUTH.VERIFY);
      } else {
        Toast.error(response.message, "Sign Up Failed");
      }
    },
  });

  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      animate="show"
      className="lg:w-[442px] mx-auto"
    >
      <OtherSide
        header="Create your account"
        subHeader="Exchange fiat and crypto fast, easy and securely."
        upperSubHeader={<></>}
      />
      <div className="w-full mt-10">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <PrimaryInput
              type="email"
              name="email"
              label="Email"
              className="w-full h-[48px] px-3 outline-hidden "
              error={formik.errors.email}
              touched={formik.touched.email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full">
            <AuthPasswordInput
              className="w-full h-[48px] px-3 outline-hidden"
              handleChange={formik.handleChange}
              name="password"
              error={formik.errors.password}
              touched={formik.touched.password}
              check={true}
              text="Password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              showTip={false}
            />
          </div>
          <div className="w-full">
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
              showTip={false}
            />
          </div>
          <div className="w-full">
            <PrimaryInput
              type="text"
              name="referralCode"
              label="Referral Code (Optional)"
              className="w-full h-[48px] px-3 outline-hidden "
              error={formik.errors.referralCode}
              touched={formik.touched.referralCode}
              value={formik.values.referralCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={isReferralCodeAutoFilled}
              disabled={isReferralCodeAutoFilled}
            />
          </div>
          <div>
            <div className="flex items-center mb-2">
              <InputCheck
                type="checkbox"
                name="agreeToTerms"
                checked={formik.values.agreeToTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-[12px] text-[#515B6E] leading-[16px] font-normal mt-1 ml-2">
                By creating an account you certify that you are over the age of
                18 and agree to the Privacy Policy.
              </p>
            </div>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
              <div
                style={{ color: "red" }}
                className="text-[12px] text-[#515B6E] leading-[16px] font-normal mb-3"
              >
                {formik.errors.agreeToTerms}
              </div>
            ) : null}
          </div>
          <div className="w-full mb-3">
            <PrimaryButton
              className={
                !formik.isValid || !formik.dirty
                  ? "bg-[lightGrey] w-full"
                  : "w-full"
              }
              text={"Create account"}
              type="submit"
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              loading={formik.isSubmitting}
            />
          </div>
        </form>
        <div className="w-full flex items-center my-6">
          <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
          <span className="text-[12px] text-[#707D96] leading-[16px] font-normal mx-2">
            or
          </span>
          <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
        </div>
        <GoogleButton text="Sign up with Google" />
        <p className="text-[14px] text-[#515B6E] leading-[24px] font-semibold text-center">
          Already have an account?
          <span
            className="text-[#C49600] pl-3 cursor-pointer"
            onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
          >
            Sign In
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;
