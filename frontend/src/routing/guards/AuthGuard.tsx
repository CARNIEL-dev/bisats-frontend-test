import { APP_ROUTES } from "@/constants/app_route";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const AuthGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);
  // const location = useLocation();

  // If the app is initializing or auth state is loading, we can show a loader or nothing
  // to prevent a flash of the protected layout when a user is actually not logged in.
  // if (userState.loading) {
  //   return null; // Or replace with a full-screen spinner if you have one
  // }

  // If the user is not authenticated, redirect them to login with the current location saved
  if (!userState.isAuthenticated && !userState.token) {
    return (
      // <Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
      (window.location.href = APP_ROUTES.AUTH.LOGIN)
    );
  }

  // If authenticated, render the children/outlet (the protected pages)
  return <Outlet />;
};

export default AuthGuard;
