import { APP_ROUTES } from "@/constants/app_route";
import { getRefreshToken } from "@/helpers";
import PreLoader from "@/layouts/PreLoader";
import { AnimatePresence } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useInactivityTimeout from "@/hooks/use-inactivity-timeout";
import SessionExpiredModal from "@/components/Modals/SessionExpiredModal";
import { resetSessionExpiredFlag } from "@/redux/fetchWrapper";

type SessionState = "active" | "inactive" | "expired";

/** Remove any orphaned scroll locks left by modals or the usePreventScroll hook */
const cleanupScrollLocks = () => {
  document.body.classList.remove("scroll-disabled");
  document.body.style.overflow = "";
  document.body.style.pointerEvents = "";
};

const AuthGuard: React.FC = () => {
  const userState: UserState = useSelector((state: RootState) => state.user);
  const [sessionState, setSessionState] = useState<SessionState>("active");
  const location = useLocation();

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

  // When tab becomes visible, validate session state and clean up scroll locks.
  // If the session was marked expired/inactive while hidden but the refresh token
  // still exists, the session is actually valid — the fetchWrapper will handle
  // token refresh transparently.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) return;

      // Only auto-reset a false "expired" state (caused by a transient refresh
      // failure during tab resume). "inactive" is a legitimate inactivity timeout
      // that should remain until the user clicks "Stay Signed In".
      if (sessionState === "expired") {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          resetSessionExpiredFlag();
          setSessionState("active");
          resetTimer();
          cleanupScrollLocks();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [sessionState, resetTimer]);

  const handleStay = useCallback(() => {
    setSessionState("active");
    resetTimer();
    cleanupScrollLocks();
  }, [resetTimer]);

  if (userState.loading) {
    return (
      <AnimatePresence>
        <PreLoader fullscreen key="auth-preloader" />
      </AnimatePresence>
    );
  }

  if (!userState.isAuthenticated && !userState.token) {
    return <Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
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
