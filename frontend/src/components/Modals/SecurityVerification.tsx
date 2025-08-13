import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { VerifyTwoFactorAuth } from "@/redux/actions/userActions";
import { TwoFactorAuth } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import * as Yup from "yup";

import { useFormik } from "formik";
import { useSelector } from "react-redux";

interface Props {
  close: () => void;
  func: () => void;

  mode: "TWO_FA_ONLY" | "TWO_FA_AND_PIN";
}
const SecurityVerification: React.FC<Props> = ({ close, func, mode }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

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
    userId: Yup.string().required(),
    code: Yup.string()
      .required("2FA code is required")
      .length(6, "Must be 6 digits"),
    pin:
      mode === "TWO_FA_AND_PIN"
        ? Yup.string().required("PIN is required").length(4, "Must be 4 digits")
        : Yup.string().notRequired(), // Explicitly mark as optional
  });

  const formik = useFormik({
    initialValues: { ...initialValues, userId: user?.userId },
    validationSchema,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (mode === "TWO_FA_AND_PIN") {
        await TwoFactorAuth({
          userId: values.userId,
          pin: values.pin!,
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
      } else {
        await VerifyTwoFactorAuth({
          userId: values.userId,
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
            className={"w-full p-2.5"}
            label={"Autheticator App code"}
            placeholder="Enter code"
            error={formik.errors.code}
            touched={undefined}
            value={formik.values.code}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              formik.setFieldValue("code", value);
            }}
          />

          {mode === "TWO_FA_AND_PIN" && (
            <PrimaryInput
              className={"w-full p-2.5"}
              label={"Wallet PIN"}
              placeholder="Enter PIN"
              error={formik.errors.pin}
              touched={undefined}
              value={formik.values.pin}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                formik.setFieldValue("pin", value);
              }}
            />
          )}

          <PrimaryButton
            className={"w-full mt-4"}
            text={"Confirm"}
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          />
        </form>
      </div>
    </ModalTemplate>
  );
};

export default SecurityVerification;
