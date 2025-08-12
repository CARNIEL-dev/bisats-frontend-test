import { UserState } from "@/redux/reducers/userSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userState: UserState = useSelector((state: any) => state.user);

  if (!userState.isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
