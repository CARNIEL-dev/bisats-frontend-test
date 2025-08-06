import { subDays } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatter } from "@/utils";

interface Props {
  data: ChartData[];
  title: string;
  showXNgn?: boolean;
}

const VolumeByAssetChart = ({ data, title, showXNgn }: Props) => {
  const isMobile = useIsMobile();
  const chartConfig = {
    buy: {
      label: "Buy",
    },
    sell: {
      label: "Sell",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">
          {title} {showXNgn && "(xNGN)"}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <ChartContainer config={chartConfig} className="h-[20rem] w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="asset"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 4)}
            />

            <YAxis
              width={isMobile ? 0 : showXNgn ? 100 : undefined}
              tickFormatter={(value) => {
                const numVal = Number(value.toString().slice(0, 11));
                if (showXNgn) {
                  return formatter({ decimal: 0 }).format(numVal);
                }
                return numVal.toString();
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
            />

            <ChartTooltip
              content={<ChartTooltipContent label="Asset" indicator="line" />}
            />

            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Bar
              dataKey="buy"
              name="Buy"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="sell"
              name="Sell"
              fill="var(--chart-4)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

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

  // All assets we want to display
  const allAssets = ["BTC", "ETH", "USDT", "SOL"];

  // Process data to get volume by asset and type
  const processData = (): ChartData[] => {
    const assetMap: Record<string, { buy: number; sell: number }> = {};

    // Initialize all assets with zero values
    allAssets.forEach((asset) => {
      assetMap[asset] = { buy: 0, sell: 0 };
    });

    // Process actual orders
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

      if (allAssets.includes(order.asset)) {
        assetMap[order.asset][type] += order.amount;
      }
    });

    return allAssets.map((asset) => ({
      asset,
      buy: assetMap[asset].buy,
      sell: assetMap[asset].sell,
    }));
  };

  const chartData = processData();

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-center mb-4 font-medium">
        30-Day Trading Volume by Asset
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="horizontal" // Changed to horizontal
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          // barCategoryGap={20}
          barGap={3}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="asset"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            width={120}
            tickFormatter={(value) => `${value}`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280" }}
          />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toFixed(4)} ${
                name.toString().toLocaleLowerCase() === "buy"
                  ? "Bought"
                  : "Sold"
              }`,
              "",
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-gray-600">
                {value.toString().toLowerCase() === "buy" ? "Buy" : "Sell"}
              </span>
            )}
          />
          <Bar dataKey="buy" name="Buy" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="sell"
            name="Sell"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { VolumeByAssetChart };
