import BisatLogo from "@/components/shared/Logo";
import MaxWidth from "@/components/shared/MaxWith";

import { APP_ROUTES } from "@/constants/app_route";

import Notification from "@/components/shared/Notification";
import ProfileDropdown from "@/components/shared/ProfileDropdown";
import { NavLink, useLocation } from "react-router-dom";

import useGetWallet from "@/hooks/use-getWallet";
import { useEffect } from "react";

const DashboardNavbar = () => {
  const location = useLocation();
  const { refreshWallet } = useGetWallet();

  useEffect(() => {
    const refreshPath = [
      APP_ROUTES.DASHBOARD,
      ...Object.values(APP_ROUTES.WALLET),
      APP_ROUTES.P2P.HOME,
      APP_ROUTES.P2P.MY_ADS,
      APP_ROUTES.P2P.CREATE_AD,
      APP_ROUTES.P2P.BUY,
      APP_ROUTES.P2P.SELL,
    ];

    if (refreshPath.includes(location.pathname)) {
      refreshWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-sm fixed inset-x-0 top-0 z-50  w-full">
      <MaxWidth as="nav" className="flex items-center justify-between py-5">
        <div className="scale-75">
          <BisatLogo link={APP_ROUTES.DASHBOARD} reload={false} />
        </div>
        <div className="hidden md:flex justify-center items-center gap-x-12 flex-1  font-semibold text-slate-500 dashboard-navbar">
          <NavLink to={APP_ROUTES.DASHBOARD}>Dashboard</NavLink>
          <NavLink to={APP_ROUTES.P2P.HOME}>P2P Market</NavLink>
          <NavLink to={APP_ROUTES.SWAP.HOME}>Swap</NavLink>
          <NavLink to={APP_ROUTES.WALLET.HOME}>Wallet</NavLink>
        </div>

        <div className="flex items-center gap-x-4 md:gap-x-5">
          <Notification />
          <ProfileDropdown />
        </div>
      </MaxWidth>
    </header>
  );
};

export default DashboardNavbar;
