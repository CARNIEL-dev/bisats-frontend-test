import Empty from "@/components/Empty";
import MobileP2PMP from "@/components/Table/MobileP2PMarketPlace";
import { buttonVariants } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { APP_ROUTES } from "@/constants/app_route";
import { AdSchema } from "@/pages/p2p/components/ExpressSwap";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Link } from "react-router-dom";

type limits = {
  available: string;
  limits: string;
};

export interface Ad {
  Merchant: string;
  "Unit Price": string;
  Limits: limits;
}

interface PaginationProps {
  page: number;
  limit: number;
  skip: number;
}

interface MarketPlaceContentProps {
  type: string;
  asset: string;
  ads: AdSchema[];
  pagination: PaginationProps;
  setPagination: React.Dispatch<React.SetStateAction<PaginationProps>>;
}

const MarketPlaceTable = ({ type, ads, asset }: MarketPlaceContentProps) => {
  //   HDR: Columns
  const column: ColumnDef<AdSchema>[] = [
    {
      accessorKey: "user",
      header: "Merchant",
      cell: ({ row }) => {
        const ad = row.original.user.userName;
        const initials = ad.charAt(0);

        return (
          <div className=" flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center size-10 border rounded-full",
                type.toLowerCase() === "sell"
                  ? "bg-red-500/10 text-red-600 border-red-300"
                  : "bg-green-600/20 text-green-600 border-green-300"
              )}
            >
              <p className="font-semibold">{initials}</p>
            </div>
            <p className="text-gray-600">{ad}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Unit Price",
      cell: ({ row }) => {
        const price = formatter({
          style: "currency",
          currency: "NGN",
          decimal: 0,
        }).format(row.original.price);
        return <span className="text-gray-600 font-medium  ">{price}</span>;
      },
    },
    {
      accessorKey: "amountAvailable",
      header: "Available",
      cell: ({ row }) => {
        const item = row.original;
        const amount =
          item.orderType === "buy"
            ? formatter({}).format(item.amountAvailable)
            : formatter({ decimal: 5 }).format(
                item.amountAvailable / item.price
              );
        return (
          <div className="text-gray-600 uppercase ">
            {amount} {item.asset}{" "}
          </div>
        );
      },
    },
    {
      id: "limits",
      header: "Limits",
      cell: ({ row }) => {
        const item = row.original;
        const minLimit = formatter({}).format(item.minimumLimit);
        const maxLimit = formatter({}).format(item.maximumLimit);

        return (
          <div className="text-gray-600 ">
            {minLimit} - {maxLimit} xNGN
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ad = row.original;

        return (
          <Link
            to={
              ad?.orderType === "buy" ? APP_ROUTES.P2P.BUY : APP_ROUTES.P2P.SELL
            }
            state={{ adDetail: ad }}
            className={cn(
              buttonVariants(),
              "capitalize text-sm px-6 font-normal"
            )}
          >
            {type}
          </Link>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      {ads.length === 0 ? (
        <div>
          <Empty text={"No Ads Available for" + " " + asset} />
        </div>
      ) : (
        <div className="w-full">
          <div className="hidden md:block">
            <DataTable data={ads} columns={column} paginated={false} />
          </div>
          <div className="md:hidden  w-full">
            <MobileP2PMP data={ads} type={type} />
          </div>
        </div>
      )}
      {/* 
      <Pagination
        currentPage={0}
        totalPages={0}
        onPageChange={() => {
          setPagination({
            limit: 10,
            skip: (pagination.page - 1) * 10,
            page: pagination?.page + 1,
          });
        }}
      /> */}
    </div>
  );
};

export default MarketPlaceTable;
