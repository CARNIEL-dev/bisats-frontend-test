/** @format */

import { WalletActionypes } from "../types";

export interface WalletState {
  id: string;
  userId: string;
  loading: boolean;
  wallet: {
    [key: string]: any;
  } | null;
}

interface WalletActionProp {
  type: string;
  payload: Record<string, any>;
}

const initialState: WalletState = {
  id: "",
  userId: "",
  wallet: null,
  loading: false,
};

const walletReducer = (state = initialState, action: WalletActionProp) => {
  switch (action.type) {
    case WalletActionypes.GET_WALLET:
      return {
        ...state,
        id: action.payload.id,
        userId: action.payload.userId,
        wallet: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default walletReducer;
