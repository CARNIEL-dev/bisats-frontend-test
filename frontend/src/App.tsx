import Routing from "@/routing/Routing";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "./components/Toast";
import { messaging, onMessage } from "./firebase";
import { GetNotification } from "./redux/actions/generalActions";
import { rehydrateUser } from "./redux/actions/userActions";
import { GetWallet } from "./redux/actions/walletActions";
import { requestPermission } from "./utils/firebaseNotification";
import ScrollToTop from "./routing/scrollToTop";

const App: React.FC = () => {
  useEffect(() => {
    rehydrateUser();
    GetNotification();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      if (payload) {
        Toast.success(
          payload?.notification?.body ?? "",
          payload?.notification?.title ?? ""
        );
        rehydrateUser();
        GetWallet();
        GetNotification();
      }
      // You can show a toast or in-app notification here
    });
  }, []);

  useEffect(() => {
    console.log("request permission");
    requestPermission();
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop>
          <Routing />
        </ScrollToTop>

        {/* <Footer /> */}
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
          // theme="colored"
        />
      </Router>
    </>
  );
};

export default App;
