import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth/AuthLayout';
import KycLayOut from './layouts/KycLayOut';
import { LogIn, SignUp, ForgotPassword, VerifyEmail, OTP, ResetPassword } from './pages/auth';
import './App.css';
import { APP_ROUTES } from './constants/app_route';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Identity, POA, PersonalInformation } from './pages/kyc';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './utils/protectedRoutes';
import { UserState } from './redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import Wallet from './pages/wallet/Wallet';
import { rehydrateUser } from './redux/actions/userActions';
import PhoneVerifcation from './pages/kyc/PhoneVerification';
import DepositPage from './pages/wallet/deposits';
import TranscLayOut from './layouts/TranscLayOut';
import WithdrawalPage from './pages/wallet/withdrawal';
import P2PLayOut from './layouts/P2PLayOut';
import MarketPlace from './pages/p2p/MarketPlace';
import Express from './pages/p2p/Express';
import MyAds from './pages/p2p/ads/MyAds';
import Profile from './pages/p2p/Profile';
import Sell from './pages/p2p/Sell';
import Buy from './pages/p2p/Buy';
import Receipt from './pages/p2p/Receipt';
import SettingsLayOut from './layouts/SettingsLayOut';
import UserInfo from './pages/settings/UserInfo';
import Security from './pages/settings/Security';
import Payment from './pages/settings/Payment';
import TransactionBreakdown from './pages/wallet/deposits/TransactionBreakdown';
import AdDetails from './pages/p2p/AdDetails';
import { Bisats } from './pages/landing-page/src/screens/Bisats';
import BVNVerification from './pages/kyc/BVNVerification';
import Level3Verification from './pages/kyc/Level3Verification';
import CreateAd from  './pages/p2p/ads/Ad';
import OrderHistory from './pages/p2p/OrderHistory';
import { Footer } from './components/Footer';
import { requestPermission } from './utils/firebaseNotification';
import { messaging,onMessage } from './firebase';
import Support from './pages/settings/Support';


const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);

  
  useEffect(() => { rehydrateUser() }, [])

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // You can show a toast or in-app notification here
    });
  }, []);

  useEffect(() => {
   requestPermission()
  }, []);
  return (

    <Router>
      <Routes>
        <>
          <Route element={<AuthLayout />}>
            <Route path={APP_ROUTES?.AUTH.SIGNUP} Component={SignUp} />
            <Route path={APP_ROUTES.AUTH.LOGIN} Component={LogIn}/>
            <Route path={APP_ROUTES?.AUTH.FORGOT_PASSWORD} Component={ForgotPassword} />
            <Route path={`${APP_ROUTES?.AUTH.VERIFY}`} Component={VerifyEmail} />
            <Route path={APP_ROUTES.AUTH.OTP} Component={OTP} />
            <Route path={APP_ROUTES?.AUTH.RESET_PASSWORD} Component={ResetPassword} />
          </Route>
          <Route
            element={<ProtectedRoute user={userState} />}
          >
            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} /> */}
            {/* <Route path="/wallet/deposit" element={<Deposit />} />
            <Route path="/wallet/withdrawal" element={<Withdrawal />} /> */}

            <Route element={<KycLayOut />}>
              <Route path={APP_ROUTES?.KYC.PERSONAL} Component={PersonalInformation} />
              <Route path={APP_ROUTES?.KYC.POA} Component={POA} />
              <Route path={APP_ROUTES?.KYC.IDENTITY} Component={Identity} />
            </Route>
            <Route element={<TranscLayOut />}>
              <Route path={APP_ROUTES.WALLET.DEPOSIT} element={<DepositPage />} />
              <Route path={APP_ROUTES.WALLET.WITHDRAW} element={<WithdrawalPage />} />
              <Route path={APP_ROUTES.WALLET.TRANSACTION_BREAKDOWN} element={<TransactionBreakdown />} />


            </Route>
            <Route element={<P2PLayOut />}>
              <Route path={APP_ROUTES.P2P.MARKETPLACE} element={<MarketPlace />} />
              <Route path={APP_ROUTES.P2P.EXPRESS} element={<Express />} />
              <Route path={APP_ROUTES.P2P.ORDER_HISTORY} element={<OrderHistory />} />
              <Route path={APP_ROUTES.P2P.MY_ADS} element={<MyAds />} />
              <Route path={APP_ROUTES.P2P.AD_DETAILS} element={<AdDetails />} />
              <Route path={APP_ROUTES.P2P.CREATE_AD} element={<CreateAd />} />
              <Route path={APP_ROUTES.P2P.MY_PROFILE} element={<Profile />} />
              <Route path={APP_ROUTES.P2P.SELL} element={<Sell />} />
              <Route path={APP_ROUTES.P2P.BUY} element={<Buy />} />
              <Route path={APP_ROUTES.P2P.RECEIPT} element={<Receipt />} />
            </Route>
            <Route element={<SettingsLayOut />}>
              <Route path={APP_ROUTES.SETTINGS.PROFILE} element={<UserInfo />} />
              <Route path={APP_ROUTES.SETTINGS.SECURITY} element={<Security />} />
              <Route path={APP_ROUTES.SETTINGS.PAYMENT} element={<Payment />} />
              <Route path={APP_ROUTES.SETTINGS.SUPPORT} element={<Support />} />

            </Route>
            <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={APP_ROUTES.WALLET.HOME} element={<Wallet />} />
            <Route path={APP_ROUTES.PROFILE} element={<Profile />} />


            <Route path={APP_ROUTES?.KYC.PHONEVERIFICATION} Component={PhoneVerifcation} />
            <Route path={APP_ROUTES?.KYC.BVNVERIFICATION} Component={BVNVerification} />
            <Route path={APP_ROUTES?.KYC.LEVEL3VERIFICATION} Component={Level3Verification} />


          </Route>

          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/" element={<Bisats/>} />

        </>
      </Routes>
      <Footer/>
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

  );
};

export default App;
