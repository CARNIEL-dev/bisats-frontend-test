import { tokenLogos } from "@/assets/tokens";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  setWalletCurrency,
  toggleShowBalance,
  useCryptoRates,
} from "@/redux/actions/walletActions";
import { formatter, getCurrencyBalance } from "@/utils";
import { ChevronDown, Eye, EyeOff, Wallet } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const QuickWallet = () => {
  const { wallet, showBalance, defaultCurrency } = useSelector(
    (state: { wallet: WalletState }) => state.wallet
  );

  const { data: currencyRate, isFetching } = useCryptoRates({
    isEnabled: Boolean(wallet),
  });

  const assetsData = useMemo(
    () => [
      {
        asset: "BTC",
        name: "Bitcoin",
        Balance: wallet?.BTC ?? 0,
        USDRate: currencyRate?.bitcoin?.usd ?? 0,
        NairaRate: currencyRate?.bitcoin?.ngn ?? 0,
      },
      {
        asset: "ETH",
        name: "Ethereum",
        Balance: wallet?.ETH ?? 0,
        USDRate: currencyRate?.ethereum?.usd ?? 0,
        NairaRate: currencyRate?.ethereum?.ngn ?? 0,
      },
      {
        asset: "SOL",
        name: "Solana",
        Balance: wallet?.SOL ?? 0,
        USDRate: currencyRate?.solana?.usd ?? 0,
        NairaRate: currencyRate?.solana?.ngn ?? 0,
      },
      {
        asset: "USDT",
        name: "Tether USD",
        Balance: wallet?.USDT ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
      },
      {
        asset: "xNGN",
        name: "Naira on Bisats",
        Balance: wallet?.xNGN ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
      },
    ],
    [currencyRate, wallet]
  );

  const totals = useMemo<UserBalanceType | undefined>(() => {
    if (!wallet || !currencyRate) return;
    return assetsData.reduce(
      (totals, item) => {
        const isXNGN = item.asset === "xNGN";
        const val = getCurrencyBalance({
          item,
          isXNGN,
          defaultCurrency: defaultCurrency || "usd",
        });
        return {
          balanceTotal: totals.balanceTotal + val,
          lockedBalanceTotal: 0,
        };
      },
      { balanceTotal: 0, lockedBalanceTotal: 0 }
    );
  }, [assetsData, wallet, currencyRate, defaultCurrency]);

  const symbol = defaultCurrency === "ngn" ? "₦" : "$";

  return (
    <Sheet>
      <SheetTrigger className=" bg-primary flex items-center fixed right-0 top-[20%] z-50 px-3 py-2 rounded-s-full gap-2 group transition-all duration-400">
        <Wallet className="size-6 scale-100 group-hover:scale-110" />
        <span className="text-xs hidden group-hover:block font-semibolds">
          Your Wallet
        </span>

        <span className="sr-only">Open Wallet</span>
      </SheetTrigger>
      <SheetContent className="w-screen sm:max-w-none sm:w-[460px] md:w-[540px] lg:w-[600px]">
        <SheetHeader className="gap-0.5">
          <SheetTitle className="text-2xl">Your Wallet</SheetTitle>
          <SheetDescription>Quick access to your wallet</SheetDescription>
        </SheetHeader>

        <div className=" flex flex-col gap-2 mx-4 md:mx-8">
          <div className="flex items-center gap-2">
            <h4 className="text-lg md:text-xl font-semibold">Your Balance</h4>
            <Button
              variant="default"
              className="size-10 rounded-full bg-primary/20"
              onClick={toggleShowBalance}
            >
              {showBalance ? (
                <Eye className="!size-5" />
              ) : (
                <EyeOff className="!size-5" />
              )}
            </Button>
          </div>

          <div className="flex items-baseline gap-2 ">
            <span className="text-[28px] font-extrabold">{symbol}</span>
            {showBalance ? (
              <p className="font-extrabold">
                <span className="text-3xl">
                  {
                    formatter({})
                      .format(totals?.balanceTotal ?? 0)
                      .split(".")[0]
                  }
                </span>
                <span className="text-lg">
                  .
                  {
                    formatter({})
                      .format(totals?.balanceTotal ?? 0)
                      .split(".")[1]
                  }
                </span>
              </p>
            ) : (
              <p className="font-semibold text-2xl">***</p>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none text-sm bg-neutral-100 py-1 px-1.5 rounded-md border uppercase">
                <div className="flex items-center gap-0.5">
                  {defaultCurrency || "USD"}
                  <ChevronDown className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={defaultCurrency || "usd"}
                  onValueChange={(val) =>
                    setWalletCurrency(val as "usd" | "ngn")
                  }
                >
                  <DropdownMenuRadioItem value="usd">USD</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ngn">NGN</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="divide-y mt-8 rounded-lg border bg-neutral-50">
            {assetsData.map((item) => {
              const isXNGN = item.asset === "xNGN";
              const approx = getCurrencyBalance({
                defaultCurrency: defaultCurrency || "usd",
                item,
                isXNGN,
              });
              const isUSDT = item.asset === "USDT";
              return (
                <div
                  key={item.asset}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tokenLogos[item.asset as keyof typeof tokenLogos]}
                      alt={item.name}
                      className="size-7"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {item.asset}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">
                      {showBalance
                        ? `${formatter({
                            decimal: isXNGN || isUSDT ? 2 : 6,
                          }).format(Number(item.Balance) || 0)} ${item.asset}`
                        : "***"}
                    </p>
                    {showBalance && (
                      <p className="text-xs text-gray-500">
                        ~
                        {formatter({
                          decimal: 0,
                          style: "currency",
                          currency: defaultCurrency === "usd" ? "USD" : "NGN",
                        }).format(approx)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {isFetching && (
              <div className="p-3 text-xs text-gray-500">Updating rates…</div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QuickWallet;
