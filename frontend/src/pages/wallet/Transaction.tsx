import { tokenLogos } from "@/assets/tokens";
import Empty from "@/components/Empty";
import TransactionDetails from "@/components/Modals/TransactionDetails";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import PreLoader from "@/layouts/PreLoader";
import { useUserWalletHistory } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedData, setSelectedData] = useState<ITransaction | undefined>();

  const isKycVerified = [
    user?.kyc?.identificationVerified,
    user?.kyc?.personalInformationVerified,
    user.user?.phoneNumberVerified,
  ].some(Boolean);

  const {
    data: transactionsData = [],
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
    isKycVerified,
  });

  //   HDR: Columns
  const columns: ColumnDef<ITransaction>[] = [
    {
      header: "Asset",
      accessorKey: "Asset",
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
      header: "Type",
      accessorKey: "Type",
      cell: ({ row }) => {
        const type = row.original.Type;
        return (
          <p
            className={cn(
              "capitalize"
              //   type === "withdrawal" ? "text-red-400" : "text-green-500"
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
        </div>
      </div> */}
      {isFetching ? (
        <div className="h-[40dvh] grid place-content-center">
          <PreLoader />
        </div>
      ) : isError ? (
        <div className="h-[40dvh] grid place-content-center">
          <ErrorDisplay
            message={error?.message || "Failed to load wallet transactions"}
            isError={false}
            showIcon={false}
          />
        </div>
      ) : transactionsData?.length === 0 ? (
        <Empty text="No transactions found" />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={transactionsData}
            // paginated={false}
            enableFiltering
            filterColumns={["Reference", "Date", "Amount"]}
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
