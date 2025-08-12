import { tokenLogos } from "@/assets/tokens";
import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import PreLoader from "@/layouts/PreLoader";
import EditAds from "@/pages/p2p/ads/EditAds";
import { useGetAdsDetails } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { cn, formatter } from "@/utils";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Pen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return "N/A";
  }
};

const AdDetails = () => {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode ? true : false);

  const [searchParams] = useSearchParams();

  const user = useSelector((state: { user: UserState }) => state.user);
  const userId = user?.user?.userId || "";
  const account_level = user.user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const adStatus: string = location.state?.closed;

  const id = searchParams.get("adId") || "";
  const navigate = useNavigate();

  const {
    data: adsInfo,
    isFetching,
    isError,
    error,
  } = useGetAdsDetails({
    userId: userId,
    adId: id,
    enabled: Boolean(!mode && id),
  });

  useEffect(() => {
    if (!id) {
      navigate(-1);
    }
  }, [id]);

  // HDR: Header info
  const headerInfo = useMemo(() => {
    return [
      {
        header: "Transaction Type",
        text: (
          <span
            className={cn(
              "capitalize font-semibold",
              adsInfo?.type.toLowerCase() === "buy"
                ? "text-green-600"
                : "text-red-600"
            )}
          >
            {adsInfo?.type}
          </span>
        ),
      },
      {
        header: "Asset",
        text: (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <img
              src={tokenLogos[adsInfo?.asset as keyof typeof tokenLogos]}
              alt={adsInfo?.asset}
              className="size-4 "
            />
            <div>
              <p className="font-semibold">{adsInfo?.asset}</p>
            </div>
          </div>
        ),
      },

      {
        header: "Amount Filled",
        text:
          adsInfo?.type !== "buy"
            ? formatter({ decimal: adsInfo?.asset === "USDT" ? 2 : 5 }).format(
                adsInfo?.amountAvailable || 0
              ) + ` ${adsInfo?.asset}`
            : formatter({ decimal: adsInfo?.asset === "USDT" ? 2 : 5 }).format(
                adsInfo.amountAvailable / adsInfo.price
              ) +
              " " +
              adsInfo.asset,
      },
      {
        header: "Minimum Limit",
        text: formatter({
          decimal: 2,
          currency: "NGN",
          style: "currency",
        }).format(Number(adsInfo?.minimumLimit)),
      },
      {
        header: "Maximum Limit",
        text: formatter({
          decimal: 2,
          currency: "NGN",
          style: "currency",
        }).format(Number(adsInfo?.maximumLimit)),
      },

      {
        header: "Status",
        text: (
          <span
            className={cn(
              "capitalize font-semibold",
              adStatus?.toLowerCase() === "closed"
                ? "text-red-600"
                : "text-green-600"
            )}
          >
            {adStatus}
          </span>
        ),
      },
      {
        header: "Created On",
        text: formatDate(adsInfo?.createdAt),
      },
    ];
  }, [adsInfo]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <BackButton />

        <div className="flex items-center gap-4 ">
          <h2 className="font-semibold md:text-3xl text-xl">
            {mode ? "Edit Ad" : "Ad details"}
          </h2>
          {adStatus?.toLowerCase() !== "closed" && (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => setMode((prev) => !prev)}
            >
              {mode ? (
                <>
                  <X />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Pen />
                  <span>Edit</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      {isFetching ? (
        <div className="h-[400px] flex items-center justify-center">
          <PreLoader primary={false} />
        </div>
      ) : isError ? (
        <div>
          <ErrorDisplay
            message={error?.message || "Could not get ordr details"}
            showIcon={false}
            isError={false}
          />
        </div>
      ) : mode ? (
        <EditAds
          userId={userId}
          userTransactionLimits={userTransactionLimits}
          adDetail={adsInfo!}
          setMode={setMode}
        />
      ) : (
        <div className="space-y-10">
          <div className="h-auto p-4 rounded-lg shadow-sm text-gray-600 bg-gray-100 text-sm space-y-2">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-4 gap-y-2 items-center">
              {headerInfo.map((item, index) => (
                <div key={index} className="p-1 space-y-2">
                  <p className="font-light">{item.header}</p>
                  <div className="font-medium">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="p-1 space-y-2">
              <p className="font-light">Price</p>
              <p className="font-semibold text-black text-xl">
                {formatter({
                  decimal: 2,
                  style: "currency",
                  currency: "NGN",
                }).format(Number(adsInfo?.price))}
              </p>
            </div>
          </div>

          <div className="mb-2 space-y-4">
            <p>
              <span className="font-semibold text-lg text-[#0A0E12]">
                Order History
              </span>
            </p>
            <AdOrderHistoryTable data={adsInfo?.orders!} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetails;

const AdOrderHistoryTable = ({ data }: { data: OrderHistory[] }) => {
  const columns: ColumnDef<OrderHistory>[] = [
    {
      accessorKey: "buyer.userName",
      header: "Buyer",
    },
    {
      header: "Amount",
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
      header: "Date",
      cell: ({ row }) => {
        const item = row.original;
        const date = item.createdAt;
        return (
          <p className="text-sm">
            {date ? dayjs(date).format("DD MMM YYYY - hh:mm A") : "N/A"}
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
              "text-xs capitalize px-2.5 py-0.5 rounded-full border w-fit",
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
    <div>
      <DataTable columns={columns} data={data} paginated={false} />
    </div>
  );
};
