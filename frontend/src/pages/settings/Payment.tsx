import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import AddWithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import DeleteWithdrawalAccount from "@/components/Modals/DeleteWithdrawalAccount";
import EditWithdrawalBankAccount from "@/components/Modals/EditWithDrawalBank";
import { GetWallet } from "@/redux/actions/walletActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { Plus } from "lucide-react";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";

const Payment = () => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);

  const wallet = walletState?.wallet;
  // const [openDeleteBankAccount, setOpenDeleteBankAccount] = useState(false);
  // const [openAddBankAccount, setOpenAddBankAccount] = useState(false);
  // const [openEditBankAccount, setOpenEditBankAccount] = useState(false);
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
    }) => ({
      id: bank?.id,
      accountNumber: bank?.accountNumber,
      accountName: bank?.accountName,
      bankName: bank?.bankName,
    })
  );

  return (
    <div>
      <div className="flex justify-between my-5">
        <h2 className="text-[18px] lg:text-[18px] font-semibold text-[#2B313B]">
          Withdrawal Accounts
        </h2>
        <WhiteTransparentButton
          text={
            <>
              <Plus className="size-4" />
              Add
            </>
          }
          size="sm"
          className="w-[6rem]"
          loading={false}
          onClick={() => setOpenModal((prev) => ({ ...prev, add: true }))}
        />
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

      <WithdrawalBankAccount
        close={() => {
          setOpenModal((prev) => ({ ...prev, edit: false, add: false }));
        }}
        open={openModal.add || openModal.edit}
        mode={openModal.add ? "add" : "edit"}
        defaultBank={selectedBank}
      />
      {/* {openEditBankAccount && (
        <EditWithdrawalBankAccount
          close={() => setOpenEditBankAccount(false)}
          bank={selectedBank}
        />
      )} */}
    </div>
  );
};

export default Payment;
