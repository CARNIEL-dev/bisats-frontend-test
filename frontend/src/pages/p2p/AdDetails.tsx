import { useLocation, useNavigate } from "react-router-dom";
import { formatCrypto, formatNumber } from "@/utils/numberFormat";
import { GetAdOrder } from "@/redux/actions/adActions";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/reducers/userSlice";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/shared/BackButton";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import EditAds from "@/pages/p2p/ads/EditAds";
import { Button } from "@/components/ui/Button";
import { Edit, FolderClosedIcon, Pen, X } from "lucide-react";
import { cn, formatter } from "@/utils";

type TOrder = {
  type: string;
  reference: string;
  asset: string;
  amount: number;
  price: number;
  quantity: number;
  buyer: { userName: string };
  createdAt: string;
};
const AdDetails = () => {
  const [loading, setLoading] = useState(false);

  const [adOrders, setAdOrders] = useState([]);
  const location = useLocation();
  const user = useSelector((state: { user: UserState }) => state.user);
  const userId = user?.user?.userId || "";
  const account_level = user.user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const adDetail: AdsType = location.state?.adDetail;

  const [mode, setMode] = useState(location.state?.mode ? true : false);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  // TODO: Change to tanstack
  const FetAdOrder = async () => {
    setLoading(true);
    const res = await GetAdOrder({ userId: userId, adId: adDetail?.id });
    if (res.status) {
      setAdOrders(res?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    FetAdOrder();
  }, [adDetail && !mode]);

  const headerInfo = useMemo(() => {
    return [
      {
        header: "Transaction Type",
        text: (
          <span
            className={cn(
              "capitalize font-semibold",
              adDetail?.type.toLowerCase() === "buy"
                ? "text-green-600"
                : "text-red-600"
            )}
          >
            {adDetail?.type}
          </span>
        ),
      },
      {
        header: "Asset",
        text: adDetail?.asset,
      },

      {
        header: "Amount",
        text:
          adDetail?.type.toLowerCase() === "sell"
            ? `${adDetail?.asset} ${formatter({ decimal: 5 }).format(
                Number(adDetail?.amount)
              )}`
            : `xNGN ${formatNumber(adDetail?.amount)}`,
      },
      {
        header: "Minimum Limit",
        text: formatter({
          decimal: 2,
          currency: "NGN",
          style: "currency",
        }).format(Number(adDetail?.minimumLimit)),
      },
      {
        header: "Maximum Limit",
        text: formatter({
          decimal: 2,
          currency: "NGN",
          style: "currency",
        }).format(Number(adDetail?.maximumLimit)),
      },

      {
        header: "Status",
        text: (
          <span
            className={cn(
              "capitalize font-semibold",
              adDetail?.status.toLowerCase() === "closed"
                ? "text-red-600"
                : "text-green-600"
            )}
          >
            {adDetail?.status}
          </span>
        ),
      },
      {
        header: "Created On",
        text: formatDate(adDetail?.createdAt),
      },
    ];
  }, [adDetail]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <BackButton />

        <div className="flex items-center gap-4 ">
          <h2 className="font-semibold md:text-3xl text-xl">
            {mode ? "Edit Ad" : "Ad details"}
          </h2>
          {adDetail.status.toLowerCase() !== "closed" && (
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
      {mode ? (
        <EditAds
          userId={userId}
          userTransactionLimits={userTransactionLimits}
          adDetail={adDetail}
          setMode={setMode}
        />
      ) : (
        <div className="space-y-10">
          <div className="h-auto p-4 rounded-lg shadow-sm text-gray-600 bg-gray-100 text-sm space-y-2">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-4 gap-y-2 items-center">
              {headerInfo.map((item, index) => (
                <div key={index} className="p-1 space-y-2">
                  <p className="font-light">{item.header}</p>
                  <p className="font-medium">{item.text}</p>
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
                }).format(Number(adDetail?.price))}
              </p>
            </div>
          </div>

          <div className="mb-2">
            <p>
              <span className="font-semibold text-lg text-[#0A0E12]">
                Order History
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetails;
