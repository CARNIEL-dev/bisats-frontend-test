import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/constants/app_route";
import { GetWallet } from "@/redux/actions/walletActions";
import { cn, formatter } from "@/utils";
import { ChevronDown, Eye, EyeClosed } from "lucide-react";

const Balance = ({ showWithdraw }: { showWithdraw?: boolean }) => {
  const dispatch = useDispatch();

  const [showBalance, setShowBalance] = useState(true);
  const [currency, setCurrency] = useState<string>("USD");
  const [cryptoRates, setCryptoRates] = useState<CryptoRates | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const walletData = useSelector((state: RootState) => state.wallet.wallet);
  const walletError = useSelector((state: RootState) => state.wallet.error);

  console.log(walletError, "walletError");

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await dispatch(GetWallet() as any);
      } catch (err) {
        console.error("Error fetching wallet:", err);
      }
    };

    fetchWalletData();
  }, [dispatch]);

  // Fetch crypto rates when wallet data is available
  useEffect(() => {
    const fetchCryptoRates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tron,usd&vs_currencies=usd,ngn"
        );

        if (response.ok) {
          const data = await response.json();
          setCryptoRates(data);
        }
      } catch (err) {
        console.error("Error fetching crypto rates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (walletData && !cryptoRates) {
      fetchCryptoRates();
    }
  }, [walletData, cryptoRates]);

  //? Calculate total balance when rates are available
  useEffect(() => {
    if (walletData && cryptoRates) {
      calculateTotalBalance();
    }
  }, [walletData, cryptoRates, currency]);

  //? Simple function to calculate the total balance
  const calculateTotalBalance = () => {
    if (!walletData || !cryptoRates) return;

    const currencyKey = currency.toLowerCase() as "usd" | "ngn";
    let total = 0;

    // Bitcoin
    if (walletData.BTC && cryptoRates.bitcoin) {
      total += walletData.BTC * cryptoRates.bitcoin[currencyKey];
    }

    // Ethereum
    if (walletData.ETH && cryptoRates.ethereum) {
      total += walletData.ETH * cryptoRates.ethereum[currencyKey];
    }

    // Solana
    if (walletData.SOL && cryptoRates.solana) {
      total += walletData.SOL * cryptoRates.solana[currencyKey];
    }

    // Tron
    if (walletData.TRX && cryptoRates.tron) {
      total += walletData.TRX * cryptoRates.tron[currencyKey];
    }

    // USDT (all types)
    const usdtTotal =
      (walletData.USDT_ETH || 0) +
      (walletData.USDT_TRX || 0) +
      (walletData.USDT_SOL || 0);

    if (usdtTotal > 0 && cryptoRates.usd) {
      total += usdtTotal * cryptoRates.usd[currencyKey];
    }

    // xNGN
    if (walletData.xNGN) {
      if (currency === "NGN") {
        total += walletData.xNGN;
      } else if (cryptoRates.usd && cryptoRates.usd.ngn) {
        // Convert NGN to USD
        total += walletData.xNGN / cryptoRates.usd.ngn;
      }
    }

    setTotalBalance(total);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const getCurrencySymbol = () => {
    return currency === "USD" ? "$" : "₦";
  };

  return (
    <div className="border  flex flex-col gap-2 p-4 md:p-6 rounded-2xl">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-neutral-800">Total Balance</p>
        <Button
          variant="ghost"
          disabled={isLoading}
          className={cn(
            "p-0! h-fit w-fit hover:bg-transparent hover:scale-110"
          )}
          onClick={toggleBalanceVisibility}
        >
          {showBalance ? (
            <EyeClosed className="w-5! h-5!" />
          ) : (
            <Eye className="w-5! h-5!" />
          )}
        </Button>
      </div>
      <div className="flex items-baseline gap-3">
        {isLoading ? (
          <Skeleton className="w-24 h-10" />
        ) : walletError ? (
          <span className="text-red-500 font-normal ">
            Error loading balance
          </span>
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="text-[28px] md:text-[34px] font-medium inline-block">
              {getCurrencySymbol()}
            </span>
            {showBalance ? (
              totalBalance ? (
                <p className="font-extrabold font-mono">
                  <span className="text-2xl md:text-4xl">
                    {
                      formatter({})
                        .format(totalBalance ?? 0)
                        .split(".")[0]
                    }
                  </span>
                  <span className={`mr-[4px] text-lg md:text-2xl `}>
                    .
                    {
                      formatter({})
                        .format(totalBalance ?? 0)
                        .split(".")[1]
                    }
                  </span>
                </p>
              ) : (
                <p className="text-red-500 text-sm">Error getting balance</p>
              )
            ) : (
              <p className="font-semibold text-xl md:text-3xl self-end"> ***</p>
            )}
          </div>
        )}

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-hidden text-sm">
              <div className="flex items-center gap-0.5">
                {currency}
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={(val) => setCurrency(val)}
              >
                <DropdownMenuRadioItem value="USD">USD</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="NGN">NGN</DropdownMenuRadioItem>
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
