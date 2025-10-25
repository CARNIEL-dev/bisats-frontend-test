import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import SecurityBanner from "@/components/shared/SecurityBanner";
import StatusBadge from "@/components/shared/StatusBadge";
import Toast from "@/components/Toast";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { corporateSchema } from "@/formSchemas";
import Head from "@/pages/wallet/Head";
import {
  PostCorporateInformation,
  rehydrateUser,
} from "@/redux/actions/userActions";
import { cn } from "@/utils";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Corporate = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState.user?.userId || "";

  const isCorporatePending =
    userState.user?.cooperateAccountVerificationRequest?.status.toLowerCase() ===
    "pending";

  const isCorporateRejected =
    userState.user?.cooperateAccountVerificationRequest?.status === "rejected";

  const [showModal, setShowModal] = useState(isCorporatePending);

  useEffect(() => {
    if (isCorporatePending) {
      setShowModal(true);
    }
  }, [isCorporatePending]);

  const formik = useFormik({
    initialValues: {
      cacApplicationDocument: null,
      mermartDocument: null,
      cacDocument: null,
      businessName: "",
      userId,
    },
    validationSchema: corporateSchema,
    onSubmit: async (payload) => {
      if (
        !payload.cacApplicationDocument ||
        !payload.cacDocument ||
        !payload.businessName
      ) {
        Toast.error("Please upload all required documents.", "");
        return;
      }
      await PostCorporateInformation(payload)
        .then((res) => {
          if (res.status) {
            Toast.success("Corporate information submitted successfully.", "");
            setShowModal(true);
            formik.resetForm();
          } else {
            Toast.error(res.message, "");
          }
        })
        .catch((err) => {
          Toast.error(err.message, "");
        });
    },
  });

  return (
    <>
      <div className="space-y-10">
        <Head
          header="Corporate Information"
          subHeader="Submit your corporate documents to enable corporate account name."
        />
        {isCorporateRejected && (
          <div className="flex items-center gap-2 !-mb-2">
            <StatusBadge status="rejected" />
            <p className="text-gray-500 text-sm">
              Your corporate information has been rejected.
            </p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="md:w-[80%] mx-auto">
          <div className="flex flex-col gap-3">
            {/* SUB: Certificate of Incorporation */}
            <FileInputField
              label="Certificate of Incorporation"
              name="cacDocument"
              autoUpload={false}
              valueMapper={(value) => value}
              formik={formik}
            />

            {/* SUB: Application for Registration of Company */}
            <FileInputField
              label={"Application for Registration of Company"}
              name="cacApplicationDocument"
              info="Profile screenshot"
              valueMapper={(value) => value}
              formik={formik}
              autoUpload={false}
            />

            {/* SUB: Mermart (Optional) */}
            {/* <FileInputField
              label="Mermart (Optional)"
              name="mermartDocument"
              valueMapper={(value) => value}
              formik={formik}
              className="mt-2"
              autoUpload={false}
            /> */}
            <div
              className={cn(
                "bg-neutral-50 rounded-md p-4 border border-dashed mb-6",
                { "border-red-500 ": formik.errors.businessName }
              )}
            >
              <h3 className="text-sm text-[#606C82] font-semibold">
                Your Business Bank Account
              </h3>
              <WithdrawalBankAccount
                close={() => {}}
                mode="custom"
                customSetValue={(val) =>
                  formik.setFieldValue("businessName", val)
                }
              />
              {formik.errors.businessName && (
                <small className="text-red-500">
                  {formik.errors.businessName}
                </small>
              )}
            </div>
          </div>

          <SecurityBanner />
          <div className="mt-5">
            <PrimaryButton
              className={"w-full"}
              text={"Submit"}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
      {showModal && (
        <ModalTemplate onClose={() => {}} showCloseButton={false}>
          <div className="flex flex-col items-center text-center gap-1 my-6 md:mx-8">
            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center mb-4 ">
              <Check className="text-green-500 size-6" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              {isCorporatePending
                ? "Your Corporate Information is Pending"
                : "Your Corporate Information Submitted"}
            </h4>
            <p className="text-sm text-gray-500">
              {isCorporatePending
                ? "Your corporate information is pending for review."
                : "Your corporate information has been submitted successfully, Awaiting review."}
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-4 text-sm rounded-full"
              )}
              to={APP_ROUTES.SETTINGS.PAYMENT}
              replace
              onClick={() =>
                rehydrateUser({
                  userId: userState.user?.userId,
                  token: userState.user?.token,
                })
              }
            >
              Back to Payment Settings
            </Link>
          </div>
        </ModalTemplate>
      )}
    </>
  );
};

export default Corporate;
