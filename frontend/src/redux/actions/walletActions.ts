/** @format */

import { TTopUpNGN } from "../../types/wallet";
import { BACKEND_URLS } from "../../utils/backendUrls";
import Bisatsfetch from "../fetchWrapper";

export const GetWallet = () => {};

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
