import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { corporateSchema } from "@/formSchemas";
import Head from "@/pages/wallet/Head";
import { PostCorporateInformation } from "@/redux/actions/userActions";
import { cn } from "@/utils";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Corporate = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState.user?.userId || "";
  const [showModal, setShowModal] = useState(
    Boolean(
      userState.user?.cooperateAccountVerificationRequest?.status === "pending"
    )
  );

  const formik = useFormik({
    initialValues: {
      cacApplicationDocument: null,
      mermartDocument: null,
      cacDocument: null,
      userId,
    },
    validationSchema: corporateSchema,
    onSubmit: async (payload) => {
      if (!payload.cacApplicationDocument || !payload.cacDocument) {
        Toast.error("Please upload all required documents.", "");
        return;
      }
      await PostCorporateInformation(payload).then((res) => {
        if (res.status === 201) {
          Toast.success("Corporate information submitted successfully.", "");
          setShowModal(true);
          formik.resetForm();
        } else {
          Toast.error("Failed to submit corporate information.", "");
        }
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
              info="Profiel screenshot"
              valueMapper={(value) => value}
              formik={formik}
              autoUpload={false}
            />

            {/* SUB: Mermart (Optional) */}
            <FileInputField
              label="Mermart (Optional)"
              name="mermartDocument"
              valueMapper={(value) => value}
              formik={formik}
              className="mt-2"
              autoUpload={false}
            />
          </div>

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
              Corporate Information Submitted
            </h4>
            <p className="text-sm text-gray-500">
              Your corporate information has been submitted successfully,
              Awaiting review.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-4 text-sm rounded-full"
              )}
              to={APP_ROUTES.SETTINGS.PAYMENT}
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
