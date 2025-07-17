import { Navigate, Outlet } from "react-router-dom";
import { UserState } from "@/redux/reducers/userSlice";
import { useSelector } from "react-redux";

// const userFromLocalStorage = getUser()
const ProtectedRoute = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  console.log("Logged in User", userState);

  if (!userState.isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
