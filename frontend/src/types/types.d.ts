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

interface WalletState {
  wallet: WalletData | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  wallet: WalletState;
}

interface Order {
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
