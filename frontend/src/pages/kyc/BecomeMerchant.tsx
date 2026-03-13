import sampleImage from "@/assets/Image.jpg";
import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
import Label from "@/components/Inputs/Label";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import BackButton from "@/components/shared/BackButton";
import SecurityBanner from "@/components/shared/SecurityBanner";
import Toast from "@/components/Toast";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { merchantSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  Become_Merchant_Hanlder,
  GetUserDetails,
} from "@/redux/actions/userActions";
import { cn, formatAccountLevel } from "@/utils";
import { useFormik } from "formik";
import { Check, File, IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BecomeMerchant = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState.user?.userId || "";
  const { level } = formatAccountLevel(userState.user?.accountLevel);

  const isPending = userState.user?.hasAppliedToBecomeAMerchant && level !== 2;

  const [showModal, setShowModal] = useState(isPending);

  useEffect(() => {
    if (userState.user?.hasAppliedToBecomeAMerchant || isPending) {
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      utilityBill: "",
      photoIdentity: "",
    },
    validationSchema: merchantSchema,
    onSubmit: async (payload) => {
      if (!payload.utilityBill || !payload.photoIdentity) {
        Toast.error("Please upload all required documents.", "");
        return;
      }
      const dataInfo = {
        utilityBill: payload.utilityBill,
        photoIdentity: payload.photoIdentity,
      };
      await Become_Merchant_Hanlder(dataInfo).then(async (res) => {
        if (res.status) {
          Toast.success("Merchant information submitted successfully.", "");
          await GetUserDetails({ userId, token: userState.user?.token }).then(
            () => {
              setShowModal(true);
              formik.resetForm();
            },
          );
        } else {
          Toast.error(res.message, "");
        }
      });
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* <BackButton /> */}
        <OtherSide
          header="Apply to become a Merchant"
          headerClassName="text-xl lg:text-4xl"
          subHeader={
            <p className=" text-sm">
              Join our marketplace. Please upload the required documents to
              verify your business identity and legality.
            </p>
          }
        />

        <div className="mt-6 mb-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6 mb-4">
              <div className="grid md:grid-cols-2 gap-4 border border-border px-4 py-6 rounded-md">
                <div className="col-span-full text-sm text-muted-foreground space-y-3">
                  <div className="flex items-center gap-3">
                    <IdCard className="text-primary size-8" />
                    <h4 className="text-xl font-semibold text-foreground">
                      Identity Verification
                    </h4>
                  </div>
                  <p className="text-muted-foreground">
                    Upload a high-resolution photo of yourself holding your
                    valid Passport, Driver's License, or National ID card close
                    to your face. Ensure all text on the ID and your face are
                    clearly visible without glare.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label text="Sample Document" />
                  <img
                    src={sampleImage}
                    alt="sample_photo_identity"
                    className="rounded-lg m-2"
                  />
                </div>

                <FileInputField
                  label={"Your Upload"}
                  name="photoIdentity"
                  formik={formik}
                  maxSizeMB={5}
                  className="h-full"
                />
              </div>

              <div className="grid gap-4 border border-border px-4 py-6 rounded-md">
                <div className=" text-sm text-muted-foreground space-y-3">
                  <div className="flex items-center gap-2">
                    <File className="text-primary size-6" />
                    <h4 className="text-xl font-semibold text-foreground">
                      Utility Bill
                    </h4>
                  </div>
                  <p className="text-muted-foreground">
                    Please provide a copy of your utility bill not older than 3
                    months. This helps us verify your business address.
                  </p>
                </div>

                {/* SUB: Utility Bill */}
                <FileInputField
                  label="Your Upload"
                  name="utilityBill"
                  maxSizeMB={5}
                  formik={formik}
                />
              </div>
            </div>
            <SecurityBanner />

            <div className="mt-6 flex items-center gap-4 justify-between">
              <BackButton />
              <PrimaryButton
                className={"w-fit"}
                text={"Submit Application"}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <ModalTemplate onClose={() => {}} showCloseButton={false}>
          <div className="flex flex-col items-center text-center gap-1 my-6 md:mx-8">
            <div className="size-12 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center mb-4 ">
              <Check className="text-green-500 size-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">
              Merchant Information Submitted
            </h4>
            <p className="text-sm text-muted-foreground">
              Your information has been submitted successfully, Awaiting review.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-4 text-sm rounded-full",
              )}
              to={APP_ROUTES.DASHBOARD}
              replace
            >
              Back to Dashboard
            </Link>
          </div>
        </ModalTemplate>
      )}
    </>
  );
};

export default BecomeMerchant;
