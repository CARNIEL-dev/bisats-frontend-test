import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  EditBankAccountForWithdrawal,
  GetBankList,
} from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
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

type TBank = {
  bank_code: string;
  bank_logo: string;
  bank_name: string;
  bank_type: string;
  country_code: string;
  currency_code: string;
  ussd_code: null;
  ussd_transfer_code: null;
};

const EditWithdrawalBankAccount: React.FC<Props> = ({ close, bank }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [selectedBank, setSelectedBank] = useState<TBank | null>();
  const [bankAccountNumber, setBankAccountNumber] = useState(
    bank?.accountNumber ?? ""
  );
  const [bankAccountName, setBankAccountName] = useState(
    bank?.accountName ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [choices, setChoices] = useState([]);

  const FetchBankList = async () => {
    let res = await GetBankList(user?.userId);
    setBankList(res);
    setChoices(
      res?.map((choice: { bank_name: string; bank_code: string }) => ({
        label: choice?.bank_name,
        value: choice?.bank_code,
      }))
    );
  };
  const handleSelectBank = (e: string) => {
    const selected =
      bankList?.find((bank: TBank) => bank?.bank_code === e) ?? null;
    console.log(selected);
    setSelectedBank(selected);
  };

  useEffect(() => {
    FetchBankList();
  }, []);

  const CheckNameMatch = () => {
    const bankNameArray = bankAccountName
      .trim()
      .split(/\s+/)
      .map((word) => word.toLowerCase());
    const bisatsAccountName = [
      user?.firstName?.toLowerCase(),
      user?.middleName?.toLowerCase(),
      user?.lastName?.toLowerCase(),
    ];
    const matchCount = bisatsAccountName.filter((name) =>
      bankNameArray.includes(name)
    ).length;
    const atLeastTwoMatch = matchCount >= 2;
    return atLeastTwoMatch;
  };

  const EditBankAccount = async () => {
    if (!CheckNameMatch()) {
      Toast.error(
        "Please provide a Bank account name that matches your Bisats account",
        "Account Name Mismatch"
      );
      return;
    }
    setIsLoading(true);
    const response = await EditBankAccountForWithdrawal({
      userId: user?.userId,
      bankId: bank?.id,
      bankName: selectedBank?.bank_name ?? bank?.bankName ?? "",
      bankCode: selectedBank?.bank_code ?? bank?.bankCode ?? "",
      accountNumber: bankAccountNumber,
      accountName: bankAccountName,
    });
    setIsLoading(false);
    if (response?.status) {
      Toast.success(response.message, "Account Updated");
      close();
    } else {
      Toast.error(response.message, "Failed");
    }
  };

  return (
    <ModalTemplate onClose={close}>
      <div className="mt-2">
        <h1 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Add Withdrawal Bank Account
        </h1>
        <div className="my-5">
          <MultiSelectDropDown
            placeholder={"Select Bank"}
            choices={choices}
            error={undefined}
            touched={undefined}
            label={"Bank"}
            scrollHeight={"200px"}
            handleChange={(prop) => handleSelectBank(prop)}
            value={bank?.bankName ?? selectedBank?.bank_name ?? ""}
          />
          <div className="my-3">
            <PrimaryInput
              className={"w-full py-3 "}
              label={"Account Number"}
              error={undefined}
              touched={undefined}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                const numericValue = value.replace(/\D/g, "");
                setBankAccountNumber(numericValue);
              }}
              value={bankAccountNumber}
            />
          </div>
          <PrimaryInput
            className={"w-full py-3"}
            label={"Account Name"}
            value={bankAccountName}
            error={!CheckNameMatch()}
            touched={!CheckNameMatch()}
            onChange={(e) => setBankAccountName(e.target.value)}
            info="Ensure your Bank Account Name matches exactly with your Account Name on Bisats"
          />
        </div>
        <div className="flex items-center w-full mt-5">
          <WhiteTransparentButton
            text={"Cancel"}
            loading={false}
            onClick={close}
            className="w-[]"
            style={{ width: "50%" }}
          />
          <PrimaryButton
            text={"Update Account"}
            loading={isLoading}
            className="w-1/2 ml-3"
            onClick={EditBankAccount}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default EditWithdrawalBankAccount;
