import { useFetchOrder, useFetchUserAds } from "@/redux/actions/walletActions";
import { useSelector } from "react-redux";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdsBarOrPieChart, VolumeByAssetChart } from "./TestChart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const AdsChart = () => {
  const userId =
    useSelector((state: RootState) => state.user.user?.userId) || "";
  // const {
  //   data: userAds = [],
  //   isError,
  //   error,
  //   isFetching,
  // } = useFetchUserAds(userId);

  const {
    data: orders = [],
    error,
    refetch,
    isFetching,
    isError,
  } = useFetchOrder(userId);

  console.log(orders);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <div className="border rounded-2xl p-6">
      <h3 className="text-lg text-gray-800 font-semibold">Orders</h3>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <div>
          {/* <ChartContainer
            config={chartConfig}
            className="min-h-[23rem] h-full max-h-[32rem] w-full"
          >
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent label="ads" />} />
              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
              />
              <Bar dataKey="desktop" fill="var(--chart-2)" radius={4} />
              <Bar dataKey="mobile" fill="var(--chart-4)" radius={4} />
            </BarChart>
          </ChartContainer> */}
          {/* <AdsCandlestickChart ads={userAds} /> */}
          {/* <AdsBarOrPieChart ads={userAds} /> */}
          <VolumeByAssetChart orders={orders} userId={userId} />
        </div>
        <div>hello</div>
      </div>
    </div>
  );
};

export default AdsChart;
