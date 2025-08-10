import { tokenLogos } from "@/assets/tokens";
import RefreshButton from "@/components/RefreshButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import Switch from "@/components/Switch";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { cn, formatter } from "@/utils";
import React, { useMemo, useState } from "react";
import { BeatLoader, PuffLoader } from "react-spinners";

const MarketRate: React.FC = () => {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  //SUB: Query function
  const {
    data: currencyRates,
    isFetching,
    isError,
    isLoading,
    refetch,
  } = useCryptoRates({ isEnabled: true });

  const defaultAssetsData = useMemo(
    () => [
      {
        name: "Naira on Bisats",
        logo: tokenLogos.xNGN,
        symbol: "xNGN",
        USDRate:
          (currencyRates?.tether?.usd || 0) / (currencyRates?.tether?.ngn || 0),
        NairaRate: currencyRates?.tether?.usd ?? 0,
        ngnTrend: currencyRates?.tether?.usd_24h_change ?? 0,
        usdTrend: currencyRates?.tether?.usd_24h_change ?? 0,
      },
      {
        name: "Bitcoin",
        logo: tokenLogos.BTC,
        symbol: "BTC",
        USDRate: currencyRates?.bitcoin?.usd ?? 0,
        NairaRate: currencyRates?.bitcoin?.ngn ?? 0,
        ngnTrend: currencyRates?.bitcoin?.ngn_24h_change ?? 0,
        usdTrend: currencyRates?.bitcoin?.usd_24h_change ?? 0,
      },
      {
        name: "Ethereum",
        logo: tokenLogos.ETH,
        symbol: "ETH",
        USDRate: currencyRates?.ethereum?.usd ?? 0,
        NairaRate: currencyRates?.ethereum?.ngn ?? 0,
        ngnTrend: currencyRates?.ethereum?.ngn_24h_change ?? 0,
        usdTrend: currencyRates?.ethereum?.usd_24h_change ?? 0,
      },
      {
        name: "Tether USD",
        logo: tokenLogos.USDT,
        symbol: "USDT",
        USDRate: currencyRates?.tether?.usd ?? 0,
        NairaRate: currencyRates?.tether?.ngn ?? 0,
        ngnTrend: currencyRates?.tether?.ngn_24h_change ?? 0,
        usdTrend: currencyRates?.tether?.usd_24h_change ?? 0,
      },
      {
        name: "Solana",
        logo: tokenLogos.SOL,
        symbol: "SOL",
        USDRate: currencyRates?.solana?.usd ?? 0,
        NairaRate: currencyRates?.solana?.ngn ?? 0,
        ngnTrend: currencyRates?.solana?.ngn_24h_change ?? 0,
        usdTrend: currencyRates?.solana?.usd_24h_change ?? 0,
      },
    ],
    [currencyRates]
  );

  return (
    <div className="border space-y-4 h-full w-full p-6 rounded-2xl">
      <div className="flex items-center md:items-start lg:items-center md:flex-col lg:flex-row justify-between gap-2">
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
            {defaultAssetsData?.map((coin, idx) => {
              const upTrend =
                (currency === "NGN" ? coin.ngnTrend : coin.usdTrend) > 0;

              const percent = Math.abs(
                currency === "NGN" ? coin.ngnTrend : coin.usdTrend
              ).toFixed(2);
              const rate = currency === "NGN" ? coin.NairaRate : coin.USDRate;

              return (
                <CoinListItem
                  key={idx}
                  logo={coin.logo}
                  symbol={coin.symbol}
                  tokenName={coin.name}
                  currency={currency}
                  rate={rate}
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
              {formatter({
                decimal: currency === "USD" && symbol === "xNGN" ? 6 : 2,
              }).format(rate)}
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
