import { BTC, ETH, NGN, SOL, USDT } from "@/assets/tokens";
import Empty from "@/components/Empty";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { buttonVariants } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { APP_ROUTES } from "@/constants/app_route";
import { assets } from "@/data";
import PreLoader from "@/layouts/PreLoader";
import { GetLivePrice } from "@/redux/actions/walletActions";
import { TWallet } from "@/types/wallet";
import { cn, formatter } from "@/utils";
import { convertAssetToUSD } from "@/utils/conversions";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
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
  const wallet: TWallet = useSelector((state: any) => state.wallet).wallet;

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
            <div>
              <p className="font-semibold">{item.Asset}</p>
              <p className="text-xs">{item.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "Balance",
      header: "Balance",
      cell: ({ row }) => {
        const item = row.original;
        const USDPrice =
          convertAssetToUSD(item.Asset, item.Balance, livePrices!) || 0;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <p className="font-semibold ">
              <span className="font-mono">
                {formatter({ decimal: 2 }).format(item.Balance)}
              </span>{" "}
              <span className="font-normal">{item.Asset}</span>
            </p>
            <p className="text-xs font-medium ">
              ~{" "}
              {formatter({
                decimal: 0,
                style: "currency",
                currency: "USD",
              }).format(USDPrice)}
            </p>
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
              className={cn(
                buttonVariants(),
                "bg-primary/30 text-xs hover:bg-primary/50"
              )}
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
    <div>
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
          <div className="hidden sm:block">
            <DataTable
              columns={column}
              data={defaultAssetsData}
              paginated={false}
            />
          </div>

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
