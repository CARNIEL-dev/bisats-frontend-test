import MaxWidth from "@/components/shared/MaxWith";
import SucessDisplay from "@/components/shared/SucessDisplay";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { APP_ROUTES } from "@/constants/app_route";
import { BVNSchema, VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  GetUserDetails,
  PostBVN_KYC,
  Resend_OTP_PhoneNumber_KYC,
  Verify_BVN_KYC,
} from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";
import ResendCodeButton from "@/components/shared/ResendCodeButton";
const BVNVerification = () => {
  const user: UserState = useSelector((state: any) => state.user);

  const [verficationScreen, setVerificationScreen] = useState(
    user.kyc?.bvnVerified
  );
  const [isSuccess, setIsSuccess] = useState(user.kyc?.bvnVerified);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !user.kyc?.identificationVerified ||
      !user.kyc.personalInformationVerified
    )
      navigate(
        !user?.kyc?.personalInformationVerified
          ? APP_ROUTES.KYC.PERSONAL
          : APP_ROUTES.KYC.IDENTITY
      );
  }, [user.user]);

  const formik1 = useFormik({
    initialValues: { bvn: "" },
    validationSchema: BVNSchema,
    onSubmit: async (values) => {
      const payload = {
        userId: user.user?.userId ?? "",
        bvn: values.bvn ?? "",
      };
      const response = await PostBVN_KYC(payload);

      if (response?.status) {
        Toast.success(response.message, "Verification code sent");
        setVerificationScreen(true);
      } else {
        Toast.error(response.message, "Verification failed");
      }
    },
  });

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      const payload = {
        userId: user.user?.userId ?? "",
        code: values.code ?? "",
      };
      const response = await Verify_BVN_KYC(payload);

      if (response?.status) {
        setIsSuccess(true);
        navigate(APP_ROUTES?.DASHBOARD);
        GetUserDetails();
      } else {
        Toast.error(response.message, "Failed");
      }
    },
  });

  const resendOTP = async () => {
    const response = await Resend_OTP_PhoneNumber_KYC(user?.user?.userId);

    if (response?.ok) {
      Toast.success(response.message, "OTP Sent");
      // navigate(APP_ROUTES.WALLET.HOME)
      return true;
    } else {
      Toast.error(response.message, "");
      return false;
    }
  };

  return (
    <MaxWidth className="space-y-8 mt-10 min-h-[75dvh] 2xl:max-w-4xl max-w-[23rem] lg:max-w-2xl  lg:pb-5 mb-10">
      <div>
        <OtherSide
          header="Upgrade your account"
          subHeader={
            <p className="text-[#515B6E] text-[14px]">
              Upgrade to <span className="text-[#17A34A]"> Level 2 </span>to
              unlock more access to your Bisats account
            </p>
          }
        />

        {verficationScreen ? (
          isSuccess ? (
            <div className=" mb-4 mt-10">
              <SucessDisplay
                heading="BVN submitted successfully"
                subheading="Your details are currently being reviewed"
                onClick={() => navigate(APP_ROUTES.KYC.LEVEL3VERIFICATION)}
              />
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <p className=" mt-5  text-[14px] text-[#515B6E] w-full h-fit flex flex-col  ">
                A verification code has been sent to the phone number linked to
                your BVN
              </p>

              <div className="w-full mt-10">
                <div className="w-full mb-1relative">
                  <PrimaryInput
                    css="w-full p-2.5 "
                    type="code"
                    name="code"
                    label="Verification code"
                    placeholder="Enter code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    error={undefined}
                    touched={undefined}
                  />
                </div>
                <ResendCodeButton
                  onClick={resendOTP}
                  text="Resend code"
                  defaultTime={30 * 1000} // 30 seconds
                />
                <div className="w-full mt-6 mb-3">
                  <PrimaryButton
                    css={"w-full"}
                    text={"Submit"}
                    loading={formik.isSubmitting}
                    type="submit"
                    onSubmit={() => formik.handleSubmit()}
                    disabled={
                      formik.isSubmitting || !formik.isValid || !formik.dirty
                    }
                  />
                </div>
                {/* <p className="text-[14px] text-[#515B6E] leading-[24px] font-semibold text-left">Need help?<span className="text-[#C49600] pl-2 cursor-pointer">Contact Support</span></p> */}
              </div>
            </form>
          )
        ) : (
          <div>
            <form onSubmit={formik1.handleSubmit}>
              <div className="bg-[#F9F9FB] p-2 mt-5 border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
                <p>
                  <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                  <span>Create sell ads (max 23M NGN in crypto assets)</span>
                </p>
                <p>
                  <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                  <span>Create buy ads (max 23M NGN in crypto assets)</span>
                </p>
                <p>
                  <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                  <span>
                    Max daily limit for withdrawal is 500m NGN and 1m USD in
                    crypto assets
                  </span>
                </p>
              </div>
              <div className="w-full mt-10">
                <PrimaryInput
                  type="bvn"
                  name="bvn"
                  label="Your BVN"
                  css="w-full h-[48px] px-3 outline-hidden "
                  error={formik1.errors.bvn}
                  touched={formik1.touched.bvn}
                  value={formik1.values.bvn}
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                />

                <div className="w-full my-3">
                  <PrimaryButton
                    css={"w-full"}
                    text={"Submit"}
                    loading={formik1.isSubmitting}
                    disabled={
                      formik1.isSubmitting || !formik1.isValid || !formik1.dirty
                    }
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#F5FEF8] p-2 border border-[#DCFCE7] rounded-[8px] text-[12px] text-[#17A34A] w-full h-fit flex items-start   ">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="w-[5%]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9386 7.41288C13.9386 10.6729 11.5719 13.7262 8.3386 14.6195C8.1186 14.6795 7.87859 14.6795 7.65859 14.6195C4.42526 13.7262 2.05859 10.6729 2.05859 7.41288V4.4862C2.05859 3.93953 2.47194 3.31954 2.98527 3.11287L6.69859 1.59289C7.53192 1.25289 8.47192 1.25289 9.30526 1.59289L13.0186 3.11287C13.5253 3.31954 13.9453 3.93953 13.9453 4.4862L13.9386 7.41288Z"
              stroke="#22C55D"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.0013 8.33268C8.73768 8.33268 9.33464 7.73573 9.33464 6.99935C9.33464 6.26297 8.73768 5.66602 8.0013 5.66602C7.26492 5.66602 6.66797 6.26297 6.66797 6.99935C6.66797 7.73573 7.26492 8.33268 8.0013 8.33268Z"
              stroke="#22C55D"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 8.33203V10.332"
              stroke="#22C55D"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <p className="w-[95%]">
            We take your security seriously. All the information you provide is
            encrypted and protected using industry-leading security standards.
            Your details remain strictly confidential.
          </p>
        </div>
      </div>
    </MaxWidth>
  );
};

export default BVNVerification;
