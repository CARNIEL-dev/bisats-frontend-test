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

interface CryptoRates {
  bitcoin?: { usd: number; ngn: number };
  ethereum?: { usd: number; ngn: number };
  solana?: { usd: number; ngn: number };
  tron?: { usd: number; ngn: number };
  usd?: { usd: number; ngn: number };
}

interface RootState {
  wallet: WalletState;
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
