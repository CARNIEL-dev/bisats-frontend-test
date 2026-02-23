import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import BackButton from "@/components/shared/BackButton";
import PinForm from "@/components/shared/PinForm";
import ResendCodeButton from "@/components/shared/ResendCodeButton";
import { VerificationSchema } from "@/formSchemas";
import Head from "@/pages/wallet/Head";
import { FORGOT_PIN } from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { Key } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  close: () => void;
};
const ForgotPinModal = ({ open, close }: Props) => {
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [token, setToken] = useState("");

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      setToken(values.code);
      setIsCodeVerified(true);
    },
  });
  const resendCodeHandler = async () => {
    const res = await FORGOT_PIN();

    if (res.status) {
      Toast.success(res.message, "Success");
      return true;
    }

    Toast.error(res.message, "Error");
    return false;
  };
  return (
    <ModalTemplate isOpen={open} onClose={close} className="px-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="rounded-full size-12 grid bg-gray-100 place-items-center border">
          <Key />
        </div>
        <Head header="Forgot Pin" />
      </div>
      {!(isCodeVerified && token) ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="">
            <p className="text-gray-500 text-sm mb-2">
              Enter the code sent to your email
            </p>
            <div className="w-full mb-4">
              <PrimaryInput
                type="code"
                name="code"
                label="Code"
                className="w-full outline-hidden "
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
                text={"Next"}
                type="submit"
                loading={formik.isSubmitting}
                disabled={
                  formik.isSubmitting || !formik.isValid || !formik.dirty
                }
              />
            </div>
            <ResendCodeButton
              onClick={resendCodeHandler}
              text="Resend a new code"
              defaultTime={30}
            />
          </div>
        </form>
      ) : (
        <div>
          <BackButton
            onClick={() => {
              setIsCodeVerified(false);
            }}
          />
          <PinForm close={close} type="create" />
        </div>
      )}
    </ModalTemplate>
  );
};

export default ForgotPinModal;
