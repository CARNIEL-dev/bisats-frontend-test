import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { getDepositBreakDown } from "@/helpers";
import { ConfirmDeposit, TopUpNGNBalance } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { formatNumber } from "@/utils/numberFormat";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Head from "@/pages/wallet/Head";

type TBank = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};
const TransactionBreakdown = () => {
  const user: UserState = useSelector((state: any) => state.user);
  const [isBreakDown, setIsBreakDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [selectedBank, setSelectedBank] = useState<TBank>();

  const [selectedBankID, setSelectedBankID] = useState("");
  const [paymentID, setPaymentID] = useState("");

  const TransBreakDown = getDepositBreakDown();
  const banks = TransBreakDown.bankAccounts.map((tb: any) => ({
    value: tb?.id,
    label: (
      <div className="text-sm flex flex-col ">
        <p>{tb?.bankName}</p>
        <p>{tb?.accountNumber}</p>
        <p>{tb?.accountName}</p>
      </div>
    ),
    labelDisplay: (
      <div className="text-sm flex items-center gap-2">
        <p className="text-xs">{tb?.bankName}</p>
        <p> - {tb.accountNumber}</p>
      </div>
    ),
  }));
  const navigate = useNavigate();

  useEffect(() => {
    for (let i of TransBreakDown?.bankAccounts) {
      if (i?.id === selectedBankID) {
        setSelectedBank(i);
      }
    }
  }, [selectedBankID]);

  const onIntiateTopUp = async () => {
    setLoading(true);
    const response = await TopUpNGNBalance({
      userId: `${user?.user?.userId}`,
      amount: Number(TransBreakDown?.amount),
      bankAccountId: selectedBankID,
    });
    setLoading(false);
    if (response?.status) {
      setPaymentID(response?.data?.id);
      setIsBreakDown(true);
      Toast.success("", response?.message);
    } else {
      Toast.error(response.message, "");
    }
  };

  const ConfirmPayment = async (prop: string) => {
    {
      prop === "confirmed" ? setConfirmLoading(true) : setCancelLoading(true);
    }
    const response = await ConfirmDeposit({
      userId: `${user?.user?.userId}`,
      status: `${prop}`,
      paymentId: paymentID,
    });
    {
      prop === "confirmed" ? setConfirmLoading(false) : setCancelLoading(false);
    }
    if (response?.status) {
      navigate(APP_ROUTES.WALLET.HOME);
      Toast.success("", response?.message);
    } else {
      Toast.error(response?.message, "Failed");
    }
  };

  return (
    <div>
      <div>
        <Head
          header={isBreakDown ? "Confirm Deposit" : "Select Bank"}
          subHeader={
            isBreakDown
              ? "Make sure to send the exact amount to avoid loss of funds."
              : "Select a bank you will be making payments into"
          }
        />
        {isBreakDown ? (
          <>
            <div className="py-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[#424A59] font-normal">Amount:</p>
                <p className="text-[#606C82]  font-semibold">
                  NGN {formatNumber(TransBreakDown?.amount)}
                </p>
              </div>

              <div className="flex justify-between items-center mb-3">
                <p className="text-[#424A59] font-normal">Processing Charge:</p>
                <p className="text-[#606C82]  font-semibold">
                  NGN {formatNumber(TransBreakDown?.processingCharge)}
                </p>
              </div>

              <div className="flex justify-between items-center border-t-[0.5px] border-[#606C82] pt-5">
                <p className="text-[#424A59] font-normal">Total:</p>
                <p className="text-[#606C82]  font-semibold">
                  NGN {formatNumber(TransBreakDown?.totalAmount)}
                </p>
              </div>
            </div>
            <div className="h-fit border   border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] p-2  my-5 text-[14px] leading-[24px] ">
              <h1 className="text-[#424A59] font-semibold text-[16px]">
                {" "}
                Bank details
              </h1>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-2 ">
                  <p className="text-[#424A59] font-normal">Bank Name:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {" "}
                    {selectedBank?.bankName}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#424A59] font-normal">Account Number:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {selectedBank?.accountNumber}{" "}
                  </p>
                </div>
                <div className="flex justify-between items-center ">
                  <p className="text-[#424A59] font-normal">Account Name:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {selectedBank?.accountName}
                  </p>
                </div>
              </div>
            </div>
            <PrimaryButton
              text={"I have made payment"}
              loading={confirmLoading}
              css="w-full"
              onClick={() => ConfirmPayment("confirmed")}
            />
            <WhiteTransparentButton
              text={"Cancel"}
              loading={cancelLoading}
              css="w-full mt-3"
              onClick={() => ConfirmPayment("cancel")}
            />
          </>
        ) : (
          <>
            <div className="h-fit border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] p-2  my-5 text-[14px] leading-[24px] ">
              <div>
                <MultiSelectDropDown
                  title={"Select a bank for payment"}
                  choices={banks}
                  error={undefined}
                  touched={undefined}
                  label={"Select Bank"}
                  handleChange={(prop) => setSelectedBankID(prop)}
                />
              </div>
            </div>
            <PrimaryButton
              text={"Proceed"}
              loading={loading}
              css="w-full "
              onClick={() => onIntiateTopUp()}
              disabled={!selectedBankID}
            />
            <WhiteTransparentButton
              text={"Cancel"}
              loading={false}
              css="w-full mt-3"
              onClick={() => navigate(-1)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionBreakdown;
