import React from "react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import LogOutIcon from "@/assets/icons/logout-icon.svg";
import { logoutUser } from "@/redux/actions/userActions";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  close: () => void;
}
const LogOutModal: React.FC<Props> = ({ close }) => {
  const queryClient = useQueryClient();
  return (
    <ModalTemplate onClose={close} isOpen>
      <div className="flex flex-col gap-4">
        <img
          src={LogOutIcon}
          alt="logout text"
          className="size-[32px]  lg:size-[50px] "
        />

        <p className="font-semibold lg:text-lg">
          Are you sure you want to Sign out of your Bisats account?
        </p>

        <div className="flex items-center w-full mt-2">
          <WhiteTransparentButton
            text={"Cancel"}
            loading={false}
            onClick={close}
            className="w-[]"
            style={{ width: "50%" }}
          />
          <PrimaryButton
            text={"Log Out"}
            loading={false}
            className="w-1/2 ml-3"
            onClick={() => {
              queryClient.clear();
              logoutUser();
              close();
            }}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default LogOutModal;
