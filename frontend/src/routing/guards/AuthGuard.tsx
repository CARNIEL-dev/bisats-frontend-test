import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import useInactivityTimeout from "@/hooks/use-inactivity-timeout";
import SessionExpiredModal from "@/components/Modals/SessionExpiredModal";

type SessionState = "active" | "inactive" | "expired";

const AuthGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);
  const [sessionState, setSessionState] = useState<SessionState>("active");

  const { resetTimer } = useInactivityTimeout(
    userState.isAuthenticated && sessionState === "active",
  );

  // Listen for inactivity warning
  useEffect(() => {
    const handleInactivity = () => setSessionState("inactive");
    window.addEventListener("inactivity-warning", handleInactivity);
    return () =>
      window.removeEventListener("inactivity-warning", handleInactivity);
  }, []);

  // Listen for session expired (refresh token failure)
  useEffect(() => {
    const handleExpired = () => setSessionState("expired");
    window.addEventListener("session-expired", handleExpired);
    return () => window.removeEventListener("session-expired", handleExpired);
  }, []);

  const handleStay = () => {
    setSessionState("active");
    resetTimer();
  };

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

  return (
    <>
      <Outlet />
      {sessionState === "inactive" && (
        <SessionExpiredModal variant="inactivity" onStay={handleStay} />
      )}
      {sessionState === "expired" && (
        <SessionExpiredModal variant="expired" />
      )}
    </>
  );
};

export default AuthGuard;
