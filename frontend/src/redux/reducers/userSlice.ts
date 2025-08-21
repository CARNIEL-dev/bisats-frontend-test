/** @format */

import { GeneralTypes, UserActionTypes } from "../types";
export interface KycStatus {
  identificationVerified: boolean;
  personalInformationVerified: boolean;
  utilityBillVerified: boolean;
  proofOfProfileVerified: boolean;
  sourceOfWealthVerified: boolean;
  bvnVerified: boolean;
}

interface UserActionProp {
  type: string;
  payload: Record<string, any> | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  kyc: null,
  wallet: null,
  twoFactorAuthEnabled: false,
};

const userReducer = (state = initialState, action: UserActionProp) => {
  switch (action.type) {
    case GeneralTypes.LOADING:
      return {
        ...state,
        loading: true,
      };
    case UserActionTypes.LOG_IN_PENDING:
      return {
        ...state,
        isAuthenticated: false,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.LOG_IN_UPDATE:
      return {
        ...state,
        isAuthenticated: true,
      };

    case UserActionTypes.LOG_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.SIGN_UP:
      return {
        ...state,
        isAuthenticated: false,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.UPDATE_USER:
      return {
        ...state,
        user: action?.payload,
        token: action?.payload?.token,
        kyc: action?.payload?.kyc,
      };
    case UserActionTypes.KYC_STATUS:
      return {
        ...state,
        kyc: action.payload,
      };
    case UserActionTypes.LOG_OUT:
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        kyc: null,
      };
    default:
      return state;
  }
};
export default userReducer;
