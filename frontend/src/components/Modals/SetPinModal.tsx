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
}

const SetPinModal: React.FC<Props> = ({ close, type }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [oldPin, setOldPin] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const Submit = async () => {
    if (pin !== confirmPin) {
      Toast.error("Make sure you entered the same PIN", "PIN mismatch");
      return;
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
      rehydrateUser();
      close();
    } else {
      Toast.error(response.message, "Failed");
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <ModalTemplate onClose={close}>
      <div
        className="flex flex-col justify-center w-full mx-auto"
        onClick={handleModalContentClick}
      >
        <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-2">
          Security Verification
        </h1>
        <div className="flex flex-col gap-2 mt-4">
          {type === "change" && (
            <PrimaryInput
              css={"w-full p-2.5 "}
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
              css={"w-full p-2.5"}
              type="number"
              label={"Wallet PIN"}
              error={undefined}
              touched={undefined}
              value={pin}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                setPin(value);
              }}
            />
          </div>
          <PrimaryInput
            css={"w-full p-2.5"}
            label={"Confirm PIN"}
            error={pin !== confirmPin ? true : false}
            touched={undefined}
            value={confirmPin}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              setConfirmPin(value);
            }}
          />

          <PrimaryButton
            css={"w-full mt-6"}
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
