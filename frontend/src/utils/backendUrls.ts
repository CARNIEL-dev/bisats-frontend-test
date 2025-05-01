/** @format */

export const BACKEND_URLS = {
  BASE_URL:
    process.env.REACT_APP_NODE_ENV !== "production"
      ? `${process.env.REACT_APP_DEV_DOMAIN}`
      : ``,
  GOOGLEAPI: "https://www.googleapis.com/oauth2/v2/userinfo",
  AUTH: {
    LOGIN: "/api/v1/user/login",
    SIGNUP: "/api/v1/user/register",
    CREATE_AGENT: "/v1/auth/sign-up",
    GET_ME: "/v1/auth/me",
    REFRESH_TOKEN: "/v1/auth/refresh-token",
    LOGOUT: "/v1/auth/logout",
    FORGOT_PASSWORD: "/v1/auth/forgot-password",
    RESET_PASSWORD: "/v1/auth/password-reset",
    CHANGE_PASSWORD: "/change-password",
    VERIFY_ACCOUNT: "/v1/auth/verify",
    RESEND_VERIFY: "/v1/auth/resend-verify",
    ADD_PHONE: "/add-change-phone-number",
    VERIFY_PHONE: "/verify-phone-number",
    RESEND_PHONE_OTP: "/resend-phone-verification-otp",

    SET_PIN: "/wallet/set-pin",
    UPDATE_PIN: "/wallet/change-pin",
    FORGOT_PIN: "/wallet/forgot-pin-request",
    RESET_PIN: "/wallet/reset-pin-request",

    GENERATE_2FA_QRCODE: "/get-two-factor-auth",
    ENABLE_2FA: "/enable-two-factor-auth",
    DISABLE_2FA: "/disable-two-factor-auth",

    VERIFY_2FA: "/verify-two-factor-auth",
    VALIDATE_2FA: "/verify-two-factor-and-pin-auth",
  },

  KYC: {
    POST_PERSONAL_INFO: "",
    POST_IDENTIFICATION: "",
    POST_BVN: "/verify-bvn",
    BVN_VERIFICATION: "/verify-bvn-otp-code",
    POST_PROOF_ADDRESS: "/verify-utility-bill",
    POST_SOURCE_WEALTH: "/upload-source-of-wealth-document",
    POST_PROOF_PROFILE: "/upload-proof-of-profile-document",
  },

  DASHBOARD: {
    DASHBOARD: "/v1/dashboard",
  },
  WALLET: {
    GET_WALLET: "/wallet/get-user-wallet",
    TRANSC_BREAKDOWN: "/payment/top-up-breakdown",
    TOPUPNGN: "/payment/top-up-wallet",
    CONFIRM_TOPUP: "/confirm-wallet-top-up",
    LIST_BANKS: "/list-banks",
    MY_BANKS: "/bank/get-bank-details?bankAccountType=withdrawal",
    ADD_BANK_ACCOUNT: "/bank/set-bank-details",
    EDIT_BANK_ACCOUNT: "/update-bank-details",
    DELE_BANK_ACCOUNT:"/delete-bank-details",
    WITHDRAW: "/withdraw",
  },
  P2P: {
    ADS: {
      CREATE: "/ads/create",
      GET_ALL: "/ads/get-user-ads",
      GET_BY_ID: "/ads/:adsId/get-user-ads-by-id",
      GET_ORDER: "/ads/:adsId/get-user-ads-order",
      SEARCH: "/ads/search-ads",
    }
  },
  NOTIFICATIONS: "/v1/user/notifications",
  ADD_PUSH_NOTIFICATION: "/v1/notification/add-push-token",
  SUPPORT_CHANNEL: "/v1/support",
  SUPPORT_SOCKET_CHAT: "/withdraw",
};
