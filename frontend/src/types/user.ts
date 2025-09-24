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
};

export type TSignUp = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type TPersonalInfoKYC = {
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  nationality: string;
};

export type TPOA = {
  userId: string;
  file: File;
};

export type TIdentity = {
  userId: string;
  docType: string;
  identificationNo: string;
  selfie: File | string;
};
export type TMerchant = {
  userId: string;
  utilityBill: File | string;
  photoIdentity: File | string;
};

export type TSuperMerchant = {
  userId: string;
  utilityBill: File | string;
  cacDocument: File | string;
  mermatDoc?: File | string | null;
};

export type TRequestPhone = {
  userId: string;
  phoneNumber: string;
  countryCode?: string;
};

export type TVerifyPhone = {
  userId: string;
  code: string;
};

export type TPinRequest = {
  userId?: string;
  pin: string;
  confirmPin: string;
  oldPin?: string;
};

export type TVerify2FARequest = {
  userId?: string;
  code: string;
};

export type TUpdate2FAStatus = {
  userId?: string;
  enable?: boolean;
  code?: string;
};
