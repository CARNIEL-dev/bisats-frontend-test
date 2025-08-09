import RefreshButton from "@/components/RefreshButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import Switch from "@/components/Switch";
import { getCoinRates } from "@/redux/actions/walletActions";
import { cn, formatter } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { BeatLoader, PuffLoader } from "react-spinners";

const MarketRate: React.FC = () => {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  //SUB: Query function
  const {
    data: currencyRate,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useQuery<Coin[], Error, Coin[], [string, "NGN" | "USD"]>({
    queryKey: ["market_rate", currency],
    queryFn: () =>
      getCoinRates({ isMarket: currency === "NGN" ? true : undefined }),
    refetchOnMount: false,
    retry: true,
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  return (
    <div className="border space-y-4 h-full w-full p-6 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <p className="md:text-sm text-xs font-semibold text-gray-700">
          Market Rates (per unit)
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>$ USD</span>
            <Switch
              checked={currency === "NGN"}
              onCheckedChange={(val) => {
                setCurrency(val ? "NGN" : "USD");
              }}
            />
            <span>NGN ₦</span>
          </div>

          <RefreshButton isFetching={isFetching} refetch={refetch} />
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="min-h-[16rem] flex items-center justify-center">
            <PuffLoader
              color={"#F5BB00"}
              loading={isLoading}
              aria-label="Loading Spinner"
              data-testid="loader"
              size={100}
            />
          </div>
        ) : isError ? (
          <div className="text-xs flex items-center justify-center h-[10rem]">
            <ErrorDisplay message="Failed to get rates" />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <CoinListItem
              logo={"/Icon/NGN.png"}
              symbol="xNGN"
              tokenName="Naira on Bisats"
              currency="NGN"
              rate={1}
              upTrend={true}
              percent={"0.00"}
              isLoading={false}
              isXNGN
            />
            {currencyRate?.map((coin, idx) => {
              const upTrend = coin.price_change_percentage_24h > 0;
              const percent = Math.abs(
                coin.price_change_percentage_24h
              ).toFixed(2);
              return (
                <CoinListItem
                  key={idx}
                  logo={coin.image}
                  symbol={coin.symbol}
                  tokenName={coin.name}
                  currency={currency}
                  rate={coin.current_price}
                  upTrend={upTrend}
                  percent={percent}
                  isLoading={isFetching}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MarketRate);

type CoinListItemProps = {
  logo?: string;
  tokenName: string;
  symbol: string;
  isXNGN?: boolean;
  currency: "NGN" | "USD";
  rate: number;
  percent: string;
  upTrend: boolean;
  isLoading: boolean;
};

const CoinListItem = ({
  logo,
  tokenName,
  symbol,
  isXNGN,
  rate,
  currency,
  percent,
  upTrend,
  isLoading,
}: CoinListItemProps) => {
  return (
    <div className="flex justify-between items-center py-2 border-t ">
      <div className="flex items-center gap-2">
        <img
          src={logo || "/Icon/default-coin.png"}
          alt={`${tokenName} logo`}
          className="size-[20px]"
        />
        <div>
          <p
            className={cn(
              "font-semibold text-xs text-gray-600",
              !isXNGN && "uppercase"
            )}
          >
            {symbol}
          </p>
          <p className="text-xs text-gray-400">{tokenName}</p>
        </div>
      </div>
      {isLoading ? (
        <div>
          <BeatLoader
            color={"#F5BB00"}
            loading={isLoading}
            aria-label="Loading Spinner"
            data-testid="loader"
            size={8}
          />
        </div>
      ) : (
        <div className="flex items-center text-sm gap-2">
          <p className="font-semibold  text-gray-800 space-x-1">
            <span className="md:text-base text-sm">
              {formatter({}).format(rate)}
            </span>
            <span className="text-xs font-normal text-gray-600">
              {currency}
            </span>
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              upTrend ? "text-green-600" : "text-red-600"
            )}
          >
            <span className="text-[10px]">{upTrend ? "▲" : "▼"}</span>
            <p className="text-xs">{percent}%</p>
          </div>
        </div>
      )}
    </div>
  );
};
