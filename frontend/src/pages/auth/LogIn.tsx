import { useState } from "react";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { PrimaryButton } from "@/components/buttons/Buttons";
import OtherSide from "@/layouts/auth/OtherSide";
import { Login, ReSendverificationCode } from "../../redux/actions/userActions";
import GoogleButton from "@/components/buttons/GoogleButton";
import Toast from "@/components/Toast";
import { useFormik } from "formik";
import { LogInSchema } from "../../formSchemas";
import { APP_ROUTES } from "@/constants/app_route";
import { useNavigate } from "react-router-dom";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";

const LogIn = () => {
  const [logInBody] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { ...logInBody },
    validationSchema: LogInSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      const { ...payload } = values;
      const response = await Login(payload);
      if (response.statusCode === 200) {
        if (!response.data.emailVerified) {
          ReSendverificationCode({ userId: response.data.userId });
          return navigate(APP_ROUTES.AUTH.VERIFY);
        }
        navigate(APP_ROUTES.DASHBOARD);
        Toast.success("", response.message);
      } else {
        Toast.error(response.message, "Login Failed");
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Welcome to Bisats"
        subHeader="Exchange fiat and crypto fast, easy and securely."
        upperSubHeader={<></>}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mt-10">
          <PrimaryInput
            type="email"
            name="email"
            label="Email"
            css="w-full h-[48px] px-3 outline-hidden "
            error={formik.errors.email}
            touched={formik.touched.email}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <AuthPasswordInput
            css="w-full h-[48px] px-3 outline-hidden"
            handleChange={formik.handleChange}
            name="password"
            error={formik.errors.password}
            touched={formik.touched.password}
            check={false}
            text="Password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
          />

          <div className="w-full mt-4">
            <PrimaryButton
              css={"w-full"}
              text={"Log In"}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
          {/* </form> */}
          <p
            className="text-[14px] text-[#C49600] leading-[24px] font-normal mt-1 cursor-pointer"
            onClick={() => navigate(APP_ROUTES.AUTH.FORGOT_PASSWORD)}
          >
            Forgot password?
          </p>

          <div className="w-full flex items-center my-6">
            <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
            <span className="text-[12px] text-[#707D96] leading-[16px] font-normal mx-2">
              Or
            </span>
            <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
          </div>
          <GoogleButton text="Sign in with Google" />
          <p className="text-[14px] text-[#515B6E] leading-[24px] font-semibold text-center">
            Don’t have an account?
            <span
              className="text-[#C49600] pl-3 cursor-pointer"
              onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
