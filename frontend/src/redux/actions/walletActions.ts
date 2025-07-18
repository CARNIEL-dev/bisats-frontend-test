/** @format */

import {
  getToken,
  getUser,
  setLivePrices,
  setUserTokenData,
} from "../../helpers";
import {
  T2FARequest,
  TAddSearchRequest,
  TCreateAdsRequest,
  TCryptoWithdrawalRequest,
  TDeleteWithdrawalRequest,
  TPayloadTransHistory,
  TTopUpNGN,
  TWithdrawalBankAccount,
  TWithdrawalRequest,
} from "../../types/wallet";
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
    console.log(response);
    if (response.status) {
      dispatchWrapper({
        type: WalletActionypes.GET_WALLET,
        payload: data,
      });
      const asset_list = transformAssets(data?.cryptoAssests);
      setUserTokenData(asset_list);
      return data;
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
export const GetLivePrice = async () => {
  const endpoint =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd,ngn";

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const prices = {
      xNGN: data.tether.ngn, // NGN price of USDT
      BTC: data.bitcoin.usd, // USD price of Bitcoin
      SOL: data.solana.usd, // USD price of Solana
      ETH: data.ethereum.usd, // USD price of Ethereum
      USDT: data.tether.usd, // USD price of Tether (USDT)
      BTC_TEST: 0,
      SOL_TEST: 0,
      ETH_TEST5: 0,
      USDT_ETH_TEST5_KDZ7: 0,
      TRX_TEST: 0,
      USDT_TRX_TEST: 0,
      USDT_SOL_TEST: 0,
      USDT_TRC20: 0,
      USDT_SOL: 0,
      TRX: 0,
      USDT_TRX: 0,
    };
    setLivePrices(JSON.stringify(prices));
    return prices;
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    setLivePrices(
      JSON.stringify({
        xNGN: 1500,
        BTC: 96336,
        SOL: 171.44,
        ETH: 2808,
        USDT: 1.002,
        BTC_TEST: 0,
        SOL_TEST: 0,
        ETH_TEST5: 0,
        USDT_ETH_TEST5_KDZ7: 0,
        TRX_TEST: 0,
        USDT_TRX_TEST: 0,
        USDT_SOL_TEST: 0,
        USDT_TRC20: 0,
        USDT_SOL: 0,
        TRX: 0,
        USDT_TRX: 0,
      })
    );

    return {
      xNGN: 1500,
      BTC: 96336,
      SOL: 171.44,
      ETH: 2808,
      USDT: 1.002,
      BTC_TEST: 0,
      SOL_TEST: 0,
      ETH_TEST5: 0,
      USDT_ETH_TEST5_KDZ7: 0,
      TRX_TEST: 0,
      USDT_TRX_TEST: 0,
      USDT_SOL_TEST: 0,
      USDT_TRC20: 0,
      USDT_SOL: 0,
      TRX: 0,
      USDT_TRX: 0,
    };
  }
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

export const GetUserBank = async (userId: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${userId}${BACKEND_URLS?.WALLET.MY_BANKS}`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    // logoutUser();
    // throw handleApiError(error);
    return error;
  }
};

export const GetBankList = async (userId: string) => {
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

export const AddBankAccountForWithdrawal = async (
  payload: TWithdrawalBankAccount
) => {
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
export const Withdraw_xNGN = async (payload: TWithdrawalRequest) => {
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

export const Withdraw_Crypto = async (payload: TCryptoWithdrawalRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.WALLET.WITHDRAW_CRYPTO}`,
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

export const CreateAds = async (payload: TCreateAdsRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.P2P.ADS.CREATE}`,
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

export const GetExpressAds = async (payload: TAddSearchRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${
        BACKEND_URLS?.P2P.ADS.EXPRESS_ADS
      }?asset=${payload.asset}&amount=${payload.amount}&type=${
        payload.type === "buy" ? "sell" : "buy"
      }&limit=1&skip=0`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    if (response.status) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const GetSearchAds = async (payload: TAddSearchRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${
        BACKEND_URLS?.P2P.ADS.SEARCH_ADS
      }?asset=${payload.asset}&type=${
        payload.type === "buy" ? "sell" : "buy"
      }&limit=${payload?.limit}&skip=${payload?.skip}`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    console.log(response);
    if (response.status) {
      return data;
    } else {
    }
  } catch (error) {
    return error;
  }
};

export const GetUserAd = async (payload: TAddSearchRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${
        BACKEND_URLS?.P2P.ADS.SEARCH_ADS
      }?asset=${payload.asset}&type=${
        payload.type === "buy" ? "sell" : "buy"
      }&limit=10&skip=0`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    console.log(response);
    if (response.status) {
      return data;
    } else {
    }
  } catch (error) {
    return error;
  }
};
function transformAssets(data: any[]) {
  const result: {
    id: string;
    tokenName: string;
    networks: { value: string; label: string; address: string }[];
  }[] = [];

  data.forEach(({ asset, network, address }) => {
    let existing = result.find((item) => item.id === asset);

    const networkObj = {
      value: network,
      label: network,
      address,
    };

    if (existing) {
      // Avoid duplicate networks
      if (!existing.networks.some((n) => n.value === network)) {
        existing.networks.push(networkObj);
      }
    } else {
      result.push({
        id: asset,
        tokenName: asset,
        networks: [networkObj],
      });
    }
  });

  return result;
}

export const Fetch_CryptoAssets = async (payload: string) => {
  try {
    const response = await Bisatsfetch(`/api/v1/user/${payload}/crypto-data`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response;
    console.log(data);
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const GetWalletTransactions = async (payload: TPayloadTransHistory) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userID}${
        BACKEND_URLS?.WALLET?.WALLET_TRANSC_HISTORY
      }?limit=50&skip=0&reason=${payload.reason ?? ""}&type=${
        payload.type ?? ""
      }&asset=${payload.asset ?? ""}&startDate=${payload.date ?? ""}&endDate=${
        payload.date ?? ""
      }&searchWord=${payload.searchWord ?? ""}&status=${payload.status ?? ""}`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    // logoutUser();
    // throw handleApiError(error);
    return error;
  }
};
