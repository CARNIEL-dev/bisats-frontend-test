/** @format */

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
  return initialState;
};

export default walletReducer;
