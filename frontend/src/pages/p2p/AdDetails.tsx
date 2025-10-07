import { tokenLogos } from "@/assets/tokens";
import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import TextBox from "@/components/shared/TextBox";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/data-table";
import PreLoader from "@/layouts/PreLoader";
import EditAds from "@/pages/p2p/ads/EditAds";
import { useGetAdsDetails } from "@/redux/actions/walletActions";

import { cn, formatter, getPercentage, getSafeValue } from "@/utils";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Pen, X } from "lucide-react";
import { useEffect, useState } from "react";
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
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!id) {
      navigate(-1);
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <BackButton />

        <div className="flex items-center gap-4 ">
          <h2 className="font-semibold md:text-3xl text-xl">
            {mode ? "Edit Ad" : "Ad details"}
          </h2>
          {adsInfo?.status?.toLowerCase() === "active" && (
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
          {adsInfo?.status?.toLowerCase() === "disabled" && adsInfo?.reason && (
            <div className="flex items-center gap-2 !-mb-2">
              <StatusBadge status={adsInfo?.status} />
              <p className="text-gray-500 text-sm">{adsInfo?.reason}</p>
            </div>
          )}
          <div className="h-auto p-4 rounded-lg shadow-sm text-gray-600 bg-gray-100 t space-y-2">
            <AdsInfo ads={adsInfo!} adStatus={adsInfo?.status!} />
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

const AdsInfo = ({ ads, adStatus }: { ads: AdsType; adStatus: string }) => {
  const total =
    ads.type === "sell"
      ? getSafeValue(ads.amount)
      : getSafeValue(ads.amount) / getSafeValue(ads.price);

  const fulfilled =
    ads.type === "sell"
      ? getSafeValue(ads.amountFilled)
      : getSafeValue(ads.amountFilled) / getSafeValue(ads.price);

  const available =
    ads.type === "sell"
      ? getSafeValue(ads.amountAvailable)
      : getSafeValue(ads.amountAvailable) / getSafeValue(ads.price);

  const percentFilled = getPercentage({
    total,
    filled: fulfilled,
  });

  const Info = [
    {
      name: "Transaction Type",
      value: (
        <p
          className={cn(
            ads.type === "buy" ? "text-[#17A34A]" : "text-[#DC2625]",
            "font-bold uppercase"
          )}
        >
          {ads.type}
        </p>
      ),
    },
    {
      name: "Asset",
      value: (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <img
            src={tokenLogos[ads?.asset as keyof typeof tokenLogos]}
            alt={ads?.asset}
            className="size-4 "
          />
          <div>
            <p className="font-semibold">{ads?.asset}</p>
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      value: <StatusBadge status={adStatus} />,
    },
    {
      name: "Currency",
      value: <p className="font-semibold">{ads.currency || "NGN"}</p>,
    },
    {
      name: "Created On",
      value: formatDate(ads?.createdAt),
    },

    {
      name: ads.type === "sell" ? "Amount Sold" : "Amount Bought",
      value: (
        <div className="whitespace-nowrap flex items-center gap-1">
          <p className="font-semibold whitespace-nowrap">
            {formatter({ decimal: ads.asset === "USDT" ? 2 : 6 }).format(
              fulfilled
            )}
          </p>
          <span className="text-xs text-gray-400">{ads.asset}</span>
          <span
            className={percentFilled > 0 ? "text-[#17A34A]" : "text-yellow-500"}
          >
            {percentFilled} %
          </span>
        </div>
      ),
    },
    {
      name: "Amount Available",
      value: (
        <div className="whitespace-nowrap flex items-center gap-1">
          <p className="font-semibold whitespace-nowrap">
            {formatter({ decimal: ads.asset === "USDT" ? 2 : 6 }).format(
              available
            )}
          </p>
          <span className="text-xs text-gray-400">{ads.asset}</span>
        </div>
      ),
    },
    {
      name: "Total Amount",
      value: (
        <div className="whitespace-nowrap flex items-center gap-1">
          <p className="font-semibold whitespace-nowrap">
            {formatter({ decimal: ads.asset === "USDT" ? 2 : 6 }).format(total)}
          </p>
          <span className="text-xs text-gray-400">{ads.asset}</span>
        </div>
      ),
    },
    {
      name: "Upper Price Limit",
      value: (
        <p>
          {formatter({ style: "currency", currency: "NGN" }).format(
            getSafeValue(ads.priceUpperLimit)
          )}
        </p>
      ),
    },
    {
      name: "Lower Price Limit",
      value: (
        <p>
          {formatter({ style: "currency", currency: "NGN" }).format(
            getSafeValue(ads.priceLowerLimit)
          )}
        </p>
      ),
    },
    {
      name: "Maximum Limit",
      value: (
        <p>
          {formatter({ style: "currency", currency: "NGN" }).format(
            getSafeValue(ads.maximumLimit)
          )}
        </p>
      ),
    },
    {
      name: "Minimum Limit",
      value: (
        <p>
          {formatter({ style: "currency", currency: "NGN" }).format(
            getSafeValue(ads.minimumLimit)
          )}
        </p>
      ),
    },
    {
      name: "Price",
      value: (
        <p className="font-semibold text-black text-xl">
          {formatter({ style: "currency", currency: "NGN" }).format(
            getSafeValue(ads.price)
          )}
        </p>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-2 gap-y-6">
      {Info.map((item) => {
        const NEXT_LINE = ["Price"].includes(item.name);
        return (
          <TextBox
            key={item.name}
            label={item.name}
            value={item.value}
            labelClass="text-sm"
            direction="column"
            showIndicator={false}
            containerClassName={cn(NEXT_LINE && "col-start-1")}
          />
        );
      })}
    </div>
  );
};
