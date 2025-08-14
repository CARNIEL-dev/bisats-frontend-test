import { slideInLeft } from "@/components/animation";
import { PrimaryButton } from "@/components/buttons/Buttons";
import GoogleButton from "@/components/buttons/GoogleButton";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { LogInSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { Login, ReSendverificationCode } from "@/redux/actions/userActions";
import { UserActionTypes } from "@/redux/types";
import dispatchWrapper from "@/utils/dispatchWrapper";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "development";

const LogIn = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LogInSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const response = await Login(payload);
      if (response.statusCode === 200) {
        const data = response.data;

        if (!data.emailVerified) {
          dispatchWrapper({
            type: UserActionTypes.LOG_IN_PENDING,
            payload: data,
          });
          await ReSendverificationCode({ userId: response.data.userId });
          navigate(APP_ROUTES.AUTH.VERIFY);
          return;
        }

        if (data.twoFactorAuthEnabled && !isDevelopment) {
          dispatchWrapper({
            type: UserActionTypes.LOG_IN_PENDING,
            payload: data,
          });
          navigate(APP_ROUTES.AUTH.VERIFY_2FA);
          return;
        }

        Toast.success("", response.message);
        dispatchWrapper({
          type: UserActionTypes.LOG_IN_SUCCESS,
          payload: data,
        });

        navigate(APP_ROUTES.DASHBOARD);
        // window.location.href = APP_ROUTES.DASHBOARD;
      } else {
        Toast.error(response.message, "Login Failed");
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
        header="Welcome to Bisats"
        subHeader="Exchange fiat and crypto fast, easy and securely."
        upperSubHeader={<></>}
      />
      <div>
        <form className="w-full mt-10" onSubmit={formik.handleSubmit}>
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

          <AuthPasswordInput
            className="w-full h-[48px] px-3 outline-hidden"
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
              className={"w-full"}
              text={"Log In"}
              type="submit"
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
        <button
          type="button"
          className="text-[14px] text-[#C49600] leading-[24px] font-normal mt-1 cursor-pointer w-fit hover:bg-primary/10 px-2"
          onClick={() => navigate(APP_ROUTES.AUTH.FORGOT_PASSWORD)}
        >
          Forgot password?
        </button>

        <div className="w-full flex items-center my-6">
          <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
          <span className="text-[12px] text-[#707D96] leading-[16px] font-normal mx-2">
            Or
          </span>
          <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
        </div>
        <GoogleButton text="Sign in with Google" />
        <div className="text-sm text-[#515B6E] flex gap-2 items-center  font-semibold text-center">
          <p>Don’t have an account?</p>
          <button
            className="text-[#C49600]  cursor-pointer"
            onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LogIn;
