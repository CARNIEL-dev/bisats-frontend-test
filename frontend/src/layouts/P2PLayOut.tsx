import RateBanner from "@/components/RateBanner";

import MaxWidth from "@/components/shared/MaxWith";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
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

const P2PLayOut = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className=" mb-10">
      <div className="bg-primary-light h-[48px] md:overflow-hidden overflow-scroll w-screen fixed inset-x-0 md:top-[5rem] top-[4rem] z-10 flex items-center ">
        <RateBanner />
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
                  "active",
                page.link !== APP_ROUTES.P2P.HOME &&
                  pathname.includes(page.link) &&
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
