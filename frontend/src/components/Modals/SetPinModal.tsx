import { useState } from "react";
import { useSelector } from "react-redux";
import {
  rehydrateUser,
  Set_PIN,
  UPDATE_PIN,
} from "@/redux/actions/userActions";

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
    if (pin.length !== 4 || confirmPin.length !== 4) {
      Toast.error("PIN must be exactly 4 digits", "Invalid PIN");
      return;
    }
    if (oldPin && type === "change") {
      if (oldPin.length !== 4) {
        Toast.error("Old PIN must be exactly 4 digits", "Invalid PIN");
        return;
      }
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

  // Helper function to handle PIN input changes with max length of 4
  const handlePinChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const numericValue = value.replace(/\D/g, ""); // Remove non-digit characters
    if (numericValue.length <= 4) {
      setter(numericValue);
    }
  };

  const isFormValid = () => {
    if (type === "change") {
      return (
        pin.length === 4 &&
        confirmPin.length === 4 &&
        oldPin.length === 4 &&
        pin === confirmPin
      );
    }
    return pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;
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
              className={"w-full p-2.5"}
              label={"Old PIN"}
              error={undefined}
              touched={undefined}
              value={oldPin}
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              onChange={(e) => {
                handlePinChange(e.target.value, setOldPin);
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
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              onFocus={() => {
                setFieldFocused("pin");
              }}
              value={pin}
              onChange={(e) => {
                handlePinChange(e.target.value, setPin);
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
            maxLength={4}
            placeholder="Confirm 4-digit PIN"
            value={confirmPin}
            onChange={(e) => {
              setFieldFocused("confirmPin");
              handlePinChange(e.target.value, setConfirmPin);
            }}
          />

          <div className="text-sm text-gray-500 text-center">
            PIN must be exactly 4 digits
          </div>

          <PrimaryButton
            className={"w-full mt-4"}
            text={"Confirm"}
            loading={loading}
            onClick={Submit}
            disabled={loading || !isFormValid()}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SetPinModal;
