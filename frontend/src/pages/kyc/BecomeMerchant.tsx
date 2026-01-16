import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
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
import { cn } from "@/utils";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BecomeMerchant = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState.user?.userId || "";

  const isPending =
    userState.user?.hasAppliedToBecomeAMerchant &&
    userState.user?.accountLevel === "level_2";

  const [showModal, setShowModal] = useState(isPending);

  useEffect(() => {
    if (userState.user?.hasAppliedToBecomeAMerchant || isPending) {
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      userId,
      utilityBill: null,
      photoIdentity: null,
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
        userId: payload.userId,
      };
      await Become_Merchant_Hanlder(dataInfo).then(async (res) => {
        if (res.status) {
          Toast.success("Merchant information submitted successfully.", "");
          await GetUserDetails({ userId, token: userState.user?.token }).then(
            () => {
              setShowModal(true);
              formik.resetForm();
            }
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
        <BackButton />
        <OtherSide
          header="Become a Merchant"
          subHeader={
            <p className="text-[#515B6E] text-sm">
              Submit the required documents to become a{" "}
              <span className="text-green-600">merchant</span> on Bisats
            </p>
          }
        />

        <div className="mt-8 mb-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-3">
              {/* SUB: Utility Bill */}
              <FileInputField
                label="Upload a recent utility bill (Not later than 4months ago)"
                name="utilityBill"
                autoUpload={false}
                maxSizeMB={2}
                valueMapper={(value) => value}
                formik={formik}
              />

              {/* SUB: Application for Registration of Company */}
              <FileInputField
                label={"Photo Identity"}
                name="photoIdentity"
                info="Photo holding your identity card or passport close to your face"
                valueMapper={(value) => value}
                formik={formik}
                autoUpload={false}
                maxSizeMB={2}
              />
            </div>

            <div className="mt-8">
              <PrimaryButton
                className={"w-full"}
                text={"Submit"}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
            </div>
          </form>
        </div>

        <SecurityBanner />
      </div>
      {showModal && (
        <ModalTemplate onClose={() => {}} showCloseButton={false}>
          <div className="flex flex-col items-center text-center gap-1 my-6 md:mx-8">
            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center mb-4 ">
              <Check className="text-green-500 size-6" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Merchant Information Submitted
            </h4>
            <p className="text-sm text-gray-500">
              Your information has been submitted successfully, Awaiting review.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-4 text-sm rounded-full"
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
