import { useFetchOrder } from "@/redux/actions/walletActions";
import { useSelector } from "react-redux";

import Switch from "@/components/Switch";
import PreLoader from "@/layouts/PreLoader";
import { subDays } from "date-fns";
import { useMemo, useState } from "react";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { VolumeByAssetChart } from "@/components/shared/TestChart";
import RefreshButton from "@/components/RefreshButton";
import OrdersTotalSection from "@/components/shared/OrdersTotalSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const daysOption = [7, 14, 30, 60];

const OrdersChart = () => {
  const [showNaira, setShowNaira] = useState(true);
  const [days, setDays] = useState(7);

  const userId =
    useSelector((state: RootState) => state.user.user?.userId) || "";

  const {
    data: orders = [],
    refetch,
    isFetching,
    isError,
  } = useFetchOrder(userId);

  // HDR: Data
  const data = useMemo(() => {
    //? Filter to last 30 days
    const cutoff = subDays(new Date(), days).getTime();
    const recent = orders.filter(
      (o) => new Date(o.createdAt).getTime() >= cutoff
    );

    //? Initialise buckets for each asset
    const assets = ["BTC", "ETH", "SOL", "USDT"];
    const map: Record<string, { asset: string; buy: number; sell: number }> =
      {};
    assets.forEach((a) => {
      map[a] = { asset: a, buy: 0, sell: 0 };
    });

    //? Roll up volumes
    recent.forEach((o) => {
      const whoIsBuyer = userId === o.buyerId ? "buyer" : "merchant";

      const logicalType =
        o.adType === "buy"
          ? whoIsBuyer === "buyer"
            ? "sell"
            : "buy"
          : whoIsBuyer === "buyer"
          ? "buy"
          : "sell";

      //? choose your “volume” field here – e.g. o.price(asset price * amount bought or sold)  or o.amount
      const volume = showNaira ? o.amount * o.price : o.amount;

      if (map[o.asset]) {
        map[o.asset][logicalType] += volume;
      }
    });

    return Object.values(map);
  }, [orders, userId, showNaira, days]);

  return (
    <div className="border rounded-2xl md:p-6 p-3 h-fit">
      <div className="flex items-center flex-wrap  md:gap-4 gap-2 mb-4">
        <h3 className="md:text-lg text-base text-gray-800 font-semibold ">
          Ads Volume
        </h3>
        <div className="flex items-center ml-auto md:ml-0 gap-1 text-xs text-gray-500">
          <span>Fiat</span>
          <Switch
            checked={showNaira}
            onCheckedChange={(val) => {
              setShowNaira(val);
            }}
            disabled={isFetching || isError}
          />
          <span>xNGN</span>
        </div>
        <RefreshButton
          isFetching={isFetching}
          refetch={refetch}
          refreshTime={2 * 60 * 1000}
        />
        <div className="md:ml-auto ">
          <Select
            defaultValue={days.toString()}
            onValueChange={(val) => setDays(Number(val))}
            disabled={isError}
          >
            <SelectTrigger className="!h-10">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              {daysOption.map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  Last {d} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFetching ? (
        <div className="h-[26rem] flex items-center justify-center">
          <PreLoader primary={false} />
        </div>
      ) : isError ? (
        <div className="w-full text-xs animate-pulse h-[23rem] pt-10">
          <ErrorDisplay
            message="No order history"
            isError={false}
            showIcon={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <div>
            <VolumeByAssetChart
              data={data}
              title={`${days} Day Volume by Asset`}
              showXNgn={showNaira}
            />
          </div>
          <OrdersTotalSection data={data} showXNgn={showNaira} />
        </div>
      )}
    </div>
  );
};

export default OrdersChart;
