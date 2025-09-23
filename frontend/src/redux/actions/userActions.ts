/** @format */

import {
  getRefreshToken,
  getToken,
  getUserId,
  setRefreshToken,
  setToken,
  setUserId,
} from "@/helpers";
import Bisatsfetch from "@/redux/fetchWrapper";
import { GeneralTypes, UserActionTypes } from "@/redux/types";
import {
  TIdentity,
  TLogin,
  TMerchant,
  TPersonalInfoKYC,
  TPinRequest,
  TPOA,
  TRequestPhone,
  TSignUp,
  TUpdate2FAStatus,
  TVerify2FARequest,
  TVerifyPhone,
  TSuperMerchant,
} from "@/types/user";
import { BACKEND_URLS } from "@/utils/backendUrls";
import dispatchWrapper from "@/utils/dispatchWrapper";

export const Login = async (payload: TLogin) => {
  try {
    const response = await Bisatsfetch(BACKEND_URLS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = response.data;

    setUserId(data?.userId);
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
    dispatchWrapper({ type: UserActionTypes.LOG_IN_PENDING, payload: data });
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

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const UpdatePassword = async (payload: {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.CHANGE_PASSWORD}`,
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

export const refreshAccessToken = async (payload: { refreshToken: string }) => {
  try {
    const response = await Bisatsfetch("/api/v1/user/refresh-token", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = response.data;
    setUserId(data?.userId);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return data as TUser;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const rehydrateUser = ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  if (!userId || !token) {
    logoutUser();
    return;
  }

  GetUserDetails({
    userId,
    token,
  });
};

export const logoutUser = () => {
  localStorage.removeItem("_uid");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  dispatchWrapper({ type: UserActionTypes?.LOG_OUT, payload: null });
  dispatchWrapper({ type: "RESET_WALLET", payload: null });
};

export const GoogleAuth = async (payload: { email: string; id: string }) => {
  try {
    const response = await Bisatsfetch(`/api/v1/user/google-auth`, {
      method: "POST",
      body: JSON.stringify({ email: payload.email, googleId: payload.id }),
    });
    const data = response.data;
    setUserId(data.userId);
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
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.POST_PROOF_ADDRESS}`,
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

    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const PostCorporateInformation = async (payload: TCorporateInfo) => {
  const formData = new FormData();
  formData.append("cacApplicationDocument", payload?.cacApplicationDocument!);
  if (payload.mermartDocument) {
    formData.append("mermartDocument", payload?.mermartDocument!);
  }
  formData.append("cacDocument", payload?.cacDocument!);
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}/upload-cooperate-account-documents`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    );
    const data = response.json();

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

export const GetUserDetails = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  const refreshToken = getRefreshToken();

  try {
    const response = await Bisatsfetch(`/api/v1/user/${userId}/profile`, {
      method: "GET",
    });
    const data = response.data;

    if (response.status) {
      dispatchWrapper({
        type: UserActionTypes.UPDATE_USER,
        payload: {
          ...data,
          token,
          refreshToken,
          userId: userId,
        },
      });

      setUserId(userId!);

      return data;
    } else {
      logoutUser();
    }
  } catch (error) {
    // console.log("Errorfrom getting profile", error);
    logoutUser();
    // throw handleApiError(error);
    return error;
  }
};

export const UpdateUserName = async (payload: {
  firstName?: string;
  lastName?: string;
  userName?: string;
  middleName?: string;
  deviceToken?: string;
  dateOfBirth?: string;
}) => {
  const userId = getUserId();

  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${userId}/update-profile`,
      {
        method: "PUT",

        body: JSON.stringify(payload),
      }
    );
    const data = response;

    await GetUserDetails({ userId: userId!, token: getToken()! });

    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const PostPhoneNumber_KYC = async (payload: TRequestPhone) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.ADD_PHONE}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Verify_OTP_PhoneNumber_KYC = async (payload: TVerifyPhone) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.VERIFY_PHONE}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Resend_OTP_PhoneNumber_KYC = async (payload: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload}${BACKEND_URLS.AUTH.RESEND_PHONE_OTP}`,
      {
        method: "GET",
      }
    );

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const PostBVN_KYC = async (payload: { bvn: string; userId: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.POST_BVN}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Verify_BVN_KYC = async (payload: TVerifyPhone) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.BVN_VERIFICATION}`,
      {
        method: "PUT",
        body: JSON.stringify({ code: payload.code }),
      }
    );

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Post_Proof_of_Wealth_KYC = async (payload: TPOA) => {
  const formData = new FormData();
  formData.append("image", payload.file);
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.POST_SOURCE_WEALTH}`,
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

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return data;
  } catch (error) {
    console.log(error);
    // throw handleApiError(error);
    return error;
  }
};

export const Post_Proof_of_Profile_KYC = async (payload: TPOA) => {
  const formData = new FormData();
  formData.append("image", payload.file);
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.POST_PROOF_PROFILE}`,
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

    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const Become_Merchant_Hanlder = async (payload: TMerchant) => {
  const formData = new FormData();
  formData.append("document1", payload.utilityBill);
  formData.append("document2", payload.photoIdentity);
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.BECOME_MERCHANT}`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    );
    const data = response.json();

    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const PostLevelThreeInformation = async (payload: TSuperMerchant) => {
  const formData = new FormData();
  formData.append("document1", payload.utilityBill);
  formData.append("document2", payload.cacDocument);
  if (payload.mermatDoc) {
    formData.append("document3", payload.mermatDoc);
  }
  const token = getToken();

  try {
    const response = await fetch(
      `${BACKEND_URLS.BASE_URL}/api/v1/user/${payload.userId}${BACKEND_URLS.KYC.BECOME_SUPER_MERCHANT}`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    );
    const data = response.json();

    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Set_PIN = async (payload: TPinRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.SET_PIN}`,
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

export const UPDATE_PIN = async (payload: TPinRequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.UPDATE_PIN}`,
      {
        method: "PUT",
        body: JSON.stringify({
          oldPin: payload.oldPin,
          newPin: payload.pin,
          confirmPin: payload.confirmPin,
        }),
      }
    );

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Generate2FA_QRCODE = async (payload: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload}${BACKEND_URLS.AUTH.GENERATE_2FA_QRCODE}`,
      {
        method: "GET",
      }
    );
    const data = response;
    if (response.status) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const VerifyTwoFactorAuth = async (payload: TVerify2FARequest) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.VERIFY_2FA}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = response;
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const UpdateTwoFactorAuth = async (payload: TUpdate2FAStatus) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}${
        payload.enable
          ? BACKEND_URLS.AUTH.ENABLE_2FA
          : BACKEND_URLS.AUTH.DISABLE_2FA
      }`,
      {
        method: "PUT",
        body: JSON.stringify({ code: payload.code }),
      }
    );
    const data = response;
    console.log("Data returned", data);
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};
export const ResetTwoFactorAuth = async (
  userId: TUpdate2FAStatus["userId"]
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${userId}${BACKEND_URLS.AUTH.RESET_2FA}`,
      {
        method: "PUT",
      }
    );
    const data = response;
    return data;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

// export const Verify_OTP_PhoneNumber_KYC = async (payload: TVerifyPhone) => {
//   try {
//     const response = await Bisatsfetch(
//       `/api/v1/user/${payload.userId}${BACKEND_URLS.AUTH.VERIFY_PHONE}`,
//       {
//         method: "POST",
//         body: JSON.stringify(payload),
//       }
//     );
//     const data = response.data;
//     console.log(data);
//     // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

//     return response;
//   } catch (error) {
//     // throw handleApiError(error);
//     return error;
//   }
// };

export const GET_ACTIVITY_SUMMARY = async (payload: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload}${BACKEND_URLS.AUTH.GET_ACTIVITY_SUMMARY}`,
      {
        method: "GET",
      }
    );
    const data = response;
    if (response.status) {
      return data;
    }

    throw new Error(data.message);
  } catch (error) {
    throw error;
  }
};

export const GET_WITHDRAWAL_LIMIT = async (userID: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${userID}${BACKEND_URLS.AUTH.GET_WITHDRAWAL_LIMIT}`,
      {
        method: "GET",
      }
    );
    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
