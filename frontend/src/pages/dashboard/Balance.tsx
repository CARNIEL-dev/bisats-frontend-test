import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import BalanceInfo from "@/components/shared/BalanceInfo";
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
import { APP_ROUTES } from "@/constants/app_route";
import {
  setWalletCurrency,
  toggleShowBalance,
  useCryptoRates,
} from "@/redux/actions/walletActions";
import { cn, formatAccountLevel, formatter, getCurrencyBalance } from "@/utils";
import { ACTIONS } from "@/utils/transaction_limits";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import KycManager from "@/pages/kyc/KYCManager";

const Balance = ({ showWithdraw }: { showWithdraw?: boolean }) => {
  const navigate = useNavigate();
  const userState: UserState = useSelector((state: any) => state.user);
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
  } = useCryptoRates({ isEnabled: Boolean(wallet && userState.user?.userId) });

  const defaultAssetsData = useMemo(
    () => [
      {
        name: "Bitcoin",
        Balance: Number(wallet?.BTC) ?? 0,
        USDRate: currencyRate?.bitcoin?.usd ?? 0,
        NairaRate: currencyRate?.bitcoin?.ngn ?? 0,
        lockedBalance: Number(wallet?.BTCLocked) ?? 0,
      },
      {
        name: "Ethereum",
        Balance: Number(wallet?.ETH) ?? 0,
        USDRate: currencyRate?.ethereum?.usd ?? 0,
        NairaRate: currencyRate?.ethereum?.ngn ?? 0,
        lockedBalance: Number(wallet?.ETHLocked) ?? 0,
      },
      {
        name: "Solana",
        Balance: Number(wallet?.SOL) ?? 0,
        USDRate: currencyRate?.solana?.usd ?? 0,
        NairaRate: currencyRate?.solana?.ngn ?? 0,
        lockedBalance: Number(wallet?.SOLLocked) ?? 0,
      },
      {
        name: "Tether USD",
        Balance: Number(wallet?.USDT) ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
        lockedBalance: Number(wallet?.USDTLocked) ?? 0,
      },
      {
        name: "xNGN",
        Balance: Number(wallet?.xNGN) ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
        lockedBalance: Number(wallet?.xNGNLocked) ?? 0,
      },
    ],
    [currencyRate, wallet],
  );

  const userBalance = useMemo<UserBalanceType>(() => {
    if (!wallet || !currencyRate) return;
    setIsLoading(false);

    return defaultAssetsData.reduce(
      (totals, asset) => {
        const balance = getCurrencyBalance({
          item: asset,
          isXNGN: asset.name === "xNGN",
          defaultCurrency: currency,
        });

        // If you have locked balances, replace 0 with the actual locked value
        const lockedBalance = getCurrencyBalance({
          item: asset,
          isXNGN: asset.name === "xNGN",
          defaultCurrency: currency,
          type: "locked",
          lockedBalance: asset.lockedBalance ?? 0,
        });

        return {
          balanceTotal: totals.balanceTotal + balance,
          lockedBalanceTotal: totals.lockedBalanceTotal + lockedBalance,
        };
      },
      { balanceTotal: 0, lockedBalanceTotal: 0 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyRate, wallet, currency, userState.user?.userId]);

  const { isNA } = formatAccountLevel(userState?.user?.accountLevel);

  return (
    <div className="border  flex flex-col gap-2 p-6 rounded-2xl">
      <div className="flex items-center gap-1">
        <p className="font-semibold text-neutral-800">Balance</p>
        <Button
          variant="default"
          disabled={isFetching}
          className={cn("p-0! size-10 rounded-full bg-primary/20 ")}
          onClick={toggleShowBalance}
        >
          {showBalance ? (
            <Eye className="!size-5" />
          ) : (
            <EyeOff className="!size-5" />
          )}
        </Button>
        <BalanceInfo
          className="ml-auto"
          userBalance={userBalance}
          currency={currency}
          wallet={wallet as TWallet}
        />
      </div>
      <div className="flex items-baseline gap-3">
        {isLoading || isFetching ? (
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
                      .format(userBalance?.balanceTotal ?? 0)
                      .split(".")[0]
                  }
                </span>
                <span className={`mr-[4px] text-base md:text-xl `}>
                  .{" "}
                  {
                    formatter({})
                      .format(userBalance?.balanceTotal ?? 0)
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
        <KycManager
          action={ACTIONS.DEPOSIT_CRYPTO}
          func={() => navigate(APP_ROUTES.WALLET.DEPOSIT)}
        >
          {(validateAndExecute) => (
            <Button
              className={cn("flex-1 py-6")}
              onClick={() => {
                validateAndExecute();
              }}
              disabled={isNA}
            >
              {isNA && userState?.user?.hasAppliedToBeInLevelOne
                ? !showWithdraw
                  ? "Pending verification"
                  : "Pending"
                : "Deposit"}
            </Button>
          )}
        </KycManager>
        <KycManager
          action={ACTIONS.MAKE_TRANSFER}
          func={() => navigate(APP_ROUTES.WALLET.TRANSFER)}
        >
          {(validateAndExecute) => (
            <Button
              variant={"secondary"}
              className={cn("flex-1 py-6")}
              onClick={() => {
                validateAndExecute();
              }}
              disabled={isNA}
            >
              {isNA && userState?.user?.hasAppliedToBeInLevelOne
                ? !showWithdraw
                  ? "Pending verification"
                  : "Pending"
                : "Transfer"}
            </Button>
          )}
        </KycManager>

        {showWithdraw && (
          <KycManager
            action={ACTIONS.WITHDRAW}
            func={() => navigate(APP_ROUTES.WALLET.WITHDRAW)}
          >
            {(validateAndExecute) => (
              <Button
                variant={"secondary"}
                className={cn("flex-1 py-6")}
                onClick={() => {
                  validateAndExecute();
                }}
                disabled={isNA}
              >
                {userState?.user?.hasAppliedToBeInLevelOne && isNA
                  ? "Pending"
                  : "Withdraw"}
              </Button>
            )}
          </KycManager>
        )}
      </div>
    </div>
  );
};

export default Balance;
