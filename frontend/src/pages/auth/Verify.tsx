import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ResendCodeButton from "@/components/shared/ResendCodeButton";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  ReSendverificationCode,
  VerifyUser,
} from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const user = useSelector((state: any) => state.user.user);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const codeLink = searchParams.get("code");
  const userId = searchParams.get("email");

  const formik = useFormik({
    initialValues: { code: codeLink ? codeLink : "" },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      const payload =
        codeLink && userId
          ? {
              userId: userId,
              code: codeLink,
            }
          : {
              userId: user.userId,
              code: values.code,
            };
      const response = await VerifyUser(payload);
      if (response?.statusCode === 200) {
        Toast.success(response.message, "Email verified");

        navigate(APP_ROUTES.AUTH.LOGIN);
      } else {
        Toast.error(response.message, "Verification failed");
      }
    },
  });

  useEffect(() => {
    if (codeLink && userId) {
      formik.submitForm();
    }
  }, []);

  const resendCodeHandler = async () => {
    const res = await ReSendverificationCode();

    if (res.status) {
      Toast.success(res.message, "Success");
      return true;
    }

    Toast.error(res.message, "Error");
    return false;
  };

  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Verify your account"
        subHeader="A verification code has been sent to your registered email. Enter the code below to verify your account."
        upperSubHeader={<></>}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mt-10">
          <div className="w-full mb-4">
            <PrimaryInput
              type="code"
              name="code"
              label="Code"
              className="w-full h-[48px] px-3 outline-hidden "
              error={formik.errors.code}
              touched={formik.touched.code}
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full mb-3">
            <PrimaryButton
              className={"w-full"}
              text={"Verify account"}
              type="submit"
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting || !formik.isValid}
            />
          </div>
          <ResendCodeButton
            onClick={resendCodeHandler}
            text="Resend a new code"
            defaultTime={30}
          />
        </div>
      </form>
    </div>
  );
};

export default VerifyEmail;
