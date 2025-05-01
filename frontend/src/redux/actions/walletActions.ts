/** @format */

import { useSelector } from "react-redux";
import { getToken, getUser } from "../../helpers";
import { T2FARequest, TDeleteWithdrawalRequest, TTopUpNGN, TWithdrawalBankAccount, TWithdrawalRequest } from "../../types/wallet";
import { BACKEND_URLS } from "../../utils/backendUrls";
import dispatchWrapper from "../../utils/dispatchWrapper";
import Bisatsfetch from "../fetchWrapper";
import { WalletActionypes } from "../types";
import { UserState } from "../reducers/userSlice";

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
    console.log(response)
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
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/payment/${payload.paymentId}${BACKEND_URLS.WALLET.CONFIRM_TOPUP}`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          userId: payload.userId,
          status: payload.status,
        }),
      }
    );
    const data = response;
    console.log(data);
    return data as any;
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

export const GetUserBank = async (userId:string) => {
   
   try {
     const response = await Bisatsfetch(
       `/api/v1/user/${userId}${BACKEND_URLS?.WALLET.MY_BANKS}`,
       {
         method: "GET",
       }
     );
     const data = response.data;
     return data
   } catch (error) {
     // logoutUser();
     // throw handleApiError(error);
     return error;
   }
}

export const GetBankList = async (userId:string) => {
 
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${userId}${BACKEND_URLS?.WALLET?.LIST_BANKS}`,
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


export const AddBankAccountForWithdrawal = async (payload: TWithdrawalBankAccount) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.WALLET.ADD_BANK_ACCOUNT}`,
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

export const EditBankAccountForWithdrawal = async (
  payload: TWithdrawalBankAccount
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/bank/${payload.bankId}${BACKEND_URLS.WALLET.EDIT_BANK_ACCOUNT}`,
      {
        method: "PUT",
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

export const DeleteBankAccountForWithdrawal = async (
  payload: TDeleteWithdrawalRequest
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/bank/${payload.bankAccountId}${BACKEND_URLS.WALLET.DELE_BANK_ACCOUNT}`,
      {
        method: "DELETE",
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
export const Withdraw_xNGN = async (
  payload: TWithdrawalRequest
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.WALLET.WITHDRAW}`,
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


export const TwoFactorAuth = async (payload: T2FARequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.VALIDATE_2FA}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response;
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};