import { tokenLogos } from "@/assets/tokens";
import Empty from "@/components/Empty";
import KycBanner from "@/components/KycBanner";
import RefreshButton from "@/components/RefreshButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { DataTable } from "@/components/ui/data-table";
import PreLoader from "@/layouts/PreLoader";
import { useFetchOrder } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const OrderHistory = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const isKycVerified = [
    userState?.kyc?.identificationVerified,
    userState?.kyc?.personalInformationVerified,
    userState.user?.phoneNumberVerified,
  ].every(Boolean);

  const {
    data: orders = [],
    error,
    refetch,
    isFetching,
    isError,
  } = useFetchOrder({ userId, isKycVerified });

  if (!isKycVerified) {
    return <KycBanner />;
  }

  const columns = tableColumns(userId);

  return (
    <div className="">
      <div className="mb-6">
        <h2
          className="font-semibold"
          style={{ color: "#0A0E12", fontSize: "22px" }}
        >
          Order History
        </h2>

        <RefreshButton
          isFetching={isFetching}
          refetch={refetch}
          disabled={isFetching}
          refreshTime={3 * 60 * 1000}
        />
      </div>

      {isFetching ? (
        <div className="h-[40dvh] grid place-content-center">
          <PreLoader />
        </div>
      ) : isError ? (
        <div className="h-[40dvh] grid place-content-center">
          <ErrorDisplay
            message={error?.message || "Failed to load orders"}
            isError={false}
            showIcon={false}
          />
        </div>
      ) : orders?.length === 0 ? (
        <Empty text="No orders found" />
      ) : (
        <>
          <DataTable
            key={"orderHistory"}
            columns={columns}
            data={orders}
            enableFiltering
          />
        </>
      )}
    </div>
  );
};

export default OrderHistory;

// HDR: COLUMNS
const tableColumns = (userId: string) => {
  const columns: ColumnDef<OrderHistory>[] = [
    {
      header: "Type",
      id: "transactionType",
      accessorFn: (row) => {
        const buyer = userId === row.buyerId ? "buyer" : "merchant";
        return row.adType === "buy"
          ? buyer === "buyer"
            ? "sold"
            : "bought"
          : buyer === "buyer"
          ? "bought"
          : "sold";
      },
      cell: ({ row }) => {
        const type = row.getValue("transactionType") as string;
        return (
          <p
            className={cn(
              "capitalize font-semibold",
              type === "sold" ? "text-red-600" : "text-green-600"
            )}
          >
            {type}
          </p>
        );
      },

      filterFn: (row, id, filterValue) => {
        const rawValue: string = row.getValue(id);

        return rawValue.includes(filterValue.toLowerCase());
      },
    },

    {
      header: "Asset",
      accessorKey: "asset",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <img
              src={tokenLogos[item.asset as keyof typeof tokenLogos]}
              alt={item.asset}
              className="size-5 "
            />
            <div>
              <p className="font-medium">{item.asset}</p>
            </div>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        const amount = row.original.price * row.original.quantity;
        const price = amount ? formatter({ decimal: 2 }).format(amount) : "N/A";

        return (
          <p className="font-semibold text-gray-600 font-mono ">
            {price} <span className="text-xs font-normal">xNGN</span>
          </p>
        );
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: ({ row }) => {
        const amount = row.original.quantity;
        const asset = row.original.asset;
        const quantity = amount
          ? formatter({
              decimal: asset === "xNGN" ? 0 : asset === "USDT" ? 2 : 6,
            }).format(amount)
          : "N/A";

        return (
          <p className="font-medium text-gray-600">
            {quantity} <span className="text-xs font-normal">{asset}</span>
          </p>
        );
      },
    },
    {
      header: "Counter Party",
      id: "counterParty", // This can be any unique string
      filterFn: (row, id, value) => {
        const partyName = row.getValue(id);
        return String(partyName || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      accessorFn: (row) => {
        return userId === row.merchantId
          ? row.buyer?.userName
          : row.merchant?.userName;
      },
      cell: ({ row }) => {
        const item = row.original;
        const counterParty =
          userId === item.merchantId
            ? item.buyer?.userName
            : item.merchant?.userName;
        return <p className="text-sm">{counterParty}</p>;
      },
    },
    {
      header: "Order Ref",
      accessorKey: "reference",
      cell: ({ row }) => {
        const reference = row.original.reference;
        return <p className="text-xs font-semibold">{reference}</p>;
      },
    },
    {
      header: "Date",
      id: "formattedDate",
      accessorFn: (row: OrderHistory) =>
        row.createdAt
          ? dayjs(row.createdAt).format("DD MMM YYYY - hh:mm A")
          : "N/A",
      cell: ({ row }) => {
        return <p className="text-sm">{row.getValue("formattedDate")}</p>;
      },
      filterFn: (row, id, filterValue) => {
        // Type assertion for row.original
        const original = row.original as OrderHistory;
        const formattedDate = String(
          row.getValue("formattedDate")
        ).toLowerCase();
        const rawDate = original.createdAt
          ? dayjs(original.createdAt).format("DDMMYYYY")
          : "";

        return (
          formattedDate.includes(filterValue.toLowerCase()) ||
          rawDate.includes(filterValue.replace(/\D/g, ""))
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <p
            className={cn(
              "text-xs capitalize px-2.5 py-0.5 rounded-full border",
              status === "completed"
                ? "text-green-600 bg-green-300/10 border-green-600"
                : "text-red-600 border-red-600 bg-red-300/10"
            )}
          >
            {status}
          </p>
        );
      },
    },
  ];

  return columns;
};
