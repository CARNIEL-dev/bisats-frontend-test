// import Toast from "@/components/Toast";
// import { messaging, onMessage } from "@/firebase";
import { rehydrateUser } from "@/redux/actions/userActions";
import { GetWallet } from "@/redux/actions/walletActions";

import Routing from "@/routing/Routing";
import ScrollToTop from "@/routing/scrollToTop";
// import { requestPermission } from "@/utils/firebaseNotification";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);

  // useEffect(() => {
  //   onMessage(messaging, (payload) => {
  //     if (payload) {
  //       Toast.success(
  //         payload?.notification?.body ?? "",
  //         payload?.notification?.title ?? ""
  //       );
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (userState.isAuthenticated) {
      rehydrateUser({
        userId: userState.user?.userId,
        token: userState.user?.token,
      });
      GetWallet();
      // requestPermission();
    }
  }, [userState.isAuthenticated]);

  return (
    <>
      <Router>
        <ScrollToTop>
          <Routing />
        </ScrollToTop>

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
