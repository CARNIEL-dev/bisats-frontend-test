/** @format */

import { getToken, getUser } from "../../helpers";
import { TTopUpNGN } from "../../types/wallet";
import { BACKEND_URLS } from "../../utils/backendUrls";
import dispatchWrapper from "../../utils/dispatchWrapper";
import Bisatsfetch from "../fetchWrapper";
import { WalletActionypes } from "../types";

export const GetWallet = async () => {
  const user = getUser();
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${user.userId}${BACKEND_URLS.WALLET.GET_WALLET}`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    if (response.status) {
      dispatchWrapper({
        type: WalletActionypes.GET_WALLET,
        payload: data,
      });
      return data;
    } else {
      // logoutUser();
    }
  } catch (error) {
    // logoutUser();
    // throw handleApiError(error);
    return error;
  }
};

export const DepositTranscBreakDown = async (payload: TTopUpNGN) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.WALLET.TRANSC_BREAKDOWN}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response;
    console.log(data);
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const ConfirmDeposit = async (payload: {
  userId: string;
  status: string;
  paymentId: string;
}) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}/payment/${payload.paymentId}${BACKEND_URLS.WALLET.CONFIRM_TOPUP}`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          // userId: payload.userId,
          status: payload.status,
        }),
      }
    );
    const data = response;
    console.log(data);
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const GetLivePrice = () => {
  //dummy data crypto/USDT
  return {
    xNGN: 1500,
    BTC: 96336,
    SOL: 171.44,
    ETH: 2808,
    USDT: 1.002,
  };
};

export const TopUpNGNBalance = async (payload: TTopUpNGN) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.WALLET.TOPUPNGN}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response;
    console.log(data);
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const GetBankList = async () => {
  const user = getUser();

  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${user.userId}${BACKEND_URLS.WALLET.LIST_BANKS}`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    if (response.status) {
      return data;
    } else {
      // logoutUser();
    }
  } catch (error) {
    // logoutUser();
    // throw handleApiError(error);
    return error;
  }
};