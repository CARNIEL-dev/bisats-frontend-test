import { BTC, ETH, NGN, SOL, USDT } from "@/assets/tokens";
import Empty from "@/components/Empty";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button, buttonVariants } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { APP_ROUTES } from "@/constants/app_route";
import { assets } from "@/data";
import PreLoader from "@/layouts/PreLoader";
import { GetLivePrice, toggleShowBalance } from "@/redux/actions/walletActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { TWallet } from "@/types/wallet";
import { cn, formatter } from "@/utils";
import { convertAssetToNaira, convertAssetToUSD } from "@/utils/conversions";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeClosed } from "lucide-react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

  console.log("Wallet", walletState);

  const {
    data: livePrices,
    isError,
    error,
    isFetching,
  } = useQuery<PriceData, Error>({
    queryKey: ["tokenLivePrices"],
    queryFn: GetLivePrice,
    retry: false,
    refetchOnMount: false,
    staleTime: Infinity,
    enabled: Boolean(wallet),
  });

  const defaultAssetsData = useMemo(
    () => [
      {
        Asset: assets.BTC,
        name: "Bitcoin",
        Balance: wallet?.BTC ?? 0,
        Rate: livePrices?.BTC ?? 0,
        logo: BTC,
      },
      {
        Asset: assets.ETH,
        name: "Ethereum",
        Balance: wallet?.ETH ?? 0,
        Rate: livePrices?.ETH ?? 0,
        logo: ETH,
      },
      {
        Asset: assets.SOL,
        name: "Solana",
        Balance: wallet?.SOL ?? 0,
        Rate: livePrices?.SOL ?? 0,
        logo: SOL,
      },
      {
        Asset: assets.USDT,
        name: "Tether USD",
        Balance: wallet?.USDT ?? 0,
        Rate: livePrices?.USDT ?? 0,
        logo: USDT,
      },
      {
        Asset: assets.xNGN,
        name: "Naira on Bisats",
        Balance: wallet?.xNGN ?? 0,
        Rate: livePrices?.xNGN ?? 0,
        logo: NGN,
      },
    ],
    [livePrices, wallet]
  );

  const nairaRate = useMemo(() => {
    const rate = defaultAssetsData.find((item) => item.Asset === assets.xNGN);
    return rate?.Rate || 0;
  }, [defaultAssetsData]);

  //   HDR: columns
  const column: ColumnDef<Asset & { logo: string }>[] = [
    {
      accessorKey: "Asset",
      header: "Asset",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img src={item.logo} alt={item.name} className="h-6 w-6 " />
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
              className={cn("p-0! h-[1.5rem] w-fit bg-primary/20 ")}
              onClick={toggleShowBalance}
            >
              {walletState.showBalance ? (
                <EyeClosed className="!size-5" />
              ) : (
                <Eye className="!size-5" />
              )}
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        const item = row.original;
        const isXNGN = item.Asset === assets.xNGN;
        const isUSDT = item.Asset === assets.USDT;

        const USDPrice =
          convertAssetToUSD(item.Asset, item.Balance, livePrices!) || 0;
        const NGNPrice = convertAssetToNaira(
          item.Asset as keyof Prices,
          item.Balance,
          item.Rate,
          livePrices!
        );

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
                  walletState.defaultCurrency === "usd"
                    ? Number(USDPrice) || 0
                    : isXNGN
                    ? Number(item.Balance) || 0
                    : isUSDT
                    ? Number(NGNPrice) * nairaRate
                    : Number(NGNPrice) || 0
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
        return (
          <div className="flex items-center gap-2 w-full justify-end">
            <Link
              to={APP_ROUTES.WALLET.DEPOSIT}
              state={{ asset: row.original.Asset }}
              className={cn(buttonVariants(), " text-xs text-black")}
            >
              Deposit
            </Link>
            <Link
              to={APP_ROUTES.WALLET.WITHDRAW}
              state={{ asset: row.original.Asset }}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-transparent text-gray-600 !border-primary text-xs"
              )}
            >
              Withdraw
            </Link>
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
      ) : defaultAssetsData.length === 0 || !livePrices ? (
        <Empty />
      ) : (
        <>
          <DataTable
            columns={column}
            data={defaultAssetsData}
            paginated={false}
          />

          {/* Mobile table for xs screens */}
          {/* <MobileTable data={openAssets} livePrices={tokenLivePrices} /> */}
        </>
      )}
    </div>
  );
};

export default Assets;

// Mobile version of the table for smaller screens
const MobileTable: React.FC<TableProps> = ({ data, livePrices }) => {
  return (
    <div className="sm:hidden w-full">
      {data?.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col p-4 mb-2 rounded"
          style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }}
        >
          <div className="flex justify-between items-center w-full mb-2">
            <div className="flex items-center">
              <img
                src="/Icon/NGN.png"
                alt="logo"
                className="h-[24px] w-[24px] mr-[8px]"
              />
              <div>
                <p
                  style={{ color: "#515B6E", fontSize: "14px" }}
                  className="font-semibold"
                >
                  {row.Asset}
                </p>
                <p style={{ color: "#606C82", fontSize: "12px" }}>{row.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                style={{ color: "#515B6E", fontSize: "14px" }}
                className="font-semibold"
              >
                {row.Balance}
              </p>
              <p style={{ color: "#606C82", fontSize: "12px" }}>
                {" "}
                ~ {convertAssetToUSD(row?.Asset, row?.Balance, livePrices)} USD
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
