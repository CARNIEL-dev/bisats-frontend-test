import React, { useState } from "react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { typeofSwam } from "@/pages/p2p/components/Swap";
import { formatNumber } from "@/utils/numberFormat";
import { TriangleAlert } from "lucide-react";
import Bisatsfetch from "@/redux/fetchWrapper";
import Toast from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/app_route";
import { formatter } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  close: () => void;
  type: typeofSwam;
  amount: string;
  receiveAmount: string;
  fee: string;
  token: string | undefined;
  currency: string;
  userId: string;
  adsId: string;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwapConfirmation: React.FC<Props> = ({
  close,
  type,
  amount,
  receiveAmount,
  fee,
  token,
  currency,
  userId,
  adsId,
  setShowConfirmation,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState({
    network: "",
    transaction: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // HDR: Fetch network fee
  const fetchNetworkFee = async () => {
    if (!amount) return null;

    try {
      const amountValue = parseFloat(amount);

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
      const amountValue = parseFloat(
        type !== typeofSwam.Buy ? amount : receiveAmount
      );
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
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error placing order:", err);
      return { success: false, message: "Failed to place order." };
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
            type: type === typeofSwam.Buy ? "buy" : "Sell",
          },
          {
            page: 1,
            limit: 10,
            skip: 0,
          },
          userId,
        ],
      });
      navigate(
        `${APP_ROUTES.P2P.HOME}?type=${
          type === typeofSwam.Buy ? "buy" : "Sell"
        }&asset=${type === typeofSwam.Sell ? currency : token}`
      );
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

  console.log(mutation.error, mutation.isError, mutation.isPending);

  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full mx-auto">
        <div>
          <h1
            className={` ${
              type === typeofSwam.Buy ? "text-[#17A34A]" : "text-[#DC2625]"
            } text-[22px]  font-semibold text-left mt-2`}
          >
            {type === typeofSwam.Buy ? `Buy ${token}` : `Sell ${currency}`}
          </h1>
          <div className="h-fit  border border-[#F9F9FB] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px]">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[#424A59] font-normal">Amount:</p>
              <p className="text-[#606C82] font-semibold">
                {formatter({ decimal: type === typeofSwam.Buy ? 0 : 4 }).format(
                  Number(amount)
                )}{" "}
                {currency}
              </p>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[#424A59] font-normal">You'll receive:</p>
              <p className="text-[#606C82] font-semibold">
                {formatter({
                  decimal: type === typeofSwam.Sell ? 0 : 4,
                }).format(Number(receiveAmount))}{" "}
                {token}
              </p>
            </div>
            {type === typeofSwam.Buy && (
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-[#424A59] font-normal">Fee:</p>
                <p className="text-[#606C82] font-semibold">
                  {fee} {token}
                </p>
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
              text={`Confirm ${type === typeofSwam.Buy ? "Buy" : "Sell"}`}
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
