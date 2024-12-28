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
import { rehydrateUser } from './redux/actions/userActions';
import PhoneVerifcation from './pages/kyc/PhoneVerification';


const App: React.FC = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  useEffect(() => { rehydrateUser() }, [])
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
            <Route element={<KycLayOut />}>
              <Route path={APP_ROUTES?.KYC.PERSONAL} Component={PersonalInformation} />
              <Route path={APP_ROUTES?.KYC.POA} Component={POA} />
              <Route path={APP_ROUTES?.KYC.IDENTITY} Component={Identity} />

              
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path={APP_ROUTES?.KYC.PHONEVERIFICATION} Component={PhoneVerifcation} />

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
