/** @format */

import Bisatsfetch from "../fetchWrapper";
import { BACKEND_URLS } from "../../utils/backendUrls";
import { TUser, TLogin, TSignUp, TResponse } from "../../types/user";
import { setToken, setRefreshToken, setUser } from "../../helpers";
import { UserActionTypes } from "../types";
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
export const rehydrateUser = (dispatch: any) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const data = JSON.parse(user ?? "");

  if (user && token) {
    setUser(data);
    setToken(token);
    setRefreshToken(data.refreshToken);
    dispatchWrapper({ type: UserActionTypes?.LOG_IN_SUCCESS, payload: user });
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