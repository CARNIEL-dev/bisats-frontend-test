import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { VerifyTwoFactorAuth } from "@/redux/actions/userActions";
import { UserActionTypes } from "@/redux/types";
import dispatchWrapper from "@/utils/dispatchWrapper";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

const Verify2FA = () => {
  const user = useSelector((state: any) => state.user.user);
  const userId = user.userId;

  const formik = useFormik({
    initialValues: { code: "", userId },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const response = await VerifyTwoFactorAuth(payload);
      if (response?.status) {
        Toast.success(response.message, "Code Verified");
        dispatchWrapper({
          type: UserActionTypes.LOG_IN_UPDATE,
          payload: null,
        });
        window.location.href = APP_ROUTES.DASHBOARD;
      } else {
        Toast.error(response.message, "Verification failed");
      }
    },
  });

  return (
    <div className="lg:w-[442px] mx-auto">
      <OtherSide
        header="Authentication Code"
        subHeader="Enter the code from your authenticator app to login to your account."
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
              text={"Enter code"}
              type="submit"
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting || !formik.isValid}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Verify2FA;
