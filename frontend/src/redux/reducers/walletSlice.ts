/** @format */

import { WalletActionTypes } from "../types";

export interface WalletState {
  id: string;
  userId: string;
  loading: boolean;
  wallet: {
    [key: string]: any;
  } | null;
  showBalance: boolean;
  defaultCurrency: "usd" | "ngn";
}

interface WalletActionProp {
  type: string;
  payload?: any;
}

const initialState: WalletState = {
  id: "",
  userId: "",
  wallet: null,
  loading: false,
  showBalance: false,
  defaultCurrency: "usd",
};

const walletReducer = (state = initialState, action: WalletActionProp) => {
  switch (action.type) {
    case WalletActionTypes.GET_WALLET:
      return {
        ...state,
        id: action.payload.id,
        userId: action.payload.userId,
        wallet: action.payload,
        loading: false,
      };
    case WalletActionTypes.TOGGLE_SHOW_BALANCE:
      return {
        ...state,
        showBalance: !state.showBalance,
      };

    case WalletActionTypes.SET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: action.payload,
      };
    default:
      return state;
  }
};

export default walletReducer;
