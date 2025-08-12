import ModalTemplate from "./ModalTemplate";
import PrimaryInput from "../Inputs/PrimaryInput";
import { PrimaryButton } from "../buttons/Buttons";
import { useState } from "react";
import Toast from "../Toast";
import { TwoFactorAuth } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { useSelector } from "react-redux";

interface Props {
  close: () => void;
  func: () => void;
  open?: boolean;
}
const SecurityVerification: React.FC<Props> = ({ close, func, open }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      // Replace with your actual backend verification logic
      const res = await TwoFactorAuth({
        userId: user?.userId,
        pin: pin,
        code: code,
      });
      console.log(res);

      if (!res.status) {
        // Toast.error(res.message, 'Verification failed')
        throw new Error(res.message || "Verification failed");
      }

      func();
      close();
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      Toast.error(err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalTemplate onClose={close} isOpen={open}>
      <div className="flex flex-col justify-center w-full  mx-auto">
        <p className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-5">
          Security Verification
        </p>
        <form className="mt-5">
          <div className="relative mb-4">
            <PrimaryInput
              className={"w-full p-2.5"}
              label={"Autheticator app code"}
              placeholder="Enter code"
              error={undefined}
              touched={undefined}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <PrimaryInput
            className={"w-full p-2.5 mb-7"}
            label={"Wallet PIN"}
            placeholder="Enter PIN"
            error={undefined}
            touched={undefined}
            onChange={(e) => setPin(e.target.value)}
          />

          <PrimaryButton
            className={"w-full"}
            text={"Confirm"}
            loading={loading}
            onClick={handleVerify}
            disabled={loading}
          />
        </form>
      </div>
    </ModalTemplate>
  );
};

export default SecurityVerification;
