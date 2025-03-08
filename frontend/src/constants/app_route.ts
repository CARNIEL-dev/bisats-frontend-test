/** @format */

export const APP_ROUTES = {
  OTHERS: {
    LANDINGPAGE: "/",
    ABOUT: "/about",
    TNC: "/terms&conditions",
    PRIVACY: "/privacypolicy",
  },
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    OTP: "/auth/otp",
    VERIFY: "/auth/verify",
    RESET_PASSWORD: "/auth/reset-password",
  },
  KYC: {
    PERSONAL: "/kyc/personal-information",
    POA: "/kyc/poa",
    IDENTITY: "/kyc/identity",
    PHONEVERIFICATION: "/phone-verification",
  },
  WALLET: {
    HOME: "/wallet",
    DEPOSIT: "/wallet/deposit",
    WITHDRAW: "/wallet/withdrawal",
    TRANSACTION_BREAKDOWN:"/wallet/deposit/transaction-breakdown"
  },
  P2P: {
    MARKETPLACE: "/p2p/market-place",
    EXPRESS: "/p2p/express",
    ORDER_HISTORY: "/p2p/orders",
    MY_ADS: "/p2p/my-ads",
    AD_DETAILS: "/p2p/ad",
    CREATE_AD: "/p2p/ad/create",
    MY_PROFILE: "/p2p/my-profile",
    SELL: "/p2p/market-place/sell",
    BUY: "/p2p/market-place/buy",
    RECEIPT: "/p2p/market-place/receipt",
  },
  SETTINGS: {
    PROFILE: "/settings/user-info",
    SECURITY: "/settings/security",
    PAYMENT: "/settings/payment",
    SUPPORT: "/settings/support",
  },
  DASHBOARD: "/dashboard",
  AD: "/ad",
  PROFILE: "/profile",
};
