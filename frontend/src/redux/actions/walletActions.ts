import { getToken, getUser, setLivePrices, setUserTokenData } from "@/helpers";
import { formatDate } from "@/layouts/utils/Dates";
import { ITransaction, RawTx } from "@/pages/wallet/Transaction";
import Bisatsfetch from "@/redux/fetchWrapper";
import { WalletActionTypes } from "@/redux/types";
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
} from "@/types/wallet";
import { BACKEND_URLS } from "@/utils/backendUrls";
import dispatchWrapper from "@/utils/dispatchWrapper";
import { useQuery } from "@tanstack/react-query";

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
        type: WalletActionTypes.GET_WALLET,
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
    if (data.status) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    throw error;
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

export const GetSearchAds = async (
  payload: Omit<TAddSearchRequest, "amount">
) => {
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
    return response;
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
    if (!response.status) {
      throw new Error(response.message);
    }
    return data;
  } catch (error) {
    return error;
  }
};

// HDR: GET USER ADS
const getUserAds = async (userId: string) => {
  try {
    const endpoint = `/api/v1/user/${userId}/ads/get-user-ads`;

    const response = await Bisatsfetch(endpoint, {
      method: "GET",
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};
const updateAdStatus = async ({
  adId,
  newStatus,
  userId,
}: {
  adId: string;
  newStatus: string;
  userId: string;
}) => {
  try {
    const endpoint = `/api/v1/user/${userId}/ads/${adId}/update-ads-status`;

    const response = await Bisatsfetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

const useUserWalletHistory = ({
  userId,
  reason,
  asset,
  date,
  type,
  searchWord,
  isKycVerified,
}: {
  userId: string;
  reason: string;
  asset: string;
  date: string;
  type: string;
  searchWord: string;
  isKycVerified?: boolean;
}) => {
  return useQuery<
    ITransaction[], // TData
    Error, // TError
    ITransaction[], // TSelectResult (same here)
    [
      "userWalletHistory",
      string, // userId
      string, // reason
      string, // asset
      string, // date
      string, // type
      string // searchWord
    ]
  >({
    queryKey: [
      "userWalletHistory",
      userId,
      reason,
      asset,
      date,
      type,
      searchWord,
    ],
    queryFn: async ({ queryKey }) => {
      const [_key, u, r, a, d, t, s] = queryKey;
      const res = await GetWalletTransactions({
        userID: u,
        reason: r,
        asset: a,
        type: t,
        date: d,
        searchWord: s,
      });
      if (!res?.transactions) {
        throw new Error("No Wallet History found");
      }
      return res.transactions.map((t: RawTx) => ({
        Asset: t.asset,
        Type: t.reason,
        Date: formatDate(t.createdAt),
        Reference: t.reference ?? "-",
        Network: t.network ?? t.paymentMethod,
        Amount: t.amount,
        Status: t.status,
        txHash: t.txHash,
        bankDetails: t.bankDetails,
      }));
    },
    // staleTime: 1000 * 60 * 5,
    enabled: Boolean(userId && isKycVerified),
    refetchOnMount: false,
  });
};

const useFetchOrder = ({
  userId,
  isKycVerified,
}: {
  userId: string;
  isKycVerified?: boolean;
}) => {
  return useQuery<OrderHistory[], Error>({
    queryKey: ["orders", userId],
    queryFn: async ({ queryKey }) => {
      const [, uid] = queryKey;
      const response = await Bisatsfetch(
        `/api/v1/user/${uid}${BACKEND_URLS.P2P.ADS.FETCH_ORDERS}`,
        { method: "GET" }
      );

      if (response.status === true && Array.isArray(response.data)) {
        return response.data as OrderHistory[];
      }
      throw new Error("Failed to fetch orders");
    },
    enabled: Boolean(userId && isKycVerified),
    refetchOnMount: false,
  });
};

const useFetchUserAds = ({
  userId,
  isKycVerified,
}: {
  userId: string;
  isKycVerified?: boolean;
}) => {
  return useQuery<AdsTypes[], Error>({
    queryKey: ["userAds", userId],
    queryFn: () => getUserAds(userId),
    retry: false,
    refetchOnMount: false,
    staleTime: Infinity,
    enabled: Boolean(userId && isKycVerified),
  });
};

const getCryptoRates = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price` +
      `?ids=bitcoin,ethereum,solana,tron,usd` +
      `&vs_currencies=usd,ngn`
  );

  if (!response.ok) throw new Error("Failed to fetch crypto rates");
  const data = await response.json();
  return data;
};

const COIN_IDS = ["bitcoin", "ethereum", "solana", "tether"].join(",");

const getCoinRates = async ({ isMarket = false }: { isMarket?: boolean }) => {
  const response = await fetch(
    ` https://api.coingecko.com/api/v3/coins/markets` +
      `?${isMarket ? "vs_currency=ngn" : "vs_currency=usd"}` +
      `&ids=${COIN_IDS}` +
      `&order=market_cap_desc` +
      `&per_page=4&page=1` +
      `&sparkline=false` +
      `&price_change_percentage=24h`
  );

  if (!response.ok) throw new Error("Failed to fetch crypto rates");
  const data = await response.json();
  return data;
};

const toggleShowBalance = () => {
  dispatchWrapper({
    type: WalletActionTypes.TOGGLE_SHOW_BALANCE,
  });
};

const setWalletCurrency = (currency: "usd" | "ngn") => {
  dispatchWrapper({
    type: WalletActionTypes.SET_DEFAULT_CURRENCY,
    payload: currency,
  });
};

export {
  getUserAds,
  updateAdStatus,
  useFetchOrder,
  useUserWalletHistory,
  getCryptoRates,
  getCoinRates,
  useFetchUserAds,
  toggleShowBalance,
  setWalletCurrency,
};
