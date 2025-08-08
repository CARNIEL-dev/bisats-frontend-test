import { tokenLogos } from "@/assets/tokens";
import { formatter } from "@/utils";

const OrdersTotalSection = ({
  data,
  showXNgn,
}: {
  data: ChartData[];
  showXNgn?: boolean;
}) => {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div
          key={d.asset}
          className=" text-[#515B6E] py-2.5 px-3 rounded-md border bg-neutral-50"
        >
          <div className="flex items-center gap-2  mb-1">
            <img
              src={tokenLogos[d.asset as keyof typeof tokenLogos]}
              alt={`${d.asset} logo`}
              className="size-4"
            />

            <p className="text-sm ">{d.asset}</p>
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">
              Bought :{" "}
              <span className="font-medium text-base text-gray-700">
                {formatter({
                  decimal: showXNgn ? 2 : d.asset === "USDT" ? 2 : 4,
                }).format(d.buy)}
              </span>
              <span className="text-xs font-light text-gray-400 inline-block ml-2 ">
                {showXNgn ? " xNGN" : d.asset}
              </span>
            </p>
            <p className="text-sm text-red-600 font-medium">
              Sold :{" "}
              <span className="font-medium text-base text-gray-700">
                {formatter({
                  decimal: showXNgn ? 2 : d.asset === "USDT" ? 2 : 4,
                }).format(d.sell)}
              </span>
              <span className="text-xs font-light text-gray-400 inline-block ml-2 ">
                {showXNgn ? " xNGN" : d.asset}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTotalSection;
