import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
import { APP_ROUTES } from "@/constants/app_route";
import { levelThreeValidationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Toast from "@/components/Toast";
import { formatCompactNumber } from "@/utils";
import { bisats_limit } from "@/utils/transaction_limits";

const Level3Verification = () => {
  const user: UserState = useSelector((state: any) => state.user);
  const limit = bisats_limit["level_3"];

  const navigate = useNavigate();
  const [responsePending, setResponsePending] = useState(
    user.kyc?.proofOfProfileVerified
  );
  useEffect(() => {
    if (!user.kyc?.bvnVerified) navigate(APP_ROUTES.KYC.BVNVERIFICATION);
  }, [user.user]);

  const formik = useFormik({
    initialValues: {
      utilityBill: null,
      cacDocument: null,
      mermatDoc: null,
    },
    validationSchema: levelThreeValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      Toast.info("Pending", "s");
      // try {
      //   if (
      //     values.utilityBill &&
      //     values.sourceOfWealth &&
      //     values.proofOfProfile
      //   ) {
      //     setResponsePending(true);
      //   }
      // } finally {
      //   setSubmitting(false);
      // }
    },
  });

  const account_level_features = useMemo(() => {
    return [
      `Create sell ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Create buy ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Max daily limit for withdrawal is Unlimited xNGN and ${formatCompactNumber(
        limit.daily_withdrawal_limit_crypto
      )} USD in crypto assets`,
    ];
  }, [limit]);

  return (
    <div className="md:w-10/12 mx-auto">
      <div className="">
        <OtherSide
          header="Upgrade your account"
          subHeader={
            <p className="text-[#515B6E] text-[14px]">
              Upgrade to <span className="text-[#17A34A]"> Level 3 </span>to
              unlock more access to your Bisats account
            </p>
          }
        />

        <div>
          <div className="bg-[#F9F9FB] p-3 mt-5 border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
            {account_level_features.map((feat, idx) => (
              <p className="flex items-center" key={idx}>
                <p className="w-[4px] bg-[#C2C7D2] rounded-[50%]  mr-1.5 h-[4px]" />
                <span>{feat}</span>
              </p>
            ))}
          </div>

          {responsePending ? (
            <div className="flex flex-col justify-center items-center text-center gap-1 mb-6  mt-12">
              <div className="text-white size-10 rounded-full flex items-center justify-center bg-green-500 mb-6">
                <Check />
              </div>

              <h5 className="text-gray-700 font-semibold">
                Details submitted successfully
              </h5>
              <p className="text-sm text-[#515B6E]">
                Your application will be reviewed within the next 48 hours
              </p>

              <PrimaryButton
                className={"w-full !mt-8"}
                text={"Go to Dashboard"}
                onClick={() => navigate(APP_ROUTES.DASHBOARD)}
                loading={false}
              />
            </div>
          ) : (
            <div>
              <div className="mt-5 ">
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-col gap-3">
                    {/* SUB: Utility bill */}
                    <FileInputField
                      label="Upload a recent utility bill (Not later than 4months ago)"
                      name="utilityBill"
                      info=""
                      autoUpload={false}
                      valueMapper={(value) => value}
                      formik={formik}
                    />

                    {/* SUB: CAC */}
                    <FileInputField
                      label={"Certificate of corporation"}
                      name="cacDocument"
                      autoUpload={false}
                      valueMapper={(value) => value}
                      formik={formik}
                    />

                    {/* SUB: Mermat */}
                    <FileInputField
                      label={"Mermat (optional)"}
                      autoUpload={false}
                      name="proofOfProfile"
                      valueMapper={(value) => value}
                      formik={formik}
                      className="mt-2"
                    />
                  </div>

                  <div className="mt-5">
                    <PrimaryButton
                      className={"w-full"}
                      text={"Submit"}
                      loading={formik.isSubmitting}
                      disabled={
                        formik.isSubmitting || !formik.isValid || !formik.dirty
                      }
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level3Verification;
