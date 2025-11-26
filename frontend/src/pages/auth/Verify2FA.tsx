import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { VerificationSchema } from "@/formSchemas";
import { setRefreshToken, setToken, setUserId } from "@/helpers";
import OtherSide from "@/layouts/auth/OtherSide";
import { Login } from "@/redux/actions/userActions";
import { UserActionTypes } from "@/redux/types";
import dispatchWrapper from "@/utils/dispatchWrapper";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

const Verify2FA = () => {
  const state = useLocation().state;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      const payLoad = {
        ...values,
        email: state.email,
        password: state.password,
        ip: state.ip,
      };
      const response = await Login(payLoad);

      if (response.statusCode === 200) {
        const data = response.data;
        Toast.success(response.message, "Code Verified");
        dispatchWrapper({
          type: UserActionTypes.LOG_IN_SUCCESS,
          payload: response.data,
        });
        if (data) {
          data.userId && setUserId(data?.userId);
          data.token && setToken(data?.token);
          data.refreshToken && setRefreshToken(data?.refreshToken);
        }
        navigate(APP_ROUTES.DASHBOARD);
      } else {
        Toast.error(response.error.message, "Verification failed");
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
