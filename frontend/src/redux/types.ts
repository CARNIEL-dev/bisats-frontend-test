/** @format */

export interface APIResponseType {
  data: unknown;
  message: string;
  status: boolean;
  statusCode: number;
}
export enum GeneralTypes {
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum UserActionTypes {
  LOG_IN_PENDING = "logInPending",
  LOG_IN_UPDATE = "logInUpdate",
  LOG_IN_SUCCESS = "logInSuccess",
  SIGN_UP = "signUp",
  UPDATE_USER = "updateUser",
  RESET_USER = "resetUser",
  KYC_STATUS = "kycstatus",
  LOG_OUT = "logout",
}

export enum WalletActionTypes {
  GET_WALLET = "getwallet",
  WALLET_SETTINGS = "getwalletsettings",
  TOGGLE_SHOW_BALANCE = "TOGGLE_SHOW_BALANCE",
  SET_DEFAULT_CURRENCY = "SET_DEFAULT_CURRENCY",
  RESET_WALLET = "RESET_WALLET",
}

export enum AdvertsActionTypes {
  FETCH_ADVERTS = "adverts/fetchAdverts",
  ADD_ADVERT = "adverts/addAdvert",
  // Add other action types here
}

export enum AdActionTypes {
  GET_ADS_REQUEST = "getadsrequest",
  GET_ADS_SUCCESS = "getadsuccess",
  GET_ADS_FAILURE = "getadsfailure",
  CREATE_AD_REQUEST = "createadrequest",
  CREATE_AD_SUCCESS = "createadsuccess",
  CREATE_AD_FAILURE = "createadfailure",
  UPDATE_AD_STATUS = "updateadstatus",
}
