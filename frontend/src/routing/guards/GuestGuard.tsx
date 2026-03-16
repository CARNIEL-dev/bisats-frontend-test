import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { AnimatePresence } from "motion/react";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);

  if (userState.loading) {
    return (
      <AnimatePresence>
        <PreLoader fullscreen key="guest-preloader" />
      </AnimatePresence>
    );
  }

  if (userState.isAuthenticated && userState.token) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
