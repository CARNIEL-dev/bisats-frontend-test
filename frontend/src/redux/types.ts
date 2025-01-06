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
  LOG_IN_SUCCESS = "logInSuccess",
  SIGN_UP = "signUp",
  UPDATE_USER = "updateUser",
  RESET_USER = "resetUser",
  KYC_STATUS="kycstatus"
  // Add other action types here
}


export enum AdvertsActionTypes {
  FETCH_ADVERTS = "adverts/fetchAdverts",
  ADD_ADVERT = "adverts/addAdvert",
  // Add other action types here
}


