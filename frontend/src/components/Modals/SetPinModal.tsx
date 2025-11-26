import {
  rehydrateUser,
  Set_PIN,
  UPDATE_PIN,
} from "@/redux/actions/userActions";
import { useSelector } from "react-redux";

import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { setPinSchema } from "@/formSchemas";
import { useFormik } from "formik";

interface Props {
  close: () => void;
  type: "create" | "change";
  open?: boolean;
}

const SetPinModal: React.FC<Props> = ({ close, type, open }) => {
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
      const response = await (type === "create"
        ? Set_PIN({
            pin: values.pin,
            confirmPin: values.confirmPin,
          })
        : UPDATE_PIN({
            pin: values.pin,
            confirmPin: values.confirmPin,
            oldPin: values.oldPin,
          }));

      if (response?.success) {
        Toast.success(
          response.message,
          type === "create" ? "PIN Created" : "PIN Updated"
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
    <ModalTemplate onClose={close} isOpen={open} className="md:!max-w-sm">
      <div className="flex flex-col ">
        <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-2">
          Security Verification
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-1.5 mt-6 mb-4 text-center items-center"
        >
          {type === "change" && (
            <PrimaryInput
              type="code"
              otpLength={4}
              label={"Old PIN"}
              error={formik.errors.oldPin}
              touched={undefined}
              value={formik.values.oldPin}
              name="oldPin"
              onChange={formik.handleChange}
              className="w-fit"
            />
          )}

          <PrimaryInput
            type="code"
            otpLength={4}
            name="pin"
            label={"Wallet PIN"}
            error={formik.errors.pin}
            touched={undefined}
            value={formik.values.pin}
            onChange={formik.handleChange}
            className="w-fit"
          />
          <PrimaryInput
            type="code"
            otpLength={4}
            label={"Confirm PIN"}
            error={formik.errors.confirmPin}
            touched={undefined}
            name="confirmPin"
            value={formik.values.confirmPin}
            onChange={formik.handleChange}
            className="w-fit"
          />

          <PrimaryButton
            className={"w-full mt-4"}
            text={"Confirm"}
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
          />
        </form>
      </div>
    </ModalTemplate>
  );
};

export default SetPinModal;
