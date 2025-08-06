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
  ].some(Boolean);

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

  //   HDR: Columns
  const columns: ColumnDef<OrderHistory>[] = [
    {
      header: "Type",
      accessorKey: "Type",
      cell: ({ row }) => {
        const item = row.original;

        const buyer = userId === item.buyerId ? "buyer" : "merchant";
        const type =
          item.adType === "buy"
            ? buyer === "buyer"
              ? "sell"
              : "buy"
            : buyer === "buyer"
            ? "buy"
            : "sell";

        return (
          <p
            className={cn(
              "capitalize font-semibold",
              type === "sell" ? "text-red-600" : "text-green-600"
            )}
          >
            {type}
          </p>
        );
      },
    },
    {
      header: "Order Ref",
      accessorKey: "Reference",
      cell: ({ row }) => {
        const reference = row.original.reference;
        return <p className="text-xs font-semibold">{reference}</p>;
      },
    },
    {
      header: "Asset",
      accessorKey: "Asset",
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
      cell: ({ row }) => {
        const amount = row.original.amount;
        const assetPrice = row.original.price;
        const price = formatter({ decimal: 0 }).format(amount * assetPrice);
        return (
          <p className="font-semibold text-gray-600 font-mono ">
            {price} <span className="text-xs font-normal">xNGN</span>
          </p>
        );
      },
    },
    {
      header: "Quantity",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const asset = row.original.asset;
        const quantity = amount
          ? formatter({ decimal: asset === "xNGN" ? 0 : 6 }).format(amount)
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
      header: "Date",
      cell: ({ row }) => {
        const item = row.original;
        const date = item.createdAt;
        return (
          <p className="text-sm">
            {date ? dayjs(date).format("DD/MM/YY HH:mm A") : "N/A"}
          </p>
        );
      },
    },
    {
      header: "Status",
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
          <DataTable columns={columns} data={orders} />
        </>
      )}
    </div>
  );
};

export default OrderHistory;
