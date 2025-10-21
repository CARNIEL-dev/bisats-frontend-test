import { tokenLogos } from "@/assets/tokens";
import Empty from "@/components/Empty";
import KycBanner from "@/components/KycBanner";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import RefreshButton from "@/components/RefreshButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import TextBox from "@/components/shared/TextBox";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import PreLoader from "@/layouts/PreLoader";
import { useFetchOrder } from "@/redux/actions/walletActions";

import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const OrderHistory = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";
  const [selectedData, setSelectedData] = useState<OrderHistory | undefined>();

  const isKycVerified = [
    userState?.kyc?.personalInformationVerified,
    userState?.user?.accountLevel,
    // userState.user?.phoneNumberVerified,
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
  } else if (
    userState.user?.hasAppliedToBeInLevelOne &&
    !userState.user.accountLevel
  ) {
    return (
      <div className="flex flex-col items-center gap-2  border w-fit p-6 mx-auto rounded-md">
        <h4 className="font-semibold text-lg">
          Your Account is being reviewed
        </h4>
        <p className="text-gray-500 text-sm">Please wait for admin approval</p>
      </div>
    );
  }

  const columns = tableColumns(userId, setSelectedData);

  return (
    <>
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
      {selectedData && (
        <OrderHistoryDetails
          close={() => setSelectedData(undefined)}
          details={selectedData}
          userId={userId}
        />
      )}
    </>
  );
};

export default OrderHistory;

// HDR: Order History details

const OrderHistoryDetails = ({
  close,
  details,
  userId,
}: {
  close: () => void;
  details: OrderHistory;
  userId: string;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(details.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const buyer = details.buyerId === userId ? "buyer" : "merchant";
  const type =
    details.adType === "buy"
      ? buyer === "buyer"
        ? "sold"
        : "bought"
      : buyer === "buyer"
      ? "bought"
      : "sold";

  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col gap-3 mt-6 md:mt-0">
        <div className="flex items-center gap-2 font-semibold mb-4 ">
          <p className="text-gray-600">Order Ref:</p>
          <div className="flex items-center gap-1">
            <p className=" text-green-600">{details.reference}</p>
            <Button variant={"ghost"} size={"icon"} onClick={handleCopy}>
              {copied ? <Check className="text-green-600" /> : <Copy />}
            </Button>
          </div>
        </div>
        <TextBox
          label="Type"
          value={
            <p
              className={cn(
                "capitalize font-semibold",
                type === "bought" ? "text-green-600" : "text-red-600"
              )}
            >
              {type}
            </p>
          }
        />
        <TextBox label="Asset" value={details.asset} />
        <TextBox
          label="Price"
          value={
            <p className="">
              {formatter({
                decimal: 2,
              }).format(details.price)}{" "}
              xNGN
            </p>
          }
        />
        <TextBox
          label="Amount"
          value={
            <p className="">
              <span className="font-semibold text-xl">
                {formatter({ decimal: 2 }).format(
                  details.price * details.quantity
                )}{" "}
              </span>
              xNGN
            </p>
          }
        />
        <TextBox
          label="Quantity"
          value={
            <p className="">
              <span className="font-semibold text-xl">
                {formatter({
                  decimal:
                    details.asset === "xNGN"
                      ? 0
                      : details.asset === "USDT"
                      ? 2
                      : 6,
                }).format(details.quantity)}{" "}
              </span>
              {details.asset}
            </p>
          }
        />

        <TextBox
          label={details.type === "sell" ? "Transaction Fee" : "Buyer's Fee"}
          value={
            <p className="">
              {formatter({
                decimal: 2,
              }).format(details.transactionFeeInNGN)}{" "}
              xNGN
            </p>
          }
        />
        <TextBox
          label="Counter Party"
          value={
            <p className="capitalize">
              {details.merchantId === userId
                ? details.buyer?.userName
                : details.merchant.userName}
            </p>
          }
        />
        <TextBox
          label="Status"
          value={
            <p
              className={cn(
                "text-xs capitalize px-2.5 py-0.5 rounded-full border",
                details.status === "completed"
                  ? "text-green-600 bg-green-300/10 border-green-600"
                  : "text-red-600 border-red-600 bg-red-300/10"
              )}
            >
              {details.status}
            </p>
          }
        />
        <TextBox
          label="Date"
          value={
            <p className="">
              {details.createdAt
                ? dayjs(details.createdAt).format("DD MMM YYYY - hh:mm A")
                : "N/A"}
            </p>
          }
        />
      </div>
    </ModalTemplate>
  );
};

// HDR: COLUMNS
const tableColumns = (
  userId: string,
  setSelectedData: (data: OrderHistory) => void
) => {
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

  return columns;
};
