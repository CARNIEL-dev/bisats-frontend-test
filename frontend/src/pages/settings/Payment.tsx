import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import DeleteWithdrawalAccount from "@/components/Modals/DeleteWithdrawalAccount";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import DeleteWalletAddressModal from "@/components/Modals/DeleteWalletAddressModal";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import CopyButton from "@/components/shared/CopyButton";
import SecurityBanner from "@/components/shared/SecurityBanner";
import StatusBadge from "@/components/shared/StatusBadge";
import TextBox from "@/components/shared/TextBox";
import { APP_ROUTES } from "@/constants/app_route";
import KycManager from "@/pages/kyc/KYCManager";
import { rehydrateUser } from "@/redux/actions/userActions";
import { ACTIONS } from "@/utils/transaction_limits";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const user = useSelector((state: RootState) => state.user);

  const isCorporateRejected =
    user.user?.cooperateAccountVerificationRequest?.status === "rejected";

  const isCorporatePending =
    user.user?.cooperateAccountVerificationRequest?.status === "pending";

  const navigate = useNavigate();

  const [selectedBank, setSelectedBank] = useState<TBank>();
  const [selectWalletAddress, setSelectWalletAddress] =
    useState<TUserWalletAddress>();

  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    if (isCorporatePending) {
      rehydrateUser({
        userId: user.user?.userId,
        token: user.user?.token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userBanks = useMemo(() => {
    const userBanks = user.user?.bankAccounts || [];
    const depositBanks = userBanks.filter(
      (bank: TBank & { bankAccountType: string }) =>
        bank.bankAccountType === "deposit",
    );
    const withdrawalBanks = userBanks.filter(
      (bank: TBank & { bankAccountType: string }) =>
        bank.bankAccountType === "withdrawal",
    );

    const WalletAddress = user.user?.withdrawalAddresses?.map(
      (item: TUserWalletAddress) => {
        return {
          id: item?.id,
          address: item?.address,
          network: item?.network,
          name: item?.name,
          asset: item?.asset,
        };
      },
    );

    return { depositBanks, withdrawalBanks, WalletAddress };
  }, [user.user?.bankAccounts, user.user?.withdrawalAddresses]);

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h2 className="text-[18px] lg:text-[18px] font-semibold ">Accounts</h2>

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
          {!user.user?.cooperateAccountVerificationRequest?.businessName && (
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
                      {user.user?.cooperateAccountVerificationRequest
                        ?.status === "pending" ? (
                        "Corporate Account Pending"
                      ) : (
                        <>
                          <Plus className="size-4" />
                          Add Corporate Account
                        </>
                      )}
                    </>
                  }
                  size="sm"
                  className="w-fit"
                  loading={false}
                  onClick={() => {
                    validateAndExecute();
                  }}
                  disabled={
                    user.user?.cooperateAccountVerificationRequest?.status ===
                    "pending"
                  }
                />
              )}
            </KycManager>
          )}
        </div>
      </div>
      {isCorporateRejected && (
        <div className="flex items-center gap-2 mb-6">
          <StatusBadge status="rejected" />
          <p className="text-muted-foreground text-sm">
            Your corporate information has been rejected.
          </p>
        </div>
      )}

      {userBanks.depositBanks?.length > 0 && (
        <div>
          <h4 className="font-semibold">Deposit Account</h4>
          <div className="bg-neutral-50 dark:bg-secondary rounded-[8px] p-3 md:px-8 px-4 my-5">
            {userBanks.depositBanks?.map((details: TBank, idx: number) => (
              <div
                key={idx}
                className="border-b border-muted-foreground/20 my-2 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[14px] leading-[24px] font-normal text-muted-foreground">
                    Account {idx + 1}
                  </p>
                </div>
                <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
                  <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                    <TextBox
                      label="Account Name"
                      value={details?.accountName}
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                  <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                    <TextBox
                      label="Account Number"
                      value={
                        <div className="flex items-center gap-1 bg-background rounded-md pl-3 pr-1 py-1 border border-primary/20">
                          <span className="text-muted-foreground">
                            {details?.accountNumber}
                          </span>
                          <CopyButton
                            text={details?.accountNumber}
                            title="Copy account number"
                            type="code"
                          />
                        </div>
                      }
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                  <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                    <TextBox
                      label="Bank Name"
                      value={details?.bankName}
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}

            <SecurityBanner
              text={`Deposits can only be made from the registered name on your Bisats account.\nYou may also deposit using the corporate account that has been added to your profile.\nA ₦1,000 processing fee is required, as mandated by the third‑party bank.\nPlease do not process more than ₦100,000,000 (100 million) in a single transaction.\nProcessing time may take up to 2 minutes.`}
            />
          </div>
        </div>
      )}

      {userBanks.withdrawalBanks?.length > 0 && (
        <div>
          <h4 className="font-semibold">Withdrawal Account</h4>
          <div className="bg-neutral-50 dark:bg-secondary rounded-[8px] p-3 md:px-8 px-4 my-5">
            {userBanks.withdrawalBanks?.map((details: TBank, idx: number) => (
              <div
                className="border-b border-muted-foreground/20 my-2 last:border-0"
                key={idx}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[14px] leading-[24px] font-normal text-muted-foreground">
                    Account {idx + 1}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] font-semibold">
                    <button
                      type="button"
                      className="text-muted-foreground"
                      onClick={() => {
                        setSelectedBank(details);
                        setOpenModal((prev) => ({ ...prev, edit: true }));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-destructive "
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
                    <TextBox
                      label="Account Name"
                      value={details?.accountName}
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                  <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                    <TextBox
                      label="Account Number"
                      value={details?.accountNumber}
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                  <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                    <TextBox
                      label="Bank Name"
                      value={details?.bankName}
                      direction="column"
                      showIndicator={false}
                      labelClass="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userBanks?.WalletAddress?.length > 0 && (
        <div>
          <h4 className="font-semibold">Wallet Address</h4>
          <div className="bg-neutral-50 dark:bg-secondary rounded-[8px] p-3 md:px-8 px-4 my-5">
            {userBanks?.WalletAddress?.map(
              (details: TUserWalletAddress, idx: number) => (
                <div
                  key={idx}
                  className="border-b border-muted-foreground/20 my-2 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] leading-[24px] font-normal text-muted-foreground capitalize">
                      {details.name}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-semibold">
                      <button
                        type="button"
                        className="text-[#B91C1B] "
                        onClick={() => {
                          setSelectWalletAddress(details);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
                    <div className="my-3 lg:my-0 text-left w-full lg:w-fit">
                      <TextBox
                        label="Wallet Address"
                        value={details?.address}
                        direction="column"
                        showIndicator={false}
                        labelClass="text-xs"
                      />
                    </div>
                    <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                      <TextBox
                        label="Asset"
                        value={details?.asset}
                        direction="column"
                        showIndicator={false}
                        labelClass="text-xs"
                      />
                    </div>
                    <div className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                      <TextBox
                        label="Network"
                        value={details?.network}
                        direction="column"
                        showIndicator={false}
                        labelClass="text-xs"
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* HDR: MODALS */}
      {openModal.delete && (
        <DeleteWithdrawalAccount
          close={() => setOpenModal((prev) => ({ ...prev, delete: false }))}
          bank={selectedBank}
        />
      )}
      {selectWalletAddress?.id && (
        <DeleteWalletAddressModal
          close={() => setSelectWalletAddress(undefined)}
          wallet={selectWalletAddress}
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
