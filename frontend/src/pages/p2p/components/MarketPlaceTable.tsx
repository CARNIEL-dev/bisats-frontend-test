import Empty from "@/components/Empty";
import { buttonVariants } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { APP_ROUTES } from "@/constants/app_route";

import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck } from "lucide-react";
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
  ads: AdsType[];
  pagination: PaginationProps;
  setPagination: React.Dispatch<React.SetStateAction<PaginationProps>>;
  isSuspended: boolean;
}

const MarketPlaceTable = ({
  type,
  ads,
  asset,
  isSuspended,
}: MarketPlaceContentProps) => {
  //   HDR: Columns
  const column: ColumnDef<AdsType>[] = [
    {
      accessorKey: "user.userName",
      header: () => {
        return <span className="">Merchant</span>;
      },

      cell: ({ row }) => {
        const user = row.original.user;
        const userName = row.original.user?.userName;
        const initials = userName?.charAt(0) || "B";

        return (
          <div className="flex flex-col md:gap-2 gap-1 items-end md:items-start">
            <div className=" flex items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center size-5 border rounded-full",
                  type.toLowerCase() === "sell"
                    ? "bg-red-500/10 text-red-600 border-red-300"
                    : "bg-green-600/20 text-green-600 border-green-300",
                )}
              >
                <p className="font-semibold">{initials}</p>
              </div>
              <p className="text-gray-600 font-medium">{userName}</p>
              <div className="md:-ml-2">
                {user?.accountLevel === "level_3" && (
                  <BadgeCheck fill="#F5BB00" stroke="#fff" size={20} />
                )}
              </div>
            </div>
            <p className="text-gray-500 text-xs ml-1">
              {user?.totalOrders || "0"} Order(s)
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Unit Price",
      sortingFn: "basic",
      cell: ({ row }) => {
        const price = formatter({}).format(row.original.price);
        return (
          <div className="flex items-baseline gap-1">
            <p className="text-gray-600 md:font-semibold text-2xl font-bold md:text-xl">
              {price}
            </p>
            <p className="text-gray-500 text-xs">NGN</p>
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        // Get raw numeric value
        const priceValue = formatter({
          decimal: 2,
        }).format(row.original.price);
        const numericFilter = filterValue.replace(/\D/g, "");

        return String(priceValue).includes(numericFilter);
      },
    },
    // {
    //   id: "amountAvailable",
    //   header: "Quantity",
    //   accessorFn: (row: AdsType) => {
    //     if (row.orderType === "buy") {
    //       return row.amountAvailable;
    //     }
    //     return row.amountAvailable / row.price;
    //   },
    //   cell: ({ row }) => {
    //     const value = Number(row.getValue("amountAvailable"));
    //     const asset = row.original.asset;
    //     const formatted = formatter({
    //       decimal: asset === "USDT" ? 2 : 5,
    //     }).format(value);
    //     return (
    //       <div className="text-gray-600 uppercase">
    //         {formatted} {row.original.asset}
    //       </div>
    //     );
    //   },
    //   filterFn: (row, id, filterValue) => {
    //     const value = Number(row.getValue(id));
    //     const filterNum = parseFloat(filterValue.replace(/[^\d.]/g, "")) || 0;

    //     // Match either exact or partial number
    //     return (
    //       Math.abs(value - filterNum) < 0.00001 || // Exact match
    //       String(value).includes(String(filterNum)) // Partial match
    //     );
    //   },
    // },
    {
      id: "limits",
      header: "Quantity/Limits",
      accessorFn: (row) => ({
        min: row.minimumLimit,
        max: row.maximumLimit,
      }),
      cell: ({ row }) => {
        const amountAvailable = row.original.amountAvailable as number;
        const orderType = row.original.orderType as string;
        const price = row.original.price as number;
        const asset = row.original.asset as string;

        const quantity =
          orderType === "buy" ? amountAvailable : amountAvailable / price;
        const limits = row.getValue("limits") as { min: number; max: number };
        const minLimit = formatter({}).format(limits.min);
        const maxLimit = formatter({}).format(limits.max);

        return (
          <div className="text-gray-600">
            <p className="font-semibold text-gray-600">
              {formatter({}).format(quantity)} {asset}
            </p>
            <span>
              {minLimit} - {maxLimit} xNGN
            </span>
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        const limits = row.getValue(id) as { min: number; max: number };
        const cleanNumber = Number(filterValue.replace(/\D/g, ""));
        return limits.min === cleanNumber || limits.max === cleanNumber;
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
              isSuspended
                ? "#"
                : `${
                    ad?.orderType === "buy"
                      ? APP_ROUTES.P2P.BUY
                      : APP_ROUTES.P2P.SELL
                  }?id=${ad?.id}`
            }
            className={cn(
              buttonVariants(),
              "capitalize text-sm px-6 font-normal",
              isSuspended &&
                "cursor-not-allowed pointer-events-none opacity-50",
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
          <Empty text={`No Ads Available for ${asset}`} />
        </div>
      ) : (
        <div className="w-full">
          <DataTable
            data={ads}
            columns={column}
            paginated={false}
            sortColumns={[{ id: "price", desc: type === "buy" ? false : true }]}
            // filterColumns={["price"]}
            enableFiltering
          />
        </div>
      )}
    </div>
  );
};

export default MarketPlaceTable;
