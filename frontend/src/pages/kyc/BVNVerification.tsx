import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import MaxWidth from "@/components/shared/MaxWith";
import SucessDisplay from "@/components/shared/SucessDisplay";
import { APP_ROUTES } from "@/constants/app_route";
import { BVNSchema, VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  GetUserDetails,
  PostBVN_KYC,
  Resend_OTP_PhoneNumber_KYC,
  Verify_BVN_KYC,
} from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ResendCodeButton from "@/components/shared/ResendCodeButton";
import { formatCompactNumber } from "@/utils";
import { bisats_limit } from "@/utils/transaction_limits";
import SecurityBanner from "@/components/shared/SecurityBanner";
const BVNVerification = () => {
  const user: UserState = useSelector((state: any) => state.user);

  const userLevel =
    user?.user?.accountLevel === "level_1" || !user?.user?.accountLevel
      ? "level_2"
      : "level_3";

  const limit = bisats_limit[userLevel as keyof typeof bisats_limit];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await GetUserDetails({
          userId: user?.user?.userId!,
          token: user?.user?.token!,
        }).then(() => {
          // navigate(APP_ROUTES?.DASHBOARD);
          setVerificationScreen(true);
        });
      } else {
        Toast.error(response.message, "Failed");
      }
    },
  });

  const resendOTP = async () => {
    const response = await Resend_OTP_PhoneNumber_KYC(user?.user?.userId);

    if (response?.staus) {
      Toast.success(response.message, "OTP Sent");
      // navigate(APP_ROUTES.WALLET.HOME)
      return true;
    } else {
      Toast.error(response.message, "");
      return false;
    }
  };

  const account_level_features = useMemo(() => {
    return [
      `Create sell ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Create buy ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Max daily limit for withdrawal is ${
        user?.user?.accountLevel === "level_3"
          ? "Unlimited"
          : formatCompactNumber(limit.daily_withdrawal_limit_fiat)
      } xNGN and ${formatCompactNumber(
        limit.daily_withdrawal_limit_crypto
      )} USD in crypto assets`,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

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
                heading="BVN Submitted Successfully"
                subheading="Your details are currently being reviewed, you can apply to be a merchant after the review is complete"
                onClick={() => navigate(APP_ROUTES.KYC.LEVEL3VERIFICATION)}
                user={user?.user!}
              />
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <p className=" mt-5  text-[14px] text-[#515B6E] w-full h-fit flex flex-col  ">
                A verification code has been sent to your email
              </p>

              <div className="w-full mt-10">
                <div className="w-full mb-1relative">
                  <PrimaryInput
                    className="w-full p-2.5 "
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
                  defaultTime={30} // in seconds
                />
                <div className="w-full mt-6 mb-3">
                  <PrimaryButton
                    className={"w-full"}
                    text={"Submit"}
                    loading={formik.isSubmitting}
                    type="submit"
                    onSubmit={() => formik.handleSubmit()}
                    disabled={
                      formik.isSubmitting || !formik.isValid || !formik.dirty
                    }
                  />
                </div>
              </div>
            </form>
          )
        ) : (
          <div>
            <form onSubmit={formik1.handleSubmit}>
              <div className="bg-[#F9F9FB] p-2 mt-5 border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
                {account_level_features.map((feat, idx) => (
                  <p className="flex items-center" key={idx}>
                    <p className="w-[4px] bg-[#C2C7D2] rounded-[50%]  mr-1.5 h-[4px]"></p>
                    <span>{feat}</span>
                  </p>
                ))}
              </div>
              <div className="w-full mt-10">
                <PrimaryInput
                  type="bvn"
                  name="bvn"
                  label="Your BVN"
                  className="w-full h-[48px] px-3 outline-hidden "
                  error={formik1.errors.bvn}
                  touched={formik1.touched.bvn}
                  value={formik1.values.bvn}
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                />

                <div className="w-full my-3">
                  <PrimaryButton
                    className={"w-full"}
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

        <SecurityBanner />
      </div>
    </MaxWidth>
  );
};

export default BVNVerification;
