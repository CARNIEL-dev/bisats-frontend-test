import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { AnimatePresence } from "motion/react";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);

  if (userState.loading) {
    return (
      <AnimatePresence>
        <PreLoader fullscreen key="auth-preloader" />
      </AnimatePresence>
    );
  }

  if (!userState.isAuthenticated && !userState.token) {
    return <Navigate to={APP_ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
