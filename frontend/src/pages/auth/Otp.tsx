import { BackArrow } from "@/assets/icons";
import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { APP_ROUTES } from "@/constants/app_route";
import { VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { VerifyForgotPassword } from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OTP = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("f_email");
  const [searchParams] = useSearchParams();

  const codeLink = searchParams.get("code");
  const emailLink = searchParams.get("email");

  const emailValue = email ?? emailLink ?? "";

  const formik = useFormik({
    initialValues: { code: codeLink ? codeLink : "" },
    validationSchema: VerificationSchema,
    validateOnMount: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const payload = {
        email: emailValue,
        code: codeLink ?? values.code,
      };
      const response = await VerifyForgotPassword(payload);

      if (response?.statusCode === 200) {
        navigate(APP_ROUTES.AUTH.RESET_PASSWORD);
      }
    },
  });
  useEffect(() => {
    if (codeLink && emailLink) {
      formik.submitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeLink, emailLink]);
  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Enter OTP"
        subHeader="Type in the code sent to your email to reset your password"
        upperSubHeader={
          <>
            {" "}
            <button
              className="text-[14px] text-muted-foreground leading-[24px] font-semibold text-left flex items-center mb-2 hover:bg-muted-foreground/10 px-2 py-1 rounded-md cursor-pointer"
              onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
            >
              {" "}
              <span className="mr-2">
                <BackArrow />
              </span>{" "}
              Back to Log in
            </button>
          </>
        }
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mt-10">
          <PrimaryInput
            type="code"
            name="code"
            label="Code"
            className="w-full   outline-hidden "
            error={formik.errors.code}
            touched={formik.touched.code}
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <div className="w-full mb-3 mt-4">
            <PrimaryButton
              className={"w-full"}
              text={"Enter code"}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting || !formik.isValid}
              type="submit"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#515B6E] leading-[24px] font-normal text-left">
              00:31
            </p>
            <a
              href="mailto:support@Bisats.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#C49600] text-[14px] leading-[24px] font-semibold cursor-pointer "
            >
              Contact Support
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OTP;
