/** @format */

import Bisatsfetch from "../fetchWrapper";
import { BACKEND_URLS } from "../../utils/backendUrls";
import {
  TUser,
  TLogin,
  TSignUp,
  TResponse,
  TPersonalInfoKYC,
  TPOA,
  TIdentity,
} from "../../types/user";
import { setToken, setRefreshToken, setUser, getToken } from "../../helpers";
import { UserActionTypes, GeneralTypes } from "../types";
import dispatchWrapper from "../../utils/dispatchWrapper";

export const Login = async (payload: TLogin) => {
  try {
    const response = await Bisatsfetch(BACKEND_URLS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    dispatchWrapper({ type: UserActionTypes.LOG_IN_SUCCESS, payload: data });
    setUser(data);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const SignUp = async (payload: TSignUp) => {
  try {
    const response = await Bisatsfetch(BACKEND_URLS.AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    dispatchWrapper({ type: UserActionTypes.SIGN_UP, payload: data });
    setUser(data);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const VerifyUser = async (payload: { userId: string; code: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/verify-otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const ReSendverificationCode = async (payload: { userId: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/resend-verification-otp`,
      {
        method: "GET",
        // body: JSON.stringify(payload),
      }
    );
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const ForgotPassword = async (payload: { email: string }) => {
  try {
    const response = await Bisatsfetch(`/api/v1/user/forgot-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const VerifyForgotPassword = async (payload: {
  email: string;
  code: string;
}) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/verify-forgot-password-otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response.data;
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const ResetPassword = async (payload: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await Bisatsfetch(`/api/v1/user/reset-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const refreshAccessToken = async (payload: { refreshToken: string }) => {
  try {
    const response = await Bisatsfetch("/api/v1/user/refresh-token", {
      method: "GET",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    setUser(data);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return data as TUser;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const rehydrateUser = () => {
  const user = localStorage.getItem("_user");
  const token = localStorage.getItem("token");

  const data = user ? JSON.parse(user ?? "") : user;

  if (data && token) {
    dispatchWrapper({
      type: UserActionTypes?.LOG_IN_SUCCESS,
      payload: data,
    });
    setUser(data);
    setToken(token);
    setRefreshToken(data.refreshToken);
  }
};

export const GoogleAuth = async (payload: { email: string; id: string }) => {
  try {
    const response = await Bisatsfetch(`/api/v1/user/google-auth`, {
      method: "POST",
      body: JSON.stringify({ email: payload.email, googleId: payload.id }),
    });
    const data = response.data;
    dispatchWrapper({ type: UserActionTypes.LOG_IN_SUCCESS, payload: data });
    setUser(data);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

//KYC

export const PostPersonalInformation_KYC = async (
  payload: TPersonalInfoKYC
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/upload-personal-info`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response.data;
    dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const PostPOA_KYC = async (payload: TPOA) => {
  const formData = new FormData();
  formData.append("image", payload.file);
  const token = getToken();
  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}/verify-utility-bill`,
      {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
        body: formData,
      }
    );
    const data = response.json();
    console.log(data);

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return data;
  } catch (error) {
    console.log(error);
    // throw handleApiError(error);
    return error;
  }
};

export const PostIdentity_KYC = async (payload: TIdentity) => {
  const formData = new FormData();
  formData.append("image", payload.selfie);
  formData.append("identificationType", payload.docType);
  formData.append("identificationNumber", payload.identificationNo);
  const token = getToken();
  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}/verify-identity`,
      {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
        body: formData,
      }
    );
    const data = response.json();
    console.log(data);
    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const GetKYCStatus = async (payload: { userId: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/fetch-kyc-status`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    dispatchWrapper({ type: UserActionTypes.KYC_STATUS, payload: data });
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};