import { deleteWalletAddressHandler } from "@/redux/actions/walletActions";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { GetUserDetails } from "@/redux/actions/userActions";
interface Props {
  close: () => void;
  wallet?: {
    id: string;
    address: string;
    network: string;
    name: string;
    asset: string;
  };
}
const DeleteWalletAddressModal: React.FC<Props> = ({ close, wallet }) => {
  const [isLoading, setIsLoading] = useState(false);

  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const DeleteAddress = async () => {
    setIsLoading(true);
    const response = await deleteWalletAddressHandler({
      addressId: wallet?.id ?? "",
    });
    setIsLoading(false);
    if (response?.success || response?.status === 200) {
      await GetUserDetails({ userId: user?.userId, token: user?.token });
      Toast.success(response.message, "Wallet Address Deleted");
      close();
    } else {
      Toast.error(response.message, "Failed");
    }
  };
  return (
    <ModalTemplate onClose={close}>
      <div className="relative mt-2">
        <h1 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Delete {wallet?.name}?
        </h1>
        <p className="text-[#606C82] text-[14px] lg:text-[14px] leading-[24px] font-normal mt-3">
          Are you sure you want to this Wallet address?
        </p>

        <div className="flex items-center w-full mt-5">
          <WhiteTransparentButton
            text={"Cancel"}
            loading={false}
            onClick={close}
            className="w-[]"
            style={{ width: "50%" }}
          />
          <PrimaryButton
            text={"Proceed"}
            loading={isLoading}
            className="w-1/2 ml-3"
            onClick={DeleteAddress}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default DeleteWalletAddressModal;
