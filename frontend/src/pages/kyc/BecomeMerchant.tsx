import { PrimaryButton } from "@/components/buttons/Buttons";
import FileInputField from "@/components/Inputs/FileInputFIeld";
import SecurityBanner from "@/components/shared/SecurityBanner";
import OtherSide from "@/layouts/auth/OtherSide";
import { useFormik } from "formik";

const BecomeMerchant = () => {
  const formik = useFormik({
    initialValues: {
      utilityBill: "",
      cacApplicationDocument: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <OtherSide
        header="Become a Merchant"
        subHeader={
          <p className="text-[#515B6E] text-sm">
            Submit the required documents to become a{" "}
            <span className="text-green-600">merchant</span> on Bisats
          </p>
        }
      />

      <div className="mt-10 mb-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-3">
            {/* SUB: Utility Bill */}
            <FileInputField
              label="Upload a recent utility bill (Not later than 4months ago)"
              name="utilityBill"
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

      <SecurityBanner />
    </div>
  );
};

export default BecomeMerchant;
