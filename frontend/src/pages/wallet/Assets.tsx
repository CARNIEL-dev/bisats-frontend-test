import { tokenLogos } from "@/assets/tokens";
import Empty from "@/components/Empty";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button, buttonVariants } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { APP_ROUTES } from "@/constants/app_route";
import { assets } from "@/data";
import PreLoader from "@/layouts/PreLoader";
import {
  toggleShowBalance,
  useCryptoRates,
} from "@/redux/actions/walletActions";
import { cn, formatter, getCurrencyBalance } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import KycManager from "../kyc/KYCManager";
import { ACTIONS } from "@/utils/transaction_limits";

export enum Fields {
  Asset = "Asset",
  Balance = "Balance",
  Empty = "",
}

export interface Asset {
  Asset: string;
  Balance: number;
  name: string;
  Rate: number;
}

interface TableProps {
  data: Array<any>;
  livePrices?: any;
}

export type PriceData = {
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
};

const Assets: React.FC = () => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const wallet = walletState.wallet;
  const userState: UserState = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const {
    data: currencyRate,
    isError,
    error,
    isFetching,
  } = useCryptoRates({ isEnabled: Boolean(wallet) });

  const defaultAssetsData = useMemo(
    () => [
      {
        Asset: assets.BTC,
        name: "Bitcoin",
        Balance: wallet?.BTC ?? 0,
        USDRate: currencyRate?.bitcoin?.usd ?? 0,
        NairaRate: currencyRate?.bitcoin?.ngn ?? 0,
        logo: tokenLogos.BTC,
      },
      {
        Asset: assets.ETH,
        name: "Ethereum",
        Balance: wallet?.ETH ?? 0,
        USDRate: currencyRate?.ethereum?.usd ?? 0,
        NairaRate: currencyRate?.ethereum?.ngn ?? 0,
        logo: tokenLogos.ETH,
      },
      {
        Asset: assets.SOL,
        name: "Solana",
        Balance: wallet?.SOL ?? 0,
        USDRate: currencyRate?.solana?.usd ?? 0,
        NairaRate: currencyRate?.solana?.ngn ?? 0,
        logo: tokenLogos.SOL,
      },
      {
        Asset: assets.USDT,
        name: "Tether USD",
        Balance: wallet?.USDT ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
        logo: tokenLogos.USDT,
      },
      {
        Asset: assets.xNGN,
        name: "Naira on Bisats",
        Balance: wallet?.xNGN ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
        logo: tokenLogos.xNGN,
      },
    ],
    [currencyRate, wallet]
  );

  //   HDR: columns
  const column: ColumnDef<AssetType>[] = [
    {
      accessorKey: "Asset",
      header: "Asset",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img
              src={item.logo}
              alt={item.name}
              className="md:size-6  size-5"
            />
            <div className="flex md:flex-col items-center md:items-start gap-x-1">
              <p className="font-semibold">{item.Asset}</p>
              <p className="text-xs">{item.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "Balance",

      header: () => {
        return (
          <div className="flex items-center gap-1">
            <span>Balance</span>
            <Button
              variant="default"
              disabled={isFetching}
              className={cn(
                "p-0! h-[1.5rem] w-fit bg-primary/20  hidden lg:flex"
              )}
              onClick={toggleShowBalance}
            >
              {walletState.showBalance ? (
                <Eye className="!size-5" />
              ) : (
                <EyeOff className="!size-5" />
              )}
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        const item = row.original;
        const isXNGN = item.Asset === assets.xNGN;
        const isUSDT = item.Asset === assets.USDT;

        return (
          <div className="flex md:items-center items-end md:flex-row flex-col gap-x-2 gap-y-1 text-sm text-gray-600">
            <p className="font-bold">
              <span className="font-mono text-xl md:text-base">
                {walletState.showBalance
                  ? formatter({ decimal: isXNGN ? 2 : isUSDT ? 2 : 6 }).format(
                      Number(item.Balance) || 0
                    )
                  : "***"}
              </span>{" "}
              <span className="font-normal">{item.Asset}</span>
            </p>
            {walletState.showBalance && (
              <p className="text-xs font-medium">
                ~{" "}
                {formatter({
                  decimal: 0,
                  style: "currency",
                  currency:
                    walletState.defaultCurrency === "usd" ? "USD" : "NGN",
                }).format(
                  getCurrencyBalance({
                    defaultCurrency: walletState.defaultCurrency,
                    item,
                    isXNGN,
                  })
                )}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",

      cell: ({ row }) => {
        const asset = row.original.Asset;
        return (
          <div className="flex items-center gap-2 w-full justify-end">
            <KycManager
              action={
                asset === assets.xNGN
                  ? ACTIONS.DEPOSIT_NGN
                  : ACTIONS.DEPOSIT_CRYPTO
              }
              func={() =>
                navigate(APP_ROUTES.WALLET.DEPOSIT, {
                  state: { asset: row.original.Asset },
                })
              }
            >
              {(validateAndExecute) => (
                <Button
                  className={cn(" text-xs text-black")}
                  onClick={() => {
                    validateAndExecute();
                  }}
                  disabled={
                    userState?.user?.accountStatus === "pending" &&
                    !userState.user.accountLevel
                  }
                >
                  {userState?.user?.accountStatus === "pending" &&
                  !userState.user.accountLevel
                    ? "Pending"
                    : "Deposit"}
                </Button>
              )}
            </KycManager>

            <KycManager
              action={ACTIONS.WITHDRAW}
              func={() =>
                navigate(APP_ROUTES.WALLET.WITHDRAW, {
                  state: { asset: row.original.Asset },
                })
              }
            >
              {(validateAndExecute) => (
                <Button
                  variant={"outline"}
                  className={cn(
                    "bg-transparent text-gray-600 !border-primary text-xs"
                  )}
                  onClick={() => {
                    validateAndExecute();
                  }}
                  disabled={
                    userState?.user?.accountStatus === "pending" &&
                    !userState.user.accountLevel
                  }
                >
                  {userState?.user?.accountStatus === "pending" &&
                  !userState.user.accountLevel
                    ? "Pending"
                    : "Withdraw"}
                </Button>
              )}
            </KycManager>
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      {isFetching ? (
        <div className="h-[40dvh] grid place-content-center">
          <PreLoader />
        </div>
      ) : isError ? (
        <div className="h-[40dvh] grid place-content-center">
          <ErrorDisplay
            message={error?.message || "Failed to load assets balance"}
          />
        </div>
      ) : defaultAssetsData.length === 0 || !currencyRate ? (
        <Empty />
      ) : (
        <>
          <DataTable
            columns={column}
            data={defaultAssetsData}
            paginated={false}
          />
        </>
      )}
    </div>
  );
};

export default Assets;
