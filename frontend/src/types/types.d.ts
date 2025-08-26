interface WalletData {
  id: string;
  userId: string;
  xNGN: number;
  SOL: number;
  BTC: number;
  USDT_ETH: number;
  USDT_TRX: number;
  USDT_SOL: number;
  ETH: number;
  TRX: number;
}

type PriceChange = {
  ngn: number;
  usd: number;
  ngn_24h_change: number;
  usd_24h_change: number;
};

interface CryptoRates {
  bitcoin?: PriceChange;
  ethereum?: PriceChange;
  solana?: PriceChange;
  tron?: PriceChange;
  usd?: PriceChange;
  tether?: PriceChange;
}

interface WalletState {
  id: string;
  userId: string;
  loading: boolean;
  wallet: {
    [key: string]: any;
  } | null;
  showBalance: boolean;
  defaultCurrency: "usd" | "ngn";
}

type TUser = {
  token: string;
  userId: string;
  userType: string;
  firstName: string | null;
  lastName: string | null;
  middleName?: string | null;
  accountLevel?: string | null;
  email: string;
  phoneNumber: number | null;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  accountStatus: string;
  userName: string | null;
  dateOfBirth: string | null;
  image: {
    key: string | number | null;
    url: string | null;
  };
  refreshToken: string;
  kyc: KycStatus;
  wallet: {
    pinSet: boolean;
  };
  twoFactorAuthEnabled: boolean;
  lastUserNameChange: string | null;
  cooperateAccountVerificationRequest: {
    status: string;
    businessName: string;
    id: string;
  } | null;
  withdrawalAddress:
    | {
        id: string;
        address: string;
        network: string;
        asset: string | null;
        name: string;
      }[]
    | null;

  hasAppliedToBecomeAMerchant: boolean;
  bankAccounts: {
    [key: string]: any;
  }[];
};

interface UserState {
  isAuthenticated: boolean;
  user:
    | TUser
    | {
        [key: string]: any;
      }
    | null;
  token: string | null;
  kyc: KycStatus | null;

  twoFactorAuthEnabled: boolean;
  wallet: {
    pinSet: boolean;
  } | null;
}

interface RootState {
  wallet: WalletState;
  user: UserState;
}

interface Order {
  adType: string;
  type: string;
  reference: string;
  asset: string;
  amount: number;
  price: number;
  quantity: number;
  createdAt: string;
  merchant?: { userName: string };
  buyer?: { userName: string };
}

interface TCorporateInfo {
  userId: string;
  cacApplicationDocument: File | null;
  mermartDocument?: File | null;
  cacDocument: File | null;
}

interface IAdRequest {
  type: string;
  priceType: string;
  currency: string;
  priceMargin: number;
  asset: string;
  amount: number | undefined;
  amountToken: number | undefined;
  price: number | undefined;
  minimumLimit: number | undefined;
  maximumLimit: number | undefined;
  priceUpperLimit: number | undefined;
  priceLowerLimit: number | undefined;
  agree?: boolean;
}

type Prices = {
  xNGN: number;
  BTC: number;
  SOL: number;
  ETH: number;
  USDT: number;
  BTC_TEST: number;
  SOL_TEST: number;
  ETH_TEST5: number;
  USDT_ETH_TEST5_KDZ7: number;
  TRX_TEST: number;
  USDT_TRX_TEST: number;
  USDT_SOL_TEST: number;
  USDT_TRC20: number;
  USDT_SOL: number;
  TRX: number;
  USDT_TRX: number;
  // trx:usdt: number;,
};

type AdsPayload = {
  userId: any;
  asset: string;
  type: string;
  amount: number;
  minimumLimit: number;
  maximumLimit: number;
  priceType: string;
  price: number;
  priceMargin: number;
  priceUpperLimit: number;
  priceLowerLimit: number;
};

type UpdateAdStatusVars = {
  userId: string;
  adId: string;
  status: string;
};
type UpdateNotificationStatusVars = {
  id: string;
};

type AdsTypes = {
  id: string;
  type: string;
  status: string;
  asset: "BTC" | "USDT" | "SOL" | "ETH" | string;
  amount: number;
  amountAvailable: number;
  amountFilled: number;
  priceType: string;
  price: number;
  priceMargin: number;
  minimumLimit: number;
  maximumLimit: number;
  createdAt: string; // ISO timestamp
};

interface User {
  firstName: string;
  id: string;
  lastName: string;
  userName: string;
}

interface OrderHistory {
  adType: "sell" | "buy";
  adsId: string;
  amount: number;
  asset: string;
  buyer: User;
  buyerId: string;
  createdAt: string;
  id: string;
  merchant: User;
  merchantId: string;
  network: string | null;
  networkFee: number;
  networkFeeInUSD: number;
  price: number;
  quantity: number;
  reference: string;
  status: "completed" | string;
  transactionFee: number;
  transactionFeeInNGN: number;
  transactionFeeInUSD: number | null;
  transactionFeePaid: boolean;
  transactionFeeReference: string;
  transactionId: string | null;
  type: "buy" | "sell";
  updatedAt: string;
}

type AdsType = {
  id: string;
  userId: string;
  type: string;
  orderType: "buy" | "sell" | string;
  asset: any;
  amount: number;
  amountAvailable: number;
  amountFilled: number;
  minimumLimit: number;
  maximumLimit: number;
  expiryDate: string;
  currency: string;
  priceType: string;
  price: number;
  priceMargin: number;
  priceUpperLimit: number;
  priceLowerLimit: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    userName: string;
  };
};

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string; // URL to coin’s logo
  current_price: number; // in selected vs_currency
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number; // all-time high
  ath_change_percentage: number;
  ath_date: string; // ISO timestamp
  atl: number; // all-time low
  atl_change_percentage: number;
  atl_date: string; // ISO timestamp
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string; // ISO timestamp
}

interface ChartData {
  asset: string;
  buy: number;
  sell: number;
}

interface TNotification {
  createdAt: string;
  deviceToken: string;
  id: string;
  message: string;
  metadata: {};
  read: boolean;
  title: string;
  updatedAt: string;
  user: string;
  userId: string;
}
interface NotificationState {
  notifications: TNotification[] | null;
  loading: boolean;
  totalNotification: number;
  unreadNotifications: number;
}
type AssetType = {
  Asset: string;
  Balance: number;
  name: string;
  logo: string;
  USDRate: number;
  NairaRate: number;
};

type TOrder = {
  type: string;
  reference: string;
  asset: string;
  amount: number;
  price: number;
  quantity: number;
  buyer: { userName: string };
  createdAt: string;
};

type Banks = {
  bank_code: string;
  bank_logo: string;
  bank_name: string;
  bank_type: string;
  country_code: string;
  currency_code: string;
  ussd_code: string | null;
  ussd_transfer_code: string | null;
};

type TBank = {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
};

type UserDetails = {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
};

type UserTransactionLimits = {
  dailyCryptoWithdrawalLimit: string;
  dailyFiatWithdrawalLimit: string;
  totalUsedAmountCrypto: number;
  totalUsedAmountCryptoCurrency: string;
  totalUsedAmountFiat: number;
  totalUsedAmountFiatCurrency: string;
};

type UserBalanceType =
  | {
      balanceTotal: number;
      lockedBalanceTotal: number;
    }
  | undefined;

type TWallet = {
  id: string;
  userId: string;
  xNGN: number;
  SOL: number;
  BTC: number;
  USDT: number;
  ETH: number;
  xNGNLocked: number;
  SOLLocked: number;
  BTCLocked: number;
  USDTLocked: number;
  ETHLocked: number;
  NGNMaxDailyWithdrawalLimit: string;
  USDMaxDailyWithdrawalLimit: string;
  AdsLimit: {
    buy: number;
    sell: number;
  };
  vaultAccountId: string;
  activated: boolean;
  onHold: boolean;
  blockWallet: boolean;
  pin: string | null;
  pinSet: boolean;
  createdAt?: string;
  updatedAt?: string;
  bankAccount: TBank[];
  cryptoAssests: {
    id: string;
    asset: string;
    network: string;
    assetId: string;
    address: string;
  }[];
};

type TokenTypes = "xNGN" | "SOL" | "BTC" | " USDT" | " ETH";
