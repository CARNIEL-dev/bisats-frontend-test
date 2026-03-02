import { APP_ROUTES } from "@/constants/app_route";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const GuestGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);

  // If the app is initializing or auth state is loading, we can show a loader or nothing
  // to prevent a flash of the auth layout when a user is actually logged in.
  // if (userState.loading) {
  //   return null; // Or replace with a full-screen spinner if you have one
  // }

  // If the user is authenticated, redirect them to the dashboard
  if (userState.isAuthenticated || userState.token) {
    return (window.location.href = APP_ROUTES.DASHBOARD);
  }

  // If not authenticated, render the children/outlet (the auth pages)
  return <Outlet />;
};

export default GuestGuard;
