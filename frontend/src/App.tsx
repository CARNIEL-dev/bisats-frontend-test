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
import Deposit from './pages/deposit/Deposit';
import Withdrawal from './pages/withdrawal/Withdrawal';
import { rehydrateUser } from './redux/actions/userActions';
import PhoneVerifcation from './pages/kyc/PhoneVerification';
import DepositPage from './pages/wallet/deposits';
import TranscLayOut from './layouts/TranscLayOut';
import WithdrawalPage from './pages/wallet/withdrawal';
import P2PLayOut from './layouts/P2PLayOut';
import MarketPlace from './pages/p2p/MarketPlace';
import Express from './pages/p2p/Express';
import MyAds from './pages/p2p/MyAds';
import Profile from './pages/p2p/Profile';


const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  useEffect(() => { rehydrateUser() }, [userState.isAuthenticated])
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
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
            </Route>
            <Route element={<P2PLayOut />}>
              <Route path={APP_ROUTES.P2P.MARKETPLACE} element={<MarketPlace />} />
              <Route path={APP_ROUTES.P2P.EXPRESS} element={<Express />} />
              <Route path={APP_ROUTES.P2P.MY_ADS} element={<MyAds />} />
              <Route path={APP_ROUTES.P2P.MY_PROFILE} element={<Profile />} />
            </Route>
            <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />

            <Route path={APP_ROUTES?.KYC.PHONEVERIFICATION} Component={PhoneVerifcation} />
          </Route>

          <Route path="*" element={<Navigate to="/404" />} />
        </>
      </Routes>
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
