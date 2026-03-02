import {
  rehydrateUser,
  RESET_PIN,
  Set_PIN,
  UPDATE_PIN,
} from "@/redux/actions/userActions";
import { useSelector } from "react-redux";

import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { setPinSchema } from "@/formSchemas";
import { useFormik } from "formik";

interface Props {
  close: () => void;
  type: "create" | "change" | "reset";
  token?: string;
}
const PinForm: React.FC<Props> = ({ close, type, token }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const formik = useFormik({
    initialValues: {
      oldPin: "",
      pin: "",
      confirmPin: "",
    },
    validationSchema: setPinSchema(type === "change"),
    onSubmit: async (values) => {
      if (type === "reset" && !token) {
        Toast.error("Token is required", "Failed");
        return;
      }
      const response = await (type === "create"
        ? Set_PIN({
            pin: values.pin,
            confirmPin: values.confirmPin,
          })
        : type === "reset"
          ? RESET_PIN({
              pin: values.pin,
              confirmPin: values.confirmPin,
              oldPin: token,
            })
          : UPDATE_PIN({
              pin: values.pin,
              confirmPin: values.confirmPin,
              oldPin: values.oldPin,
            }));

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        Toast.success(
          response.message,
          type === "create" ? "PIN Created" : "PIN Updated",
        );
        rehydrateUser({
          userId: user?.userId,
          token: user?.token,
        });
        close();
      } else {
        Toast.error(response.error?.message, "Failed");
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-1.5 my-4 "
    >
      {type === "change" && (
        <PrimaryInput
          type="pin"
          otpLength={4}
          label={"Old PIN"}
          error={formik.errors.oldPin}
          touched={undefined}
          value={formik.values.oldPin}
          name="oldPin"
          onChange={formik.handleChange}
        />
      )}

      <PrimaryInput
        type="pin"
        otpLength={4}
        name="pin"
        label={"Wallet PIN"}
        error={formik.errors.pin}
        touched={undefined}
        value={formik.values.pin}
        onChange={formik.handleChange}
      />
      <PrimaryInput
        type="pin"
        otpLength={4}
        label={"Confirm PIN"}
        error={formik.errors.confirmPin}
        touched={undefined}
        name="confirmPin"
        value={formik.values.confirmPin}
        onChange={formik.handleChange}
      />

      <PrimaryButton
        className={"w-full mt-4"}
        text={"Confirm"}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
      />
    </form>
  );
};

export default PinForm;
