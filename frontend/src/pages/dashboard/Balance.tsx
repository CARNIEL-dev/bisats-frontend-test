import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/app_route";
import {
  getCryptoRates,
  setWalletCurrency,
  toggleShowBalance,
} from "@/redux/actions/walletActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { cn, formatter } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Eye, EyeClosed } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";

const Balance = ({ showWithdraw }: { showWithdraw?: boolean }) => {
  const { showBalance, defaultCurrency: currency } = useSelector(
    (state: { wallet: WalletState }) => state.wallet
  );

  const walletData = useSelector((state: RootState) => state.wallet.wallet);

  //SUB: Query function
  const {
    data: currencyRate,
    isFetching,
    isError,
  } = useQuery<CryptoRates, Error>({
    queryKey: ["balance"],
    queryFn: getCryptoRates,
    refetchOnMount: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: Boolean(walletData),
  });

  const userBalance = useMemo<number | undefined>(() => {
    if (!walletData || !currencyRate) return;

    //? Sum up USDT variants into one total
    const usdtTotal =
      (walletData.USDT_ETH ?? 0) +
      (walletData.USDT_TRX ?? 0) +
      (walletData.USDT_SOL ?? 0);

    //? Build an array of [assetKey, amount] pairs
    const entries: [string, number][] = [
      ["bitcoin", walletData.BTC ?? 0],
      ["ethereum", walletData.ETH ?? 0],
      ["solana", walletData.SOL ?? 0],
      ["tron", walletData.TRX ?? 0],
      ["usd", usdtTotal],
      ["xNGN", walletData.xNGN ?? 0],
    ];

    return entries.reduce((total, [asset, amount]) => {
      if (amount <= 0) return total;

      let rate = currencyRate[asset as keyof CryptoRates]?.[currency] ?? 0;

      //? Special xNGN handling: if we're not viewing NGN, convert via the NGN rate
      if (asset === "xNGN" && currency !== "ngn") {
        const ngnRate = currencyRate.usd?.ngn ?? 1;
        rate = 1 / ngnRate;
      }

      return total + amount * rate;
    }, 0);
  }, [walletData, currencyRate, currency]);

  return (
    <div className="border  flex flex-col gap-2 p-6 rounded-2xl">
      <div className="flex items-center gap-1">
        <p className="font-semibold text-neutral-800">Total Balance</p>
        <Button
          variant="ghost"
          disabled={isFetching}
          className={cn(
            "p-0! h-fit w-fit hover:bg-transparent hover:scale-110"
          )}
          onClick={toggleShowBalance}
        >
          {showBalance ? (
            <EyeClosed className="!size-5" />
          ) : (
            <Eye className="!size-5" />
          )}
        </Button>
      </div>
      <div className="flex items-baseline gap-3">
        {isFetching ? (
          <ThreeDot
            variant="pulsate"
            color={["#F5BB00", "#000"]}
            size="small"
            text=""
            textColor=""
            speedPlus={-2}
          />
        ) : isError ? (
          <span className="text-red-500 font-normal ">Error</span>
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="text-[28px] md:text-[34px] font-extrabold inline-block">
              {currency === "usd" ? "$" : "₦"}
            </span>
            {showBalance ? (
              <p className="font-extrabold space-x-0.5">
                <span className="text-2xl md:text-4xl">
                  {
                    formatter({})
                      .format(userBalance ?? 0)
                      .split(".")[0]
                  }
                </span>
                <span className={`mr-[4px] text-base md:text-xl `}>
                  .{" "}
                  {
                    formatter({})
                      .format(userBalance ?? 0)
                      .split(".")[1]
                  }
                </span>
              </p>
            ) : (
              <p className="font-semibold text-xl md:text-3xl self-end"> ***</p>
            )}
          </div>
        )}

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none text-sm">
              <div className="flex items-center gap-0.5 uppercase">
                {currency}
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={(val) => setWalletCurrency(val as "usd" | "ngn")}
              >
                <DropdownMenuRadioItem value="usd">USD</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ngn">NGN</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex gap-2  md:mt-10 mt-6 ">
        <Link
          to={APP_ROUTES.WALLET.DEPOSIT}
          className={cn(buttonVariants({}), "flex-1 py-6")}
        >
          Deposit
        </Link>
        {showWithdraw && (
          <Link
            to={APP_ROUTES.WALLET.WITHDRAW}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "flex-1 py-6"
            )}
          >
            Withdraw
          </Link>
        )}
      </div>
    </div>
  );
};

export default Balance;
