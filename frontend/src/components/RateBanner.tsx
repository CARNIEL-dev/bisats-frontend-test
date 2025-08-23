import DownTrend from "@/assets/icons/downTrend.svg";
import UpTrend from "@/assets/icons/upTrend.svg";
import { tokenLogos } from "@/assets/tokens/index";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { useMemo } from "react";
import Marquee from "react-fast-marquee";
import { BarLoader } from "react-spinners";

const RateBanner = () => {
  //SUB: Query function
  const {
    data: currencyRates,
    isFetching,
    isError,
  } = useCryptoRates({ isEnabled: true });

  const defaultCoins = useMemo(
    () => [
      {
        name: "Naira on Bisats",
        logo: tokenLogos.xNGN,
        symbol: "xNGN",
        USDRate:
          (currencyRates?.tether?.usd || 0) / (currencyRates?.tether?.ngn || 0),
        usdTrend: currencyRates?.tether?.usd_24h_change ?? 0,
      },
      {
        name: "Bitcoin",
        logo: tokenLogos.BTC,
        symbol: "BTC",
        USDRate: currencyRates?.bitcoin?.usd ?? 0,
        usdTrend: currencyRates?.bitcoin?.usd_24h_change ?? 0,
      },
      {
        name: "Ethereum",
        logo: tokenLogos.ETH,
        symbol: "ETH",
        USDRate: currencyRates?.ethereum?.usd ?? 0,
        usdTrend: currencyRates?.ethereum?.usd_24h_change ?? 0,
      },
      {
        name: "Tether USD",
        logo: tokenLogos.USDT,
        symbol: "USDT",
        USDRate: currencyRates?.tether?.usd ?? 0,
        usdTrend: currencyRates?.tether?.usd_24h_change ?? 0,
      },
      {
        name: "Solana",
        logo: tokenLogos.SOL,
        symbol: "SOL",
        USDRate: currencyRates?.solana?.usd ?? 0,
        usdTrend: currencyRates?.solana?.usd_24h_change ?? 0,
      },
    ],
    [currencyRates]
  );

  return (
    <>
      {isFetching ? (
        <>
          <BarLoader
            color={"#F5BB0060"}
            loading={isFetching}
            aria-label="Loading Spinner"
            data-testid="loader"
            width={"100%"}
          />
        </>
      ) : isError ? (
        <span />
      ) : (
        <Marquee autoFill pauseOnHover>
          <div className="flex md:gap-12 gap-2  justify-between items-center animate-pulse">
            {defaultCoins?.map((coin, idx) => {
              const up = coin.usdTrend > 0;
              return (
                <div
                  className="flex gap-1.5 items-center text-xs text-[#515B6E] w-fit md:mx-12 mx-4"
                  key={idx}
                >
                  <img
                    src={coin.logo}
                    alt={`${coin.name} logo`}
                    className="w-[16px] h-[16px]"
                  />
                  <p className=" font-semibold uppercase ">{coin.symbol}</p>
                  <p className=" font-normal">{`${coin.USDRate.toLocaleString()} USD`}</p>
                  <div
                    className={`font-mono  ${
                      up ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(coin.usdTrend).toFixed(2)}%
                  </div>
                  <img
                    src={up ? UpTrend : DownTrend}
                    alt={`market trend`}
                    className="w-[16px] h-[16px]"
                  />
                </div>
              );
            })}

            {/* <div className="flex gap-1.5 items-center text-xs text-[#515B6E] w-fit md:mx-12 mx-4">
              <img src={NGN} alt={`xNGN logo`} className="w-[16px] h-[16px]" />
              <p className=" font-semibold ">xNGN</p>
              <p className=" font-normal">1 NGN</p>
              <div className={`font-mono text-green-600`}>0.00%</div>
              <img
                src={UpTrend}
                alt={`market trend`}
                className="w-[16px] h-[16px]"
              />
            </div> */}
          </div>
        </Marquee>
      )}
    </>
  );
};

export default RateBanner;

/* 
     {LiveData.map((data, idx) => (
            <div
              className="flex gap-1.5 items-center text-xs text-[#515B6E] w-fit md:mx-12 mx-4"
              key={idx}
            >
              <img
                src={data.logo}
                alt={`${data.token} logo`}
                className="w-[16px] h-[16px]"
              />
              <p className=" font-semibold ">{data.token}</p>
              <p className=" font-normal  ">{`${data.price} USD ${data.percentageIncrease}`}</p>
              <img
                src={data.trend === "up" ? UpTrend : DownTrend}
                alt={`market trend`}
                className="w-[16px] h-[16px]"
              />
            </div>
          ))}

*/
