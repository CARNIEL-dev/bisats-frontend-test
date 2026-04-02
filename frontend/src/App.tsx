// import Toast from "@/components/Toast";
// import { messaging, onMessage } from "@/firebase";
import { rehydrateUser } from "@/redux/actions/userActions";

import Routing from "@/routing/Routing";
import ScrollToTop from "@/routing/scrollToTop";
// import { requestPermission } from "@/utils/firebaseNotification";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInactivityTimeout from "@/hooks/use-inactivity-timeout";
import SessionExpiredModal from "@/components/Modals/SessionExpiredModal";

const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (userState.isAuthenticated) {
      rehydrateUser({
        userId: userState.user?.userId,
        token: userState.user?.token,
      });

      // requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.isAuthenticated]);

  // Listen for session-expired events (from fetchWrapper or inactivity timeout)
  useEffect(() => {
    const handleSessionExpired = () => setSessionExpired(true);
    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  // Reset sessionExpired when user logs back in
  useEffect(() => {
    if (userState.isAuthenticated) {
      setSessionExpired(false);
    }
  }, [userState.isAuthenticated]);

  // Start inactivity timer when authenticated
  useInactivityTimeout(userState.isAuthenticated);

  return (
    <>
      <Router>
        <ScrollToTop>
          <Routing />
        </ScrollToTop>

        {sessionExpired && userState.isAuthenticated && (
          <SessionExpiredModal />
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          // newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginRight: "90px" }}
        />
      </Router>
    </>
  );
};

export default App;
