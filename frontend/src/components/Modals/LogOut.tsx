import React from "react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import LogOutIcon from "@/assets/icons/logout-icon.svg";
import { logoutUser } from "@/redux/actions/userActions";

interface Props {
  close: () => void;
}
const LogOutModal: React.FC<Props> = ({ close }) => {
  return (
    <ModalTemplate onClose={close} className="2xl:w-[600px]">
      <div className="flex flex-col gap-4">
        <img
          src={LogOutIcon}
          alt="logout text"
          className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] "
        />

        <p className="font-semibold lg:text-lg">
          Are you sure you want to Sign out of your Bisats account?
        </p>

        <div className="flex items-center w-full mt-4">
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
