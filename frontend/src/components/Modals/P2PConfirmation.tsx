import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import Switch from "@/components/Switch";
import Toast from "@/components/Toast";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { APP_ROUTES } from "@/constants/app_route";
import useGetWallet from "@/hooks/use-getWallet";
import KycManager from "@/pages/kyc/KYCManager";
import { GetUserDetails } from "@/redux/actions/userActions";
import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { ACTIONS } from "@/utils/transaction_limits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { TriangleAlert, Wallet } from "lucide-react";
import React, { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MaxWidth from "@/components/shared/MaxWith";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props {
  close: () => void;
  orderType: string;
  amount: string;
  receiveAmount: string;
  fee: string;
  token: string | undefined;
  currency: string;
  userId: string;
  adsId: string;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  adType: string;
}

const P2PConfirmation: React.FC<Props> = ({
  close,
  orderType,
  amount,
  receiveAmount,
  fee,
  token,
  currency,
  userId,
  adsId,
  setShowConfirmation,
  adType,
}) => {
  const [securePin, setSecurePin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fees, setFees] = useState({
    network: "",
    transaction: "",
  });

  // Bank payout state
  const [sendToBank, setSendToBank] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { refetchWallet } = useGetWallet();

  // Get user from Redux store
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const isBuy = orderType.toLowerCase() === "buy";

  // HDR: Get user bank list for payout
  const userBankList = useMemo(() => {
    const bankAccounts = user?.bankAccounts;
    const userbank = bankAccounts?.filter(
      (ba: any) => ba?.bankAccountType === "withdrawal",
    );
    if (!userbank) return [];
    return userbank?.map((choice: any) => ({
      label: (
        <div className="text-sm flex flex-col">
          <p>{choice?.bankName}</p>
          <p className="my-1">{choice?.accountNumber}</p>
          <p>{choice?.accountName}</p>
        </div>
      ),
      labelDisplay: (
        <div className="text-sm flex items-center gap-2">
          <p className="text-xs">{choice?.bankName}</p>
          <p> - {choice?.accountNumber}</p>
        </div>
      ),
      value: choice?.id,
    }));
  }, [user?.bankAccounts]);

  // HDR: Show add bank modal if no banks and sendToBank is true
  useEffect(() => {
    if (sendToBank && !userBankList?.length) {
      setShowAddBankModal(true);
    }
  }, [sendToBank, userBankList]);

  // HDR: Fetch network fee
  const fetchNetworkFee = async () => {
    if (!amount) return null;
    if (!securePin) {
      Toast.error("Please enter your transaction pin", "Error");
      return null;
    }
    setError(null);

    try {
      const amountVal = parseFloat(receiveAmount).toFixed(isBuy ? 8 : 2);
      const amountValue = new Decimal(amountVal).toNumber();

      const response = await Bisatsfetch(
        `/api/v1/user/ads/${adsId}/networkFee`,
        {
          method: "POST",
          body: JSON.stringify({
            amount: amountValue,
            transactionPin: securePin,
          }),
        },
      );
      if (response.status) {
        setFees({
          network: response?.data?.networkFee,
          transaction: response?.data?.transactionFee,
        });
        return response;
      } else {
        setError("Failed to fetch network fee: " + response.message);
        return response;
      }
    } catch (err) {
      console.error("Error fetching network fee:", err);
      setError("Failed to fetch network fee. Please try again.");
      return null;
    }
  };

  //   HDR: Place order
  const placeOrder = async (feeData: any) => {
    if (!amount) return;
    if (!securePin) {
      Toast.error("Please enter your transaction pin", "Error");
      return;
    }
    try {
      const amountVal = parseFloat(
        adType.toLowerCase() !== "buy" ? amount : receiveAmount,
      );

      const amountValue = new Decimal(amountVal).toNumber();

      const response = await Bisatsfetch(`/api/v1/user/ads/${adsId}/order`, {
        method: "POST",
        body: JSON.stringify({
          // userId: userId,
          amount: amountValue,
          transactionPin: securePin,
          // networkFee: feeData.networkFee,
          // transactionFee: feeData.transactionFee,
        }),
      });

      if (response.status) {
        return {
          success: true,
          data: response.data,
          message: "Order placed successfully",
        };
      } else {
        return { success: false, message: response.message, data: null };
      }
    } catch (err) {
      console.error("Error placing order:", err);
      return { success: false, message: "Failed to place order.", data: null };
    }
  };

  //   HDR: Sell with payout (direct to bank)
  const sellWithPayout = async () => {
    if (!amount) return;
    if (!securePin) {
      Toast.error("Please enter your transaction pin", "Error");
      return;
    }
    if (!selectedBankId) {
      Toast.error("Please select a bank account", "Error");
      return;
    }
    try {
      const amountVal = parseFloat(
        adType.toLowerCase() !== "buy" ? amount : receiveAmount,
      );

      const amountValue = new Decimal(amountVal).toNumber();

      const response = await Bisatsfetch(`/api/v1/user/ads/sell-with-payout`, {
        method: "POST",
        body: JSON.stringify({
          amount: amountValue,
          transactionPin: securePin,
          bankAccountId: selectedBankId,
          adsId,
        }),
      });

      if (response.status) {
        return {
          success: true,
          data: response.data,
          message: "Order placed successfully",
        };
      } else {
        return { success: false, message: response.message, data: null };
      }
    } catch (err) {
      console.error("Error placing order with payout:", err);
      return { success: false, message: "Failed to place order.", data: null };
    }
  };

  const handleConfirmTransaction = async () => {
    try {
      let orderResult;

      // If sendToBank is true and it's a SELL order (not buy), use sellWithPayout
      if (sendToBank && !isBuy) {
        orderResult = await sellWithPayout();
      } else {
        // Original flow - fetch network fee and place order
        const feeData = await fetchNetworkFee();
        if (!feeData.status) {
          throw new Error(feeData?.message);
        }
        orderResult = await placeOrder(feeData);
      }

      if (!orderResult?.success) {
        throw new Error(orderResult?.message);
      }
      return orderResult;
    } catch (err) {
      throw err;
    }
  };

  //HDR: Mutation function
  const mutation = useMutation<any, Error>({
    mutationFn: handleConfirmTransaction,
    onSuccess(response, _) {
      Toast.success(response.message ?? "Transaction successful", "Success");
      queryClient.invalidateQueries({
        queryKey: [
          "searchAds",
          {
            asset: "USDT",
            type: isBuy ? "buy" : "Sell",
          },
          {
            page: 1,
            limit: 10,
            skip: 0,
          },
          userId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["userNotifications", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["searchAds"],
        exact: false,
      });

      refetchWallet();

      navigate(APP_ROUTES.P2P.RECEIPT, {
        state: {
          ...response.data,
          sendToBank,
        },
      });

      setShowConfirmation(false);
      setFees({
        network: "",
        transaction: "",
      });
    },
    onError(err) {
      setError(err.message);
      Toast.error(err.message || "Failed to update ad status", "Failed");
    },
  });

  return (
    <>
      <ModalTemplate onClose={close}>
        <div className="flex flex-col justify-center w-full mx-auto">
          <div>
            <h1
              className={` ${
                isBuy ? "text-[#17A34A]" : "text-[#DC2625]"
              } text-[22px]  font-semibold text-left mt-2`}
            >
              {isBuy ? "Buy" : "Sell"} {isBuy ? currency : token}
            </h1>
            <div className="h-fit  border border-[#F9F9FB] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px]">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[#424A59] font-normal">Amount:</p>
                <p className="text-[#606C82] font-semibold">
                  {formatter({
                    decimal: isBuy
                      ? 2
                      : token?.toLowerCase() === "usdt"
                        ? 2
                        : 8,
                  }).format(Number(amount))}{" "}
                  {token}
                </p>
              </div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[#424A59] font-normal">You'll receive:</p>
                <p className="text-[#606C82] font-semibold">
                  {formatter({ decimal: isBuy ? 8 : 2 }).format(
                    Number(receiveAmount),
                  )}{" "}
                  {currency}
                </p>
              </div>
              {isBuy && (
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[#424A59] font-normal">Fee:</p>
                  <p className="text-[#606C82] font-semibold">{fee} xNGN</p>
                </div>
              )}
              {fees.network && (
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[#424A59] font-normal">Network Fee:</p>
                  <p className="text-[#606C82] font-semibold">
                    {formatNumber(fees.network)}
                  </p>
                </div>
              )}
              {fees.transaction && (
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[#424A59] font-normal">Transaction Fee:</p>
                  <p className="text-[#606C82] font-semibold">
                    {formatNumber(fees.transaction)}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-[14px] font-normal mb-4 p-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Send to Bank Option - Only show for SELL orders (not buy) */}
            {!isBuy && (
              <div className="mt-4 mb-6">
                <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#1F2937]">
                      Send directly to bank
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Receive payment directly in your bank account
                    </p>
                  </div>
                  <Switch
                    checked={sendToBank}
                    onCheckedChange={(checked) => {
                      setSendToBank(checked);
                    }}
                  />
                </div>

                {/* Bank Selection - Show when sendToBank is ON */}

                <Activity
                  mode={!sendToBank ? "hidden" : "visible"}
                  name="bank-selection"
                >
                  <div className="mt-4">
                    {userBankList?.length > 0 ? (
                      <MultiSelectDropDown
                        parentId={"p2p-bank-select"}
                        placeholder={"Select Bank"}
                        choices={userBankList}
                        error={undefined}
                        touched={undefined}
                        label={"Select Withdrawal Bank"}
                        handleChange={(bankId) => {
                          setSelectedBankId(bankId);
                        }}
                        value={selectedBankId}
                        defaultLabelDisplay
                      />
                    ) : (
                      <div className="h-[6rem] pt-6 flex flex-col gap-4">
                        <ErrorDisplay
                          message="You have not added a withdrawal account yet."
                          isError={false}
                          showIcon={false}
                          capitalize={false}
                        />
                        <WhiteTransparentButton
                          text={"Add Withdrawal Account"}
                          loading={false}
                          onClick={() => setShowAddBankModal(true)}
                          className="w-fit px-4 py-1 mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </Activity>
              </div>
            )}

            <div className="w-full">
              <KycManager
                action={ACTIONS.P2P_TRANSFER}
                func={(secureData?: Record<string, string>) => {
                  if (secureData) {
                    setSecurePin(secureData.pin);
                  }

                  if (mutation.isError) mutation.reset();
                  mutation.mutate();
                }}
                isManual
              >
                {(validateAndExecute) => (
                  <PrimaryButton
                    text={`Confirm ${isBuy ? "Buy" : "Sell"}`}
                    loading={!mutation.isError && mutation.isPending}
                    style={{ width: "100%" }}
                    onClick={validateAndExecute}
                    disabled={mutation.isPending}
                  />
                )}
              </KycManager>
            </div>

            <div className="text-[#515B6E] text-xs gap-1 font-normal text-center mt-5 flex items-center justify-center">
              <TriangleAlert className="text-[#F5BB00] size-5" />
              <p>This action is not reversable</p>
            </div>
          </div>
        </div>
      </ModalTemplate>
      {/* Add Bank Modal */}
      {/* <ModalTemplate
        isOpen={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        primary={false}
      >
        <WithdrawalBankAccount
          key={"Add-bank-for-auto-payout"}
          mode="add"
          close={() => {
            setShowAddBankModal(false);
            // Refresh user data to get new bank
            GetUserDetails({
              userId: user?.userId,
              token: user?.token,
            }).then(() => {
              refetchWallet();
            });
          }}
        />
      </ModalTemplate> */}
      <Sheet open={showAddBankModal} onOpenChange={setShowAddBankModal}>
        <SheetContent className="md:!max-w-xl">
          <SheetHeader className="hidden">
            <SheetTitle>Withdrawal bank</SheetTitle>
            <SheetDescription>Add a withdrawal bank</SheetDescription>
          </SheetHeader>

          <MaxWidth className="mt-10">
            <div className="w-fit p-5 rounded-full bg-primary/50 border border-primary">
              <Wallet />
            </div>
            <WithdrawalBankAccount
              key={"Add-bank-for-auto-payout"}
              mode="add"
              close={() => {
                setShowAddBankModal(false);
                // Refresh user data to get new bank
                GetUserDetails({
                  userId: user?.userId,
                  token: user?.token,
                }).then(() => {
                  refetchWallet();
                });
              }}
            />
          </MaxWidth>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default P2PConfirmation;
