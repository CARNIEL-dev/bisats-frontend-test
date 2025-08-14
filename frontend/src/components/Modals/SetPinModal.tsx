import { useState } from "react";
import { useSelector } from "react-redux";
import {
  rehydrateUser,
  Set_PIN,
  UPDATE_PIN,
} from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";

interface Props {
  close: () => void;
  type: "create" | "change";
  open?: boolean;
}

const SetPinModal: React.FC<Props> = ({ close, type, open }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [oldPin, setOldPin] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [fieldFocused, setFieldFocused] = useState<"pin" | "confirmPin">("pin");

  const [loading, setLoading] = useState(false);

  const Submit = async () => {
    if (pin !== confirmPin) {
      Toast.error("Make sure you entered the same PIN", "PIN mismatch");
      return;
    }
    if (oldPin) {
      if (oldPin === confirmPin) {
        Toast.error("New PIN cannot be same as old PIN", "PIN mismatch");
        return;
      }
    }
    setLoading(true);
    const response = await (type === "create"
      ? Set_PIN({
          userId: user?.userId,
          pin: pin,
          confirmPin: confirmPin,
        })
      : UPDATE_PIN({
          userId: user?.userId,
          pin: pin,
          confirmPin: confirmPin,
          oldPin: oldPin,
        }));
    setLoading(false);
    if (response?.status) {
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
      Toast.error(response.message, "Failed");
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <ModalTemplate onClose={close} isOpen={open}>
      <div
        className="flex flex-col justify-center w-full mx-auto"
        onClick={handleModalContentClick}
      >
        <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-2">
          Security Verification
        </h1>
        <div className="flex flex-col gap-2 my-4 w-11/12 mx-auto">
          {type === "change" && (
            <PrimaryInput
              className={"w-full p-2.5 "}
              label={"Old PIN"}
              error={undefined}
              touched={undefined}
              value={oldPin}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                setOldPin(value);
              }}
            />
          )}
          <div className="">
            <PrimaryInput
              className={"w-full p-2.5"}
              type="number"
              label={"Wallet PIN"}
              error={undefined}
              touched={undefined}
              onFocus={() => {
                setFieldFocused("pin");
              }}
              value={pin}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                setPin(value);
              }}
            />
          </div>
          <PrimaryInput
            className={"w-full p-2.5"}
            label={"Confirm PIN"}
            error={
              fieldFocused === "confirmPin" && pin !== confirmPin
                ? "PINs do not match"
                : false
            }
            touched={undefined}
            // onFocus={() => {
            //   setFieldFocused("confirmPin");
            // }}

            value={confirmPin}
            onChange={(e) => {
              setFieldFocused("confirmPin");
              let value = e.target.value.replace(/\D/g, "");
              setConfirmPin(value);
            }}
          />

          <PrimaryButton
            className={"w-full mt-4"}
            text={"Confirm"}
            loading={loading}
            onClick={Submit}
            disabled={loading || pin !== confirmPin || !pin || !confirmPin}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SetPinModal;
