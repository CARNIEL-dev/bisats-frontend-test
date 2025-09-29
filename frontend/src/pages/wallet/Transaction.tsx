import { tokenLogos } from "@/assets/tokens";
import Empty from "@/components/Empty";
import { SelectDropDown } from "@/components/Inputs/MultiSelectInput";
import TransactionDetails from "@/components/Modals/TransactionDetails";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import { TokenData } from "@/data";
import PreLoader from "@/layouts/PreLoader";
import { useUserWalletHistory } from "@/redux/actions/walletActions";

import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

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

  const userId: string = user?.user?.userId || "";

  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchWord, setSearchWord] = useState("");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedData, setSelectedData] = useState<ITransaction | undefined>();

  const isKycVerified = [
    user?.kyc?.identificationVerified,
    user?.kyc?.personalInformationVerified,
    user.user?.phoneNumberVerified,
  ].every(Boolean);

  const {
    data: transactionsData = [],
    isError,
    isLoading,
    error,
  } = useUserWalletHistory({
    userId,
    reason: selectedType === "-" ? "" : selectedType,
    asset: selectedAsset === "-" ? "" : selectedAsset,
    type: "",
    date: selectedDate,
    searchWord: searchWord,
    isKycVerified,
  });

  //   HDR: Columns
  const columns: ColumnDef<ITransaction>[] = [
    {
      accessorKey: "Asset",
      header: () => {
        return (
          <div className="flex  flex-col gap-1">
            <p className="font-semibold text-gray-600 lg:hidden">Asset</p>
            <SelectDropDown
              options={[
                { label: "Asset", value: "-" },
                ...TokenData.map((item) => ({
                  label: (
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          tokenLogos[item.tokenName as keyof typeof tokenLogos]
                        }
                        alt={item.tokenName}
                        className="size-4"
                      />
                      <div>
                        <p className="text-gray-500 font-medium">
                          {item.tokenName}
                        </p>
                      </div>
                    </div>
                  ),
                  value: item.tokenName,
                })),
              ]}
              error={""}
              onChange={(e) => {
                setSelectedAsset(e);
              }}
              className="!h-[2.3rem] !w-fit hidden lg:flex"
              defaultValue={selectedAsset ? selectedAsset : "-"}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img
              src={tokenLogos[item.Asset as keyof typeof tokenLogos]}
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
      id: "Type",
      header: () => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray-600 lg:hidden">Type</p>
            <SelectDropDown
              options={[
                { label: "Type", value: "-" },
                { label: "Deposit", value: "top_up" },
                { label: "Withdrawal", value: "withdrawal" },
              ]}
              error={""}
              onChange={(e) => {
                setSelectedType(e);
              }}
              className="!h-[2.3rem] !w-fit hidden lg:flex"
              defaultValue={selectedType ? selectedType : "-"}
            />
          </div>
        );
      },
      accessorFn: (row) => {
        // Return the display value for filtering
        return row.Type.toLowerCase() === "top_up" ? "Deposit" : row.Type;
      },
      cell: ({ row }) => {
        const displayValue: string = row.getValue("Type"); // Gets transformed value from accessorFn
        return (
          <p className={cn("capitalize flex items-center gap-1")}>
            {" "}
            <span>
              {displayValue.toLowerCase() === "deposit" ? (
                <ArrowDown className="size-4 text-green-500" />
              ) : (
                <ArrowUp className="size-4 text-red-500" />
              )}
            </span>
            <span>{displayValue}</span>
          </p>
        );
      },
      filterFn: (row, id, filterValue) => {
        const displayValue = row.getValue(id) as string;
        const searchTerm = filterValue.toLowerCase();

        // Match against display values
        return (
          displayValue.toLowerCase().includes(searchTerm) ||
          (searchTerm === "deposit" && displayValue === "Deposit") ||
          (searchTerm === "withdrawal" && displayValue === "Withdrawal")
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
      cell: ({ row }) => {
        const reference = row.original.Reference;
        return <p className="text-xs ">{reference}</p>;
      },
    },
    {
      header: "Status",
      accessorKey: "Status",
      cell: ({ row }) => {
        const status = row.original.Status;

        const colorClass =
          status === "Pending"
            ? "text-amber-600"
            : status === "success" || status === "active"
            ? "text-green-600"
            : "text-red-700";

        return (
          <p className={cn("font-medium capitalize", colorClass)}>{status}</p>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end">
            <Button
              size={"sm"}
              variant={"outline"}
              className={cn("w-fit text-xs bg-transparent")}
              type="button"
              onClick={() => setSelectedData(item)}
            >
              View details
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div className="h-[40dvh] grid place-content-center">
          <PreLoader primary={false} />
        </div>
      ) : isError && transactionsData?.length < 0 ? (
        <div className="h-[40dvh] grid place-content-center">
          <ErrorDisplay
            message={error?.message || "Failed to load wallet transactions"}
            isError={false}
            showIcon={false}
          />
        </div>
      ) : transactionsData?.length === 0 && !selectedAsset && !selectedType ? (
        <Empty text="No transactions found" />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={transactionsData}
            enableFiltering
          />
        </>
      )}

      {selectedData && (
        <TransactionDetails
          close={() => setSelectedData(undefined)}
          details={selectedData}
        />
      )}
    </div>
  );
};

export default Transactions;
