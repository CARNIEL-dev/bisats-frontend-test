import { useMemo, useState } from "react";
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
  setWalletCurrency,
  toggleShowBalance,
  useCryptoRates,
} from "@/redux/actions/walletActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { cn, formatter, getCurrencyBalance } from "@/utils";
import { ChevronDown, Eye, EyeClosed } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";

const Balance = ({ showWithdraw }: { showWithdraw?: boolean }) => {
  const {
    showBalance,
    defaultCurrency: currency,
    wallet,
  } = useSelector((state: { wallet: WalletState }) => state.wallet);
  const [isLoading, setIsLoading] = useState(true);

  //SUB: Query function

  const {
    data: currencyRate,
    isFetching,
    isError,
  } = useCryptoRates({ isEnabled: Boolean(wallet) });

  const defaultAssetsData = useMemo(
    () => [
      {
        name: "Bitcoin",
        Balance: wallet?.BTC ?? 0,
        USDRate: currencyRate?.bitcoin?.usd ?? 0,
        NairaRate: currencyRate?.bitcoin?.ngn ?? 0,
      },
      {
        name: "Ethereum",
        Balance: wallet?.ETH ?? 0,
        USDRate: currencyRate?.ethereum?.usd ?? 0,
        NairaRate: currencyRate?.ethereum?.ngn ?? 0,
      },
      {
        name: "Solana",
        Balance: wallet?.SOL ?? 0,
        USDRate: currencyRate?.solana?.usd ?? 0,
        NairaRate: currencyRate?.solana?.ngn ?? 0,
      },
      {
        name: "Tether USD",
        Balance: wallet?.USDT ?? 0,
        USDRate: currencyRate?.usd?.usd ?? 0,
        NairaRate: currencyRate?.usd?.ngn ?? 0,
      },
      {
        name: "xNGN",
        Balance: wallet?.xNGN ?? 0,
        USDRate: currencyRate?.usd?.usd ?? 0,
        NairaRate: currencyRate?.usd?.ngn ?? 0,
      },
    ],
    [currencyRate, wallet]
  );

  const userBalance = useMemo<number | undefined>(() => {
    if (!wallet || !currencyRate) return;
    setIsLoading(false);
    return defaultAssetsData.reduce((total, asset) => {
      const currencyBal = getCurrencyBalance({
        item: asset,
        isXNGN: asset.name === "xNGN",
        defaultCurrency: currency,
      });
      return currencyBal + total;
    }, 0);
  }, [currencyRate, wallet, currency]);

  return (
    <div className="border  flex flex-col gap-2 p-6 rounded-2xl">
      <div className="flex items-center gap-1">
        <p className="font-semibold text-neutral-800">Total Balance</p>
        <Button
          variant="default"
          disabled={isFetching}
          className={cn("p-0! h-fit w-fit bg-primary/20 ")}
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
        {isFetching || isLoading ? (
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
          <div className="flex items-center gap-0.5 mt-2">
            <span className="text-[28px] md:text-[34px] font-extrabold inline-block">
              {currency !== undefined && currency === "ngn" ? "₦" : "$"}
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
            <DropdownMenuTrigger className="outline-none text-sm bg-neutral-100 py-1 px-1.5 rounded-md border">
              <div className="flex items-center gap-0.5 uppercase">
                {currency || "USD"}
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={currency || "usd"}
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
