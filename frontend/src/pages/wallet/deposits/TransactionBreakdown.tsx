import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { getDepositBreakDown } from "@/helpers";
import { ConfirmDeposit, TopUpNGNBalance } from "@/redux/actions/walletActions";

import ModalTemplate from "@/components/Modals/ModalTemplate";
import SecurityBanner from "@/components/shared/SecurityBanner";
import { buttonVariants } from "@/components/ui/Button";
import useGetWallet from "@/hooks/use-getWallet";
import Head from "@/pages/wallet/Head";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useQueryClient } from "@tanstack/react-query";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type TBank = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};
const TransactionBreakdown = () => {
  const user: UserState = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState({
    confirmed: false,
    cancel: false,
    topUp: false,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBank, setSelectedBank] = useState<TBank>();
  const [selectedBankID, setSelectedBankID] = useState("");
  const [showPendindModal, setShowPendindModal] = useState(false);

  const queryClient = useQueryClient();
  const { refetchWallet } = useGetWallet();

  const paymentID = searchParams.get("paymentId") || "";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBankID]);

  const onIntiateTopUp = async () => {
    setLoading((prev) => ({ ...prev, topUp: true }));
    const response = await TopUpNGNBalance({
      amount: Number(TransBreakDown?.amount),
      bankAccountId: selectedBankID,
    });
    setLoading((prev) => ({ ...prev, topUp: false }));
    if (response?.status) {
      setSearchParams({ paymentId: response?.data?.id });
      Toast.success("", response?.message);
    } else {
      Toast.error(response.message, "");
    }
  };

  const ConfirmPayment = async (prop: "confirmed" | "cancel") => {
    if (!paymentID) {
      Toast.error("Payment not found", "Failed");
      return;
    }
    if (prop === "confirmed") {
      setShowPendindModal(true);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["userWalletHistory"],
          exact: false,
        }),
        refetchWallet(),
      ]);
      return;
    }
    setLoading((prev) => ({ ...prev, [prop]: true }));
    const response = await ConfirmDeposit({
      userId: `${user?.user?.userId}`,
      status: `${prop}`,
      paymentId: paymentID,
    });
    setLoading((prev) => ({ ...prev, [prop]: false }));
    if (!response?.status) {
      Toast.error(response?.message, "Failed");
    }
  };

  return (
    <>
      <div>
        <div>
          <Head
            header={paymentID ? "Confirm Deposit" : "Select Bank"}
            subHeader={
              paymentID
                ? "Make sure to send the exact amount to avoid loss of funds."
                : "Select a bank you will be making payments into"
            }
          />
          {paymentID ? (
            <>
              <div className="py-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[#424A59] font-normal">Amount:</p>
                  <p className="text-[#606C82]  font-semibold">
                    NGN {formatNumber(TransBreakDown?.amount)}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-[#424A59] font-normal">
                    Processing Charge:
                  </p>
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
                    <p className="text-[#424A59] font-normal">
                      Account Number:
                    </p>
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
              <div className="my-5">
                <SecurityBanner
                  text="For security reasons, deposits are only accepted from bank accounts that match the name on your Bisats account. Transactions from accounts with different names may be delayed or rejected. "
                  alertType="danger"
                />
              </div>
              <PrimaryButton
                text={"I have made payment"}
                loading={loading?.confirmed}
                className="w-full"
                onClick={() => ConfirmPayment("confirmed")}
              />
              <WhiteTransparentButton
                text={"Cancel"}
                loading={loading?.cancel}
                className="w-full mt-3"
                onClick={() => ConfirmPayment("cancel")}
              />
            </>
          ) : (
            <>
              <div className="h-fit border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] p-2  my-5 text-[14px] leading-[24px] ">
                <div>
                  <MultiSelectDropDown
                    placeholder={"Select a bank for payment"}
                    choices={banks}
                    error={undefined}
                    touched={undefined}
                    label={"Select Bank"}
                    handleChange={(prop) => setSelectedBankID(prop)}
                    value={selectedBankID}
                    defaultLabelDisplay
                  />
                </div>
              </div>
              <PrimaryButton
                text={"Proceed"}
                loading={loading.topUp}
                className="w-full "
                onClick={() => onIntiateTopUp()}
                disabled={!selectedBankID}
              />
              <WhiteTransparentButton
                text={"Cancel"}
                loading={false}
                className="w-full mt-3"
                onClick={() => navigate(-1)}
              />
            </>
          )}
        </div>
      </div>
      <ModalTemplate
        onClose={() => {}}
        isOpen={showPendindModal}
        showCloseButton={false}
      >
        <div>
          <div className="bg-neutral-50 rounded-full border size-12 grid place-content-center">
            <Timer className="text-amber-400 size-6" />
          </div>
          <h4 className="font-semibold text-xl mt-2">Pending Confirmation</h4>
          <p className="text-sm text-gray-600">
            Your wallet would be credited once the transaction is confirmed .
          </p>
          <Link
            to={APP_ROUTES.WALLET.HOME}
            replace
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full mt-6",
            )}
          >
            Back to wallet
          </Link>
        </div>
      </ModalTemplate>
    </>
  );
};

export default TransactionBreakdown;
