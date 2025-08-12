import FileInputField from "@/components/Inputs/FileInputFIeld";
import { levelThreeValidationSchema } from "@/formSchemas";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { APP_ROUTES } from "@/constants/app_route";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  Post_Proof_of_Profile_KYC,
  Post_Proof_of_Wealth_KYC,
  PostPOA_KYC,
} from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";

const Level3Verification = () => {
  const user: UserState = useSelector((state: any) => state.user);

  const navigate = useNavigate();
  const [responsePending, setResponsePending] = useState(
    user.kyc?.proofOfProfileVerified
  );
  useEffect(() => {
    if (!user.kyc?.bvnVerified) navigate(APP_ROUTES.KYC.BVNVERIFICATION);
  }, [user.user]);

  const formik = useFormik({
    initialValues: {
      utilityBill: user.kyc?.utilityBillVerified || null,
      sourceOfWealth: user.kyc?.sourceOfWealthVerified || null,
      proofOfProfile: user.kyc?.proofOfProfileVerified || null,
    },
    validationSchema: levelThreeValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (
          values.utilityBill &&
          values.sourceOfWealth &&
          values.proofOfProfile
        ) {
          setResponsePending(true);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const allFilesSelected =
    !!formik.values.utilityBill &&
    !!formik.values.sourceOfWealth &&
    !!formik.values.proofOfProfile;

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
          <Level3Info />
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
                      uploadFile={(file) =>
                        PostPOA_KYC({
                          userId: user?.user?.userId,
                          file,
                        })
                      }
                      placeholder={
                        user?.kyc?.utilityBillVerified ? "Verified" : undefined
                      }
                      disabled={user?.kyc?.utilityBillVerified}
                      valueMapper={(value) => value}
                      formik={formik}
                    />

                    {/* SUB: Source of wealth */}
                    <FileInputField
                      label={"Source of wealth"}
                      name="sourceOfWealth"
                      uploadFile={(file) =>
                        Post_Proof_of_Wealth_KYC({
                          userId: user?.user?.userId,
                          file,
                        })
                      }
                      valueMapper={(value) => value}
                      info={
                        "Personal bank statement or trades from other platforms"
                      }
                      disabled={user?.kyc?.sourceOfWealthVerified}
                      formik={formik}
                      placeholder={
                        user?.kyc?.sourceOfWealthVerified
                          ? "Verified"
                          : undefined
                      }
                    />

                    {/* SUB: Proof of profile */}
                    <FileInputField
                      label={"Proof of profile from other platforms (optional)"}
                      info={"Profile screenshot"}
                      disabled={user?.kyc?.proofOfProfileVerified}
                      uploadFile={(file) =>
                        Post_Proof_of_Profile_KYC({
                          userId: user?.user?.userId,
                          file,
                        })
                      }
                      name="proofOfProfile"
                      valueMapper={(value) => value}
                      formik={formik}
                      className="mt-2"
                      placeholder={
                        user?.kyc?.proofOfProfileVerified
                          ? "Verified"
                          : undefined
                      }
                    />
                  </div>

                  <div className="mt-5">
                    <PrimaryButton
                      className={"w-full"}
                      text={"Submit"}
                      loading={formik.isSubmitting}
                      disabled={
                        formik.isSubmitting ||
                        !formik.isValid ||
                        !formik.dirty ||
                        !allFilesSelected
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

const Level3Info = () => {
  return (
    <div className="bg-[#F9F9FB] p-2 mt-5 border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
      <p>
        <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
        <span>Create sell ads (max 100M NGN in crypto assets)</span>
      </p>
      <p>
        <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
        <span>Create buy ads (max 100M NGN in crypto assets)</span>
      </p>
      <p>
        <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
        <span>
          Max daily limit for withdrawal is unlimited NGN and 3m USD in crypto
        </span>
      </p>
    </div>
  );
};
