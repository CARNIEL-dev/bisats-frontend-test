import { subDays } from "date-fns";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  PieChart,
  Pie,
  Cell,
  Legend as PieLegend,
  Tooltip as PieTooltip,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartDataPoint {
  date: string;
  buyPrice?: number;
  sellPrice?: number;
  activeBuys: number;
  activeSells: number;
  inactiveBuys: number;
  inactiveSells: number;
}

const PIE_COLORS = ["#0088FE", "#FF8042"];

export const AdsBarOrPieChart: React.FC<{ ads: AdsTypes[] }> = ({ ads }) => {
  const [showActive, setShowActive] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // 1️⃣ Filter by status
  const filtered = useMemo(
    () =>
      ads.filter((ad) =>
        showActive ? ad.status === "active" : ad.status !== "active"
      ),
    [ads, showActive]
  );

  // 2️⃣ Prepare data for BarChart: sum NGN‐price per YYYY-MM-DD
  const barData = useMemo(() => {
    const sums: Record<string, number> = {};
    filtered.forEach((ad) => {
      const date = ad.createdAt.slice(0, 10);
      sums[date] = (sums[date] || 0) + ad.price;
    });
    return Object.entries(sums).map(([date, totalPrice]) => ({
      date,
      totalPrice,
    }));
  }, [filtered]);

  // 3️⃣ Prepare data for PieChart: sum NGN‐price by buy vs sell
  const pieData = useMemo(() => {
    const sums: Record<string, number> = { buy: 0, sell: 0 };
    filtered.forEach((ad) => {
      sums[ad.type] += ad.price;
    });
    return (["buy", "sell"] as const).map((type, i) => ({
      name: type,
      value: sums[type],
      fill: PIE_COLORS[i],
    }));
  }, [filtered]);

  return (
    <div className="w-full h-[400px]">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => setShowActive((v) => !v)}
        >
          {showActive ? "Showing: Active" : "Showing: Inactive"}
        </button>
        <button
          className={`px-3 py-1 rounded ${
            chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </button>
        <button
          className={`px-3 py-1 rounded ${
            chartType === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={barData}>
            <XAxis dataKey="date" />
            <YAxis />
            <BarTooltip />
            <Bar dataKey="totalPrice" name="Total ₦ Price" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <PieLegend />
            <PieTooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

interface Props {
  orders: OrderHistory[];
  userId: string;
}

export function VolumeByAssetChart({ orders, userId }: Props) {
  const data = useMemo(() => {
    // 1) Filter to last 30 days
    const cutoff = subDays(new Date(), 30).getTime();
    const recent = orders.filter(
      (o) => new Date(o.createdAt).getTime() >= cutoff
    );

    // 2) Initialise buckets for each asset
    const assets = ["BTC", "ETH", "SOL", "USDT"];
    const map: Record<string, { asset: string; buy: number; sell: number }> =
      {};
    assets.forEach((a) => {
      map[a] = { asset: a, buy: 0, sell: 0 };
    });

    // 3) Roll up volumes
    recent.forEach((o) => {
      const whoIsBuyer = userId != o.buyerId ? "buyer" : "merchant";
      const logicalType =
        o.adType === "buy"
          ? whoIsBuyer === "buyer"
            ? "sell"
            : "buy"
          : whoIsBuyer === "buyer"
          ? "buy"
          : "sell";

      // choose your “volume” field here – e.g. o.quantity or o.amount
      const volume = o.quantity;

      if (map[o.asset]) {
        map[o.asset][logicalType] += volume;
      }
    });

    return Object.values(map);
  }, [orders, userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">30 Day Volume by Asset</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="asset" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="buy" name="Buy Volume" />
            <Bar dataKey="sell" name="Sell Volume" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ChartData {
  asset: string;
  buy: number;
  sell: number;
}

export const OrderVolumeChart = ({
  orders,
  userId,
}: {
  orders: OrderHistory[];
  userId: string;
}) => {
  // Filter orders from last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentOrders = orders.filter(
    (order) => new Date(order.createdAt) >= thirtyDaysAgo
  );

  // Process data to get volume by asset and type
  const processData = (): ChartData[] => {
    const assetMap: Record<string, { buy: number; sell: number }> = {};

    recentOrders.forEach((order) => {
      const buyer = userId === order.buyerId ? "buyer" : "merchant";
      const type =
        order.adType === "buy"
          ? buyer === "buyer"
            ? "sell"
            : "buy"
          : buyer === "buyer"
          ? "buy"
          : "sell";

      if (!assetMap[order.asset]) {
        assetMap[order.asset] = { buy: 0, sell: 0 };
      }

      assetMap[order.asset][type] += order.amount;
    });

    return Object.entries(assetMap).map(([asset, volumes]) => ({
      asset,
      buy: volumes.buy,
      sell: volumes.sell,
    }));
  };

  const chartData = processData();

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="asset" type="category" width={80} />
          <Tooltip
            formatter={(value) => [`${value} ${chartData[0]?.asset}`, ""]}
          />
          <Legend />
          <Bar dataKey="buy" name="Buy Volume" fill="#8884d8" />
          <Bar dataKey="sell" name="Sell Volume" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
