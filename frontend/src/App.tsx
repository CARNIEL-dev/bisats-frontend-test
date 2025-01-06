import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth/AuthLayout';
import { LogIn, SignUp, ForgotPassword, VerifyEmail, OTP, ResetPassword } from './pages/auth';
import './App.css';
import { APP_ROUTES } from './constants/app_route';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './utils/protectedRoutes';
import { UserState } from './redux/reducers/userSlice';
import { useSelector } from 'react-redux';
import Wallet from './pages/wallet/Wallet';
import Deposit from './pages/deposit/Deposit';



const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);

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
            <Route path="/wallet/deposit" element={<Deposit />} />
          </Route>

          <Route path="*" element={<Navigate to="/home" />} />
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
