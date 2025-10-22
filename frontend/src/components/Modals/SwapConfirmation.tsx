import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { APP_ROUTES } from "@/constants/app_route";
import { GetWallet } from "@/redux/actions/walletActions";
import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const SwapConfirmation: React.FC<Props> = ({
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
  const [error, setError] = useState<string | null>(null);
  const [fees, setFees] = useState({
    network: "",
    transaction: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isBuy = orderType.toLowerCase() === "buy";

  // HDR: Fetch network fee
  const fetchNetworkFee = async () => {
    if (!amount) return null;
    setError(null);

    try {
      const amountVal = parseFloat(receiveAmount).toFixed(isBuy ? 8 : 2);
      const amountValue = new Decimal(amountVal).toNumber();

      const response = await Bisatsfetch(
        `/api/v1/user/${userId}/ads/${adsId}/networkFee`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            amount: amountValue,
          }),
        }
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
    try {
      const amountVal = parseFloat(
        adType.toLowerCase() !== "buy" ? amount : receiveAmount
      );

      const amountValue = new Decimal(amountVal).toNumber();

      const response = await Bisatsfetch(
        `/api/v1/user/${userId}/ads/${adsId}/order`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            amount: amountValue,
            networkFee: feeData.networkFee,
            transactionFee: feeData.transactionFee,
          }),
        }
      );

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

  const handleConfirmTransaction = async () => {
    try {
      const feeData = await fetchNetworkFee();
      if (!feeData.status) {
        throw new Error(feeData?.message);
      }

      const orderResult = await placeOrder(feeData);
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

      GetWallet();

      navigate(APP_ROUTES.P2P.RECEIPT, {
        state: {
          ...response.data,
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
                  decimal: isBuy ? 2 : token?.toLowerCase() === "usdt" ? 2 : 8,
                }).format(Number(amount))}{" "}
                {token}
              </p>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[#424A59] font-normal">You'll receive:</p>
              <p className="text-[#606C82] font-semibold">
                {formatter({ decimal: isBuy ? 8 : 2 }).format(
                  Number(receiveAmount)
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

          <div className="w-full">
            <PrimaryButton
              text={`Confirm ${isBuy ? "Buy" : "Sell"}`}
              loading={!mutation.isError && mutation.isPending}
              style={{ width: "100%" }}
              onClick={() => {
                if (mutation.isError) mutation.reset();
                mutation.mutate();
              }}
              disabled={mutation.isPending}
            />
          </div>

          <div className="text-[#515B6E] text-xs gap-1 font-normal text-center mt-5 flex items-center justify-center">
            <TriangleAlert className="text-[#F5BB00] size-5" />
            <p>This action is not reversable</p>
          </div>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default SwapConfirmation;
