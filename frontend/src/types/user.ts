/** @format */

export type TResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: TUser | any;
};
export type TUser = {
  token: string;
  userId: string;
  userType: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: number | null;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  accountStatus: string;
  userName: string | null;
  image: {
    key: string | number | null;
    url: string | null;
  };
  refreshToken: string;
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
// type TAuth = {
//   statusCode: number;
//   status: boolean;
//   message: string;
//   data: {
//     token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYzE1NDhiNC0wYzNiLTQ3N2QtYTRjYy03MTc0NDJkNGZhMjgiLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJlbWFpbCI6InRhaXdvcm9xZWViQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjpudWxsLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwicGhvbmVOdW1iZXJWZXJpZmllZCI6ZmFsc2UsImFjY291bnRTdGF0dXMiOiJhY3RpdmUiLCJ1c2VyTmFtZSI6bnVsbCwidXNlclR5cGUiOiJ1c2VyIiwiaW1hZ2UiOnsia2V5IjpudWxsLCJ1cmwiOm51bGx9LCJpYXQiOjE3MzIxODIxMzcsImV4cCI6MTczMjQ0MTMzN30.SVL-pVrQa0eReZEjIDPG7faODlAMnD-WjD2gnwB6xxs";
//     userId: "cc1548b4-0c3b-477d-a4cc-717442d4fa28";
//     userType: "user";
//     firstName: null;
//     lastName: null;
//     email: "taiworoqeeb@gmail.com";
//     phoneNumber: null;
//     emailVerified: false;
//     phoneNumberVerified: false;
//     accountStatus: "active";
//     userName: null;
//     image: {
//       key: null;
//       url: null;
//     };
//     refreshToken: "ST4APowc1oOZsSsJS2F4KyX9DYPJVuCtTcau5wHn5gd7O8FvrpgtW1Zju1e2jWOM19JEROkZvgulgpxCwLx4OHZ7MUZKzpBZ4G2xEFXI0l7Hq5gKGgAuYiwMIqw24AZqxEZLExeUqf4wOzS0prrz5PQ9WVuldw8MpfrEAYT5uNZLiEmkMSeMRsEYolFiytD4y2W7OvLbJrrTthOaiJSuEKr8TAKvz2Elz2F0qCnuZoYJkdraCPz7z1qHlJRX3myP";
//   };
// };
