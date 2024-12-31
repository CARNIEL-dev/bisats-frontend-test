/** @format */

import { GeneralTypes, UserActionTypes } from "../types";
interface KycStatus {
  identificationVerified: boolean;
  personalInformationVerified: boolean;
  utilityBillVerified: boolean;
}

export interface UserState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    [key: string]: any;
  } | null;
  token: string | null;
  kyc: KycStatus | null;
}
interface UserActionProp {
  type: string;
  payload: Record<string, any>;
}

const initialState: UserState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  token: null,
  kyc: null,
};

const userReducer = (state = initialState, action: UserActionProp) => {
  switch (action.type) {
    case GeneralTypes.LOADING:
      return {
        ...state,
        loading: true,
      };
    case UserActionTypes.LOG_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
        loading: false,
      };
    case UserActionTypes.SIGN_UP:
      console.log(action.payload, action.type);
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.UPDATE_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.KYC_STATUS:
      return {
        ...state,
        kyc: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
