/** @format */

export type TTopUpNGN = {
  amount: number;
  bankAccountId?: string;
};

export type TConfirmDeposit = {
  userId: string;
  paymentId: string;
  bankAccountId: string;
};

export type TWallet = {
  id: string;
  userId: string;
  xNGN: number;
  SOL: number | null;
  BTC: number | null;
  USDT: number | null;
  ETH: number | null;
  xNGNLocked: number | null;
  SOLLocked: number | null;
  BTCLocked: number | null;
  USDTLocked: number | null;
  ETHLocked: number | null;
  btcAddress: null;
  ethAddress: null;
  solAddress: null;
  NGNMaxDailyWithdrawalLimit: null;
  USDMaxDailyWithdrawalLimit: null;
  AdsLimit: null;
  vaultAccountId: null;
  activated: boolean;
  onHold: boolean;
  blockWallet: boolean;
  pin: string | null;
  pinSet: boolean;
  createdAt?: string;
  updatedAt?: string;
  bankAccount: TbankAccount[];
};

export type TbankAccount = {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: null;
};

export type TWithdrawalBankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
  bankId?: string;
};
export type TDeleteWithdrawalRequest = {
  bankAccountId: string;
};
export type TWithdrawalRequest = {
  amount: number;
  bankAccountId: string;
};

export type WithdrawalCompleteType = {
  referenceId: string;
  withdrawalPin: string;
  twoFactorCode: string;
};
export type TWithdrawalAddress = {
  name: string;
  address: string;
  network: string;
  asset: string;
};

export type TCryptoWithdrawalRequest = {
  amount: number;
  address: string;
  asset: string;
  chain: string;
};

export type TDepositBreakDowns = {
  amount: number;
  duty: number;
  processingCharge: number;
  vat: number;
  commission: number;
  totalAmount: number;
  bankAccounts: TbankAccount[];
};

export type TCreateAdsRequest = {
  asset: string;
  type: string;
  amount: number;
  minimumLimit: number;
  maximumLimit: number;
  // expiryDate: string;
  priceType: string;
  price: number;
  priceMargin: number;
  priceUpperLimit: number;
  priceLowerLimit: number;
  transactionPin?: string;
};

export type TUpdateAdsRequest = {
  userId: string;
  adId: string;
  asset: string;
  type: string;
  amount: number;
  minimumLimit: number;
  maximumLimit: number;
  priceType: string;
  price: number;
  priceUpperLimit: number;
  priceLowerLimit: number;

  // "price": 1600,
};

export type T2FARequest = {
  code: string;
  pin: string;
};

export type TAddSearchRequest = {
  asset: string;
  type: string;
  amount: string;
  limit?: string;
  skip?: string;
};

export enum DepositStatus {
  CANCEL = "cancel",
  PAID = "paid",
}

export type TPayloadTransHistory = {
  reason?: string;
  type?: string;
  asset?: string;
  date?: string;
  searchWord?: string;
  status?: string;
};
