import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Empty from "@/components/Empty";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import SearchInput from "@/components/Inputs/SearchInput";
import Table from "@/components/Table/TransactionHistory";
import { formatDate } from "@/layouts/utils/Dates";
import {
  GetWalletTransactions,
  useUserWalletHistory,
} from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { cn, formatter } from "@/utils";
import { BTC, ETH, NGN, SOL, USDT } from "@/assets/tokens";
export enum Fields {
  Asset = "Asset",
  Network = "Network",
  Amount = "Amount",
  Type = "Type",

  Reference = "Reference",
  Date = "Date",
  Status = "Status",
}

export interface ITransaction {
  Asset: string;
  Type: string;
  Date: string;
  Reference: string;
  Network: string;
  Amount: number;
  Status: string;
  txHash: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;

    bankName: string;
  };
}

export type RawTx = {
  paymentMethod: string;
  createdAt: string;
  asset: string;
  reason: string;
  reference?: string;
  network?: string;
  amount: number;
  status: string;
  txHash: string;
  bankDetails?: any;
};

const Transactions: React.FC = () => {
  const user = useSelector((state: { user: UserState }) => state.user);

  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const {
    data: transactionsData = [],
    refetch,
    isFetching,
    isError,
    error,
  } = useUserWalletHistory({
    userId: user?.user?.userId || "",
    reason: selectedType ?? "top-up",
    asset: selectedAsset,
    type: "",
    date: selectedDate,
    searchWord: searchTerm,
  });

  const logos = {
    USDT,
    BTC,
    ETH,
    SOL,
    xNGN: NGN,
  };

  const columns: ColumnDef<ITransaction>[] = [
    {
      header: "Asset",
      accessorKey: "Asset",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img
              src={logos[item.Asset as keyof typeof logos]}
              alt={item.Asset}
              className="size-5 "
            />
            <div>
              <p className="font-medium">{item.Asset}</p>
            </div>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "Amount",
      cell: ({ row }) => {
        const amount = row.original.Amount;
        const asset = row.original.Asset;
        const price = formatter({ decimal: asset === "xNGN" ? 0 : 4 }).format(
          amount
        );

        return (
          <p className="font-semibold text-gray-600 font-mono ">
            {price} <span className="text-xs font-normal">{asset}</span>
          </p>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "Type",
      cell: ({ row }) => {
        const type = row.original.Type;
        return (
          <p
            className={cn(
              "capitalize font-medium",
              type === "withdrawal" ? "text-red-400" : "text-green-500"
            )}
          >
            {type === "top_up" ? "Deposit" : type}
          </p>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "Date",
    },
    {
      header: "Reference",
      accessorKey: "Reference",
    },
    {
      header: "Status",
      accessorKey: "Status",
    },
  ];

  const getUniqueAssets = () => {
    const uniqueAssets = ["USDT", "BTC", "ETH", "SOL", "xNGN"];
    return [
      {
        value: "",
        label: "All",
        labelDisplay: "All",
      },
      ...uniqueAssets.map((asset) => ({
        value: asset,
        label: asset,
        labelDisplay: asset,
      })),
    ];
  };

  // Fixed type options format
  const getTypeOptions = () => [
    {
      value: "",
      label: "All",
      labelDisplay: "All",
    },
    {
      value: "withdrawal",
      label: "Withdrawal",
      labelDisplay: "Withdrawal",
    },
    {
      value: "top-up",
      label: "Deposit",
      labelDisplay: "Deposit",
    },
  ];

  // Fixed sort options format
  const getSortOptions = () => [
    {
      value: "",
      label: "None",
      labelDisplay: "None",
    },
    {
      value: "price",
      label: "Price",
      labelDisplay: "Price",
    },
    {
      value: "date",
      label: "Date",
      labelDisplay: "Date",
    },
  ];
  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {/* <div className="hidden md:block mb-6">
        <div className="flex flex-wrap items-end gap-4 py-5">
          <div className="xl:w-40 lg:w-28 md:w-24">
            <MultiSelectDropDown
              title="All"
              choices={getUniqueAssets()}
              handleChange={handleAssetChange}
              label="Assets"
              error={null}
              touched={false}
            />
          </div>
          <div className="xl:w-40 lg:w-28 md:w-24">
            <MultiSelectDropDown
              title="All"
              choices={getTypeOptions()}
              handleChange={handleTypeChange}
              label="Type"
              error={null}
              touched={false}
            />
          </div>
          <div className="xl:w-80 lg:w-72 md:w-64">
            <SearchInput
              placeholder="Search by reference"
              value={searchTerm}
              handleChange={handleSearchChange}
            />
          </div>
        </div>
      </div> */}
      {transactionsData?.length === 0 ? (
        <Empty />
      ) : (
        <>
          {/* <Table fields={fields} data={transactionsData} /> */}
          <DataTable
            columns={columns}
            data={transactionsData}
            // paginated={false}
          />
        </>
      )}
    </div>
  );
};

export default Transactions;
