import { PrimaryButton } from "@/components/buttons/Buttons";
import AuthPasswordInput from "@/components/Inputs/AuthPasswordInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import Head from "@/pages/wallet/Head";
import { rehydrateUser, ResetTwoFactorAuth } from "@/redux/actions/userActions";
import { useFormik } from "formik";
import { Lock } from "lucide-react";
import { useSelector } from "react-redux";

const Reset2FAModal = ({
  open = true,
  close,
}: {
  open?: boolean;
  close: () => void;
}) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validateOnMount: false,
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      await ResetTwoFactorAuth({ password: values.password })
        .then(() => {
          rehydrateUser({
            userId: user?.userId,
            token: user?.token,
          });
          Toast.success("2FA Reset Successfully", "2FA Reset");
          close();
        })
        .catch((error) => {
          console.error("Error during 2FA reset:", error);
          Toast.error("An unexpected error occurred", "2FA Reset");
        });
    },
  });

  return (
    <ModalTemplate onClose={close} isOpen={open}>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 my-2">
        <div className="rounded-full size-10 grid bg-gray-100 place-items-center border">
          <Lock className="text-red-600 size-5" />
        </div>
        <Head
          header="Reset 2FA"
          subHeader="Enter your password to reset your 2FA"
        />

        <AuthPasswordInput
          text="Password"
          name="password"
          value={formik.values.password}
          placeholder="Enter your password"
          handleChange={formik.handleChange}
          error={formik.errors.password}
          check={false}
        />
        <PrimaryButton text="Reset 2FA" loading={formik.isSubmitting} />
      </form>
    </ModalTemplate>
  );
};

export default Reset2FAModal;
