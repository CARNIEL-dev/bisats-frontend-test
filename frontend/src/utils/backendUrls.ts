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
    VERIFY_ACCOUNT: "/v1/auth/verify",
    RESEND_VERIFY: "/v1/auth/resend-verify",
  },

  DASHBOARD: {
    DASHBOARD: "/v1/dashboard",
  },
  WALLET: {
    GET_WALLET: "/wallet/get-user-wallet",
    TRANSC_BREAKDOWN: "/payment/top-up-breakdown",
    TOPUPNGN: "/top-up-wallet",
    LIST_BANKS: "/list-banks",
  },
  NOTIFICATIONS: "/v1/user/notifications",
  ADD_PUSH_NOTIFICATION: "/v1/notification/add-push-token",
  SUPPORT_CHANNEL: "/v1/support",
  SUPPORT_SOCKET_CHAT: "",
};
