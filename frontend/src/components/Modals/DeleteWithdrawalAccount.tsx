import { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteBankAccountForWithdrawal } from "@/redux/actions/walletActions";

import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import Toast from "@/components/Toast";
import ModalTemplate from "@/components/Modals/ModalTemplate";
interface Props {
  close: () => void;
  bank?: {
    id: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
  };
}
const DeleteWithdrawalAccount: React.FC<Props> = ({ close, bank }) => {
  const [isLoading, setIsLoading] = useState(false);

  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const DeleteBankAccount = async () => {
    setIsLoading(true);
    const response = await DeleteBankAccountForWithdrawal({
      bankAccountId: bank?.id ?? "",
    });
    setIsLoading(false);
    if (response?.success || response?.status === 200) {
      Toast.success(response.message, "Bank Account Deleted");
      close();
    } else {
      Toast.error(response.error.message, "Failed");
    }
  };
  return (
    <ModalTemplate onClose={close}>
      <div className="relative mt-2">
        <h1 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Delete withdrawal account?
        </h1>
        <p className="text-[#606C82] text-[14px] lg:text-[14px] leading-[24px] font-normal mt-3">
          Are you sure you want to delete withdrawal account?
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
            onClick={() => DeleteBankAccount()}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default DeleteWithdrawalAccount;
