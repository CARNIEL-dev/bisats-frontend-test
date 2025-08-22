import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import DeleteWithdrawalAccount from "@/components/Modals/DeleteWithdrawalAccount";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import { GetWallet } from "@/redux/actions/walletActions";
import { Plus } from "lucide-react";
import KycManager from "@/pages/kyc/KYCManager";
import { ACTIONS } from "@/utils/transaction_limits";
import { APP_ROUTES } from "@/constants/app_route";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const reduxState: RootState = useSelector((state: any) => state);

  const wallet = reduxState.wallet.wallet;
  const user = reduxState.user;

  const navigate = useNavigate();

  const [selectedBank, setSelectedBank] = useState<TBank>();
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    GetWallet();
  }, [openModal.add, openModal.edit, openModal.delete]);

  const BankDetails = wallet?.bankAccount.map(
    (bank: {
      id: string;
      accountNumber: string;
      accountName: string;
      bankName: string;
      bankCode: string;
    }) => ({
      id: bank?.id,
      accountNumber: bank?.accountNumber,
      accountName: bank?.accountName,
      bankName: bank?.bankName,
      bankCode: bank?.bankCode,
    })
  );

  return (
    <div>
      <div className="flex justify-between my-5">
        <h2 className="text-[18px] lg:text-[18px] font-semibold text-[#2B313B]">
          Withdrawal Accounts
        </h2>

        <div className="flex items-center flex-wrap justify-end gap-2">
          <KycManager
            action={ACTIONS.ADD_BANK}
            func={() => {
              setOpenModal((prev) => ({ ...prev, add: true }));
            }}
          >
            {(validateAndExecute) => (
              <WhiteTransparentButton
                text={
                  <>
                    <Plus className="size-4" />
                    Add Bank
                  </>
                }
                size="sm"
                className="w-fit"
                loading={false}
                onClick={() => {
                  validateAndExecute();
                }}
              />
            )}
          </KycManager>
          {!user.user?.cooperateAccountVerificationRequest?.id && (
            <KycManager
              action={ACTIONS.ADD_CORPORATE_BANK}
              func={() => {
                navigate(APP_ROUTES.SETTINGS.CORPORATE);
              }}
            >
              {(validateAndExecute) => (
                <WhiteTransparentButton
                  text={
                    <>
                      <Plus className="size-4" />
                      Add Corporate Account
                    </>
                  }
                  size="sm"
                  className="w-fit"
                  loading={false}
                  onClick={() => {
                    validateAndExecute();
                  }}
                />
              )}
            </KycManager>
          )}
        </div>
      </div>

      {BankDetails.map((details: TBank, idx: number) => (
        <div className="bg-[#F9F9FB] rounded-[8px] p-3 px-10 my-5" key={idx}>
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[24px] font-normal text-[#2B313B]">
              Account {idx + 1}
            </p>
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <button
                type="button"
                className="text-[#515B6E]"
                onClick={() => {
                  setSelectedBank(details);
                  setOpenModal((prev) => ({ ...prev, edit: true }));
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-[#B91C1B] "
                onClick={() => {
                  setSelectedBank(details);
                  setOpenModal((prev) => ({ ...prev, delete: true }));
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
            <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
              <p className="text-xs text-[#515B6E] mb-2"> Account Name</p>
              <p className="text-xs font-normal text-[#2B313B]">
                {details?.accountName}
              </p>
            </div>
            <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
              <p className="text-xs text-[#515B6E] mb-2"> Account Number</p>
              <p className="text-xs font-normal text-[#2B313B]">
                {details?.accountNumber}
              </p>
            </div>
            <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
              <p className="text-xs text-[#515B6E] mb-2"> Bank Name</p>
              <p className="text-xs font-normal text-[#2B313B]">
                {details?.bankName}
              </p>
            </div>
          </div>
        </div>
      ))}

      {openModal.delete && (
        <DeleteWithdrawalAccount
          close={() => setOpenModal((prev) => ({ ...prev, delete: false }))}
          bank={selectedBank}
        />
      )}

      <ModalTemplate
        isOpen={openModal.add || openModal.edit}
        onClose={() =>
          setOpenModal((prev) => ({ ...prev, edit: false, add: false }))
        }
        primary={false}
      >
        <WithdrawalBankAccount
          mode={openModal.add ? "add" : "edit"}
          defaultBank={openModal.edit ? selectedBank : undefined}
          close={() =>
            setOpenModal((prev) => ({ ...prev, add: false, edit: false }))
          }
        />
      </ModalTemplate>
    </div>
  );
};

export default Payment;
