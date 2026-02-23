/** @format */

export type TResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: TUser | any;
};

export type TLogin = {
  email: string;
  password: string;
  ip: string;
  code?: string;
};

export type TSignUp = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type TPersonalInfoKYC = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  nationality: string;
};

export type TPOA = {
  file: string;
};

export type TIdentity = {
  docType: string;
  identificationNo: string;
  selfie: string;
};
export type TMerchant = {
  utilityBill: string;
  photoIdentity: string;
};

export type TSuperMerchant = {
  utilityBill: string;
  cacDocument: string;
  mermatDoc?: string | null;
};

export type TRequestPhone = {
  phoneNumber: string;
  countryCode?: string;
};

export type TVerifyPhone = {
  code: string;
};

export type TPinRequest = {
  pin: string;
  confirmPin: string;
  oldPin?: string;
};

export type TVerify2FARequest = {
  code: string;
};

export type TUpdate2FAStatus = {
  enable?: boolean;
  code?: string;
};
