import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { VerifyTwoFactorAuth } from "@/redux/actions/userActions";
import { TwoFactorAuth } from "@/redux/actions/walletActions";

import * as Yup from "yup";

import { useFormik } from "formik";

interface Props {
  close: () => void;
  func: (data?: Record<string, any>) => void;
  mode: "TWO_FA_ONLY" | "TWO_FA_AND_PIN";
  isManual?: boolean;
}
const SecurityVerification: React.FC<Props> = ({
  close,
  func,
  mode,
  isManual,
}) => {
  const initialValues =
    mode === "TWO_FA_AND_PIN"
      ? {
          pin: "",
          code: "",
        }
      : {
          code: "",
        };

  const validationSchema = Yup.object({
    code: Yup.string()
      .required("2FA code is required")
      .length(6, "Must be 6 digits"),
    pin:
      mode === "TWO_FA_AND_PIN"
        ? Yup.string().required("PIN is required").length(4, "Must be 4 digits")
        : Yup.string().notRequired(), // Explicitly mark as optional
  });

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema,
    validateOnMount: false,

    onSubmit: async (values) => {
      if (isManual) {
        func(values);
        close();
        return;
      }
      if (mode === "TWO_FA_AND_PIN") {
        await TwoFactorAuth({
          pin: values.pin!,
          code: values.code,
        })
          .then((res) => {
            if (res?.statusCode === 200) {
              func();
              close();
            } else {
              Toast.error(res.error.message, "Error");
            }
          })
          .catch((err) => {
            Toast.error(err.error.message, "Error");
          });
      } else {
        await VerifyTwoFactorAuth({
          code: values.code,
        })
          .then((res) => {
            if (res?.status) {
              func();
              close();
            } else {
              Toast.error(res.message, "Error");
            }
          })
          .catch((err) => {
            Toast.error(err.message, "Error");
          });
      }
    },
  });

  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full  mx-auto">
        <p className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-5">
          Security Verification
        </p>
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={formik.handleSubmit}
        >
          <PrimaryInput
            type="code"
            label={"Autheticator App code"}
            error={formik.errors.code}
            touched={undefined}
            value={formik.values.code}
            name="code"
            onChange={formik.handleChange}
          />

          {mode === "TWO_FA_AND_PIN" && (
            <PrimaryInput
              type="pin"
              label={"Wallet PIN"}
              error={formik.errors.pin}
              touched={undefined}
              value={formik.values.pin}
              name="pin"
              otpLength={4}
              onChange={formik.handleChange}
            />
          )}

          <PrimaryButton
            type="submit"
            className={"w-full mt-4"}
            text={"Confirm"}
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
          />
        </form>
      </div>
    </ModalTemplate>
  );
};

export default SecurityVerification;
