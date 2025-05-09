
export type AccountLevel = keyof typeof bisats_limit;

export const bisats_limit = {
  level_1: {
    kyc_level: "level_1",
    daily_withdrawal_limit_fiat: 300000000,
    fiat_currency: "ngn",
    daily_withdrawal_limit_crypto: 500000,
    crypto_currency: "usd",
    withdrawal_per_transaction_fiat: 20000000,
    charge_on_single_withdrawal_fiat: 100,
    charge_on_single_withdrawal_crypto: 2,
    deposit_per_transaction_fiat: 100000000,
    charge_on_single_deposit_fiat: 1500,
    charge_on_single_deposit_crypto: 0,
  },
  level_2: {
    kyc_level: "level_2",
    daily_withdrawal_limit_fiat: 300000000,
    fiat_currency: "ngn",
    daily_withdrawal_limit_crypto: 500000,
    crypto_currency: "usd",
    withdrawal_per_transaction_fiat: 20000000,
    charge_on_single_withdrawal_fiat: 100,
    charge_on_single_withdrawal_crypto: 2,
    deposit_per_transaction_fiat: 100000000,
    charge_on_single_deposit_fiat: 1500,
    charge_on_single_deposit_crypto: 0,
  },
  level_3: {
    kyc_level: "level_3",
    daily_withdrawal_limit_fiat: 300000000,
    fiat_currency: "ngn",
    daily_withdrawal_limit_crypto: 500000,
    crypto_currency: "usd",
    withdrawal_per_transaction_fiat: 20000000,
    charge_on_single_withdrawal_fiat: 100,
    charge_on_single_withdrawal_crypto: 2,
    deposit_per_transaction_fiat: 100000000,
    charge_on_single_deposit_fiat: 1500,
    charge_on_single_deposit_crypto: 0,
  },
};

export const bisats_charges = {
  crypto_buy: 0.02,
  crypto_sell: 0.015,
  ad_creation_sell:0.02
}

/// kycRules.js

export const KYC_LEVELS = {
  NONE: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
};

export const ACTIONS = {
  DEPOSIT: "deposit",
  WITHDRAW:"withdraw",
  DEPOSIT_NGN: "deposit_ngn",
  WITHDRAW_NGN: "withdraw_ngn",
  DEPOSIT_CRYPTO: "deposit_crypto",
  WITHDRAW_CRYPTO: "withdraw_crypto",
  BUY_CRYPTO: "buy_crypto",
  SELL_CRYPTO: "sell_crypto",
  CREATE_AD: "create_ad",
  HIGH_VALUE_TRANSACTION: "high_value_transaction",
  SET_2FA: "set_2fa",
  // Add more actions
};

export const KYC_RULES = {
  [KYC_LEVELS.NONE]: {
    allowedActions: [ACTIONS.SET_2FA],
    requiresKycModal: true,
  },
  [KYC_LEVELS.LEVEL_1]: {
    allowedActions: [
      // ACTIONS.SELL_CRYPTO,
      ACTIONS.BUY_CRYPTO,
      ACTIONS.DEPOSIT_CRYPTO,
      // ACTIONS.WITHDRAW_CRYPTO,
      // ACTIONS.WITHDRAW_NGN,
      ACTIONS.SET_2FA,
    ],
    limits: {
      transactionAmount: 1000, // $1000 max per transaction
    },
  },
  [KYC_LEVELS.LEVEL_2]: {
    allowedActions: [
      ACTIONS.DEPOSIT_NGN,
      ACTIONS.BUY_CRYPTO,
      ACTIONS.WITHDRAW_NGN,
      ACTIONS.SELL_CRYPTO,
      ACTIONS.DEPOSIT_CRYPTO,
      ACTIONS.WITHDRAW_CRYPTO,
      ACTIONS.SET_2FA,
      ACTIONS.DEPOSIT,
    ],
    limits: {
      transactionAmount: 10000,
    },
  },
  [KYC_LEVELS.LEVEL_3]: {
    allowedActions: [
      ACTIONS.DEPOSIT_NGN,
      ACTIONS.BUY_CRYPTO,
      ACTIONS.WITHDRAW_NGN,
      ACTIONS.SELL_CRYPTO,
      ACTIONS.DEPOSIT_CRYPTO,
      ACTIONS.WITHDRAW_CRYPTO,
      ACTIONS.SET_2FA,
      ACTIONS.DEPOSIT,
    ],
    limits: {
      transactionAmount: Infinity,
    },
  },
};

// Define which actions need 2FA
export const ACTIONS_REQUIRING_2FA = [
  ACTIONS.WITHDRAW_NGN,
  // ACTIONS.DEPOSIT,
  ACTIONS.SELL_CRYPTO,
  // ACTIONS.BUY_CRYPTO,
  ACTIONS.WITHDRAW_CRYPTO,
  // ACTIONS.DEPOSIT_CRYPTO,
  // ACTIONS.CREATE_AD,
];
