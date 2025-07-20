import DownTrend from "@/assets/icons/downTrend.svg";
import UpTrend from "@/assets/icons/upTrend.svg";
import { BTC, ETH, NGN, SOL, USDT } from "@/assets/tokens";
import MaxWidth from "@/components/shared/MaxWith";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
import Marquee from "react-fast-marquee";
import { Link, Outlet, useLocation } from "react-router-dom";

const PageData = [
  {
    tab: "Market",
    link: APP_ROUTES.P2P.HOME,
  },
  // {
  //   tab: "Express",
  //   link: APP_ROUTES.P2P.EXPRESS,
  // },
  {
    tab: "My ads",
    link: APP_ROUTES.P2P.MY_ADS,
  },
  {
    tab: "Order history",
    link: APP_ROUTES.P2P.ORDER_HISTORY,
  },
];
const LiveData = [
  {
    token: "BTC",
    logo: BTC,
    price: "90,200.11",
    trend: "up",
    percentageIncrease: "3.8%",
  },
  {
    token: "ETH",
    logo: ETH,
    price: "1.01",
    trend: "down",
    percentageIncrease: "2.4%",
  },
  {
    token: "SOL",
    logo: SOL,
    price: "220.11",
    trend: "up",
    percentageIncrease: "10.9%",
  },
  {
    token: "USDT",
    logo: USDT,
    price: "1.0002",
    trend: "up",
    percentageIncrease: "0.0%",
  },

  {
    token: "xNGN",
    logo: NGN,
    price: "1670",
    trend: "up",
    percentageIncrease: "5%",
  },
];

const P2PLayOut = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className=" mb-10">
      <div className="bg-primary-light h-[48px] md:overflow-hidden overflow-scroll w-screen fixed inset-x-0 md:top-[5rem] top-[4rem] z-10 flex items-center ">
        <Marquee autoFill pauseOnHover>
          <div className="flex md:gap-12 gap-2  justify-between items-center animate-pulse">
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
                <h2 className=" font-semibold ">{data.token}</h2>
                <p className=" font-normal  ">{`${data.price} USD ${data.percentageIncrease}`}</p>
                <img
                  src={data.trend === "up" ? UpTrend : DownTrend}
                  alt={`market trend`}
                  className="w-[16px] h-[16px]"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
      <div className="bg-white hidden lg:flex fixed inset-x-0 z-10 top-[8rem] py-3">
        <MaxWidth className="max-w-[22rem] flex justify-center gap-10  items-center flex-nowrap text-[#515B6E] border border-primary  py-3 rounded-full dashboard-navbar">
          {PageData.map((page) => (
            <Link
              to={`${page.link}`}
              key={page.link}
              className={cn(
                "font-semibold text-sm",
                pathname === page.link && "active",
                page.link === APP_ROUTES.P2P.HOME &&
                  pathname.includes("market-place") &&
                  "active"
              )}
            >
              {page.tab}
            </Link>
          ))}
        </MaxWidth>
      </div>

      <MaxWidth
        as="section"
        className="md:min-h-[75dvh] min-h-[95dvh] max-w-[72rem]  md:mt-36 mt-16"
      >
        <Outlet />
      </MaxWidth>
    </div>
  );
};

export default P2PLayOut;
