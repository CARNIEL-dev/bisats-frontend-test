/** @format */

export type TTopUpNGN = {
  userId: string;
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

export type TDepositBreakDowns = {
  amount: number;
  duty: number;
  processingCharge: number;
  vat: number;
  commission: number;
  totalAmount: number;
  bankAccounts: TbankAccount[];
};


export enum DepositStatus {
  CANCEL = "cancel",
  PAID = "paid",
}