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
  mode: "TWO_FA_ONLY" | "TWO_FA_AND_PIN" | "PIN";
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
      : mode === "TWO_FA_ONLY"
      ? {
          code: "",
        }
      : {
          pin: "",
        };

  const validationSchema = Yup.object({
    code:
      mode !== "PIN"
        ? Yup.string()
            .required("2FA code is required")
            .length(6, "Must be 6 digits")
        : Yup.string().notRequired(),
    pin:
      mode === "TWO_FA_AND_PIN" || mode === "PIN"
        ? Yup.string().required("PIN is required").length(4, "Must be 4 digits")
        : Yup.string().notRequired(),
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
          code: values.code!,
        })
          .then((res) => {
            if (res?.statusCode === 200) {
              func();
              close();
            } else {
              Toast.error(res.message, "Error");
            }
          })
          .catch((err) => {
            Toast.error(err.message, "Error");
          });
      } else {
        await VerifyTwoFactorAuth({
          code: values.code!,
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
          {mode !== "PIN" && (
            <PrimaryInput
              type="code"
              label={"Autheticator App code"}
              error={formik.errors.code}
              touched={undefined}
              value={formik.values.code}
              name="code"
              onChange={formik.handleChange}
            />
          )}

          {(mode === "TWO_FA_AND_PIN" || mode === "PIN") && (
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
