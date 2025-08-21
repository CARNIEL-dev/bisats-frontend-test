import { APP_ROUTES } from "@/constants/app_route";
import AuthLayout from "@/layouts/auth/AuthLayout";
import KycLayOut from "@/layouts/KycLayOut";
import P2PLayOut from "@/layouts/P2PLayOut";
import SettingsLayOut from "@/layouts/SettingsLayOut";
import TranscLayOut from "@/layouts/TranscLayOut";
import {
  ForgotPassword,
  LogIn,
  OTP,
  ResetPassword,
  SignUp,
  VerifyEmail,
} from "@/pages/auth";
import Dashboard from "@/pages/dashboard/Dashboard";
import { Identity, PersonalInformation, POA } from "@/pages/kyc";
import BVNVerification from "@/pages/kyc/BVNVerification";
import Level3Verification from "@/pages/kyc/Level3Verification";
import PhoneVerifcation from "@/pages/kyc/PhoneVerification";
import About from "@/pages/landing-page/src/screens/Bisats/About";
import FAQs from "@/pages/landing-page/src/screens/FAQs";
import Policy from "@/pages/landing-page/src/screens/Policy";
import TermsAndCondition from "@/pages/landing-page/src/screens/TermsAndCondition";
import AdDetails from "@/pages/p2p/AdDetails";
import CreateAd from "@/pages/p2p/ads/CreateAds";
import Buy from "@/pages/p2p/Buy";
import Express from "@/pages/p2p/Express";
import MyAds from "@/pages/p2p/MyAds";
import OrderHistory from "@/pages/p2p/OrderHistory";
import Profile from "@/pages/p2p/Profile";
import Receipt from "@/pages/p2p/Receipt";
import Sell from "@/pages/p2p/Sell";
import Payment from "@/pages/settings/Payment";
import Security from "@/pages/settings/Security";
import Support from "@/pages/settings/Support";
import UserProfile from "@/pages/settings/Profile";
import DepositPage from "@/pages/wallet/deposits";
import TransactionBreakdown from "@/pages/wallet/deposits/TransactionBreakdown";
import Wallet from "@/pages/wallet/Wallet";
import WithdrawalPage from "@/pages/wallet/withdrawal";
import ProtectedRoute from "@/utils/protectedRoutes";

import DashboardLayout from "@/layouts/DashboardLayout";
import Layout from "@/layouts/Layout";
import { LandingPage } from "@/pages/landing-page/src/screens/Bisats/LandingPage";
import MarketPlacePage from "@/pages/p2p/MarketPlacePage";
import NotFound from "@/routing/NotFound";
import { Route, Routes } from "react-router-dom";
import Verify2FA from "@/pages/auth/Verify2FA";
import NotificationsPage from "@/pages/notifcations/NotificationsPage";
import GoogleVerify from "@/pages/auth/GoogleVerify";
import Corporate from "@/pages/settings/Corporate";

const Routing = () => {
  return (
    <>
      <Routes>
        {/* SUB: AUTH PAGES */}
        <Route element={<AuthLayout />}>
          <Route path={APP_ROUTES?.AUTH.SIGNUP} Component={SignUp} />
          <Route path={APP_ROUTES.AUTH.LOGIN} Component={LogIn} />
          <Route
            path={APP_ROUTES?.AUTH.FORGOT_PASSWORD}
            Component={ForgotPassword}
          />
          <Route
            path={APP_ROUTES.AUTH.GOOGLE_VERIFY}
            Component={GoogleVerify}
          />
          <Route path={`${APP_ROUTES?.AUTH.VERIFY}`} Component={VerifyEmail} />
          <Route path={APP_ROUTES.AUTH.OTP} Component={OTP} />
          <Route
            path={APP_ROUTES?.AUTH.RESET_PASSWORD}
            Component={ResetPassword}
          />
          <Route path={APP_ROUTES.AUTH.VERIFY_2FA} Component={Verify2FA} />
        </Route>
        {/* SUB: PROTECTED || DASHBOARD  PAGES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* SUB: Transaction PAGES */}
            <Route element={<TranscLayOut />}>
              <Route
                path={APP_ROUTES.WALLET.DEPOSIT}
                element={<DepositPage />}
              />
              <Route
                path={APP_ROUTES.WALLET.WITHDRAW}
                element={<WithdrawalPage />}
              />
              <Route
                path={APP_ROUTES.WALLET.TRANSACTION_BREAKDOWN}
                element={<TransactionBreakdown />}
              />
            </Route>

            {/* SUB: P2P PAGES */}
            <Route element={<P2PLayOut />}>
              <Route path={APP_ROUTES.P2P.HOME} element={<MarketPlacePage />} />
              <Route path={APP_ROUTES.P2P.EXPRESS} element={<Express />} />
              <Route
                path={APP_ROUTES.P2P.ORDER_HISTORY}
                element={<OrderHistory />}
              />
              <Route path={APP_ROUTES.P2P.MY_ADS} element={<MyAds />} />
              <Route path={APP_ROUTES.P2P.AD_DETAILS} element={<AdDetails />} />
              <Route path={APP_ROUTES.P2P.CREATE_AD} element={<CreateAd />} />
              <Route path={APP_ROUTES.P2P.MY_PROFILE} element={<Profile />} />
              <Route path={APP_ROUTES.P2P.SELL} element={<Sell />} />
              <Route path={APP_ROUTES.P2P.BUY} element={<Buy />} />
              <Route path={APP_ROUTES.P2P.RECEIPT} element={<Receipt />} />
            </Route>

            {/* SUB: SETTINGS PAGES */}
            <Route element={<SettingsLayOut />}>
              <Route
                path={APP_ROUTES.SETTINGS.PROFILE}
                element={<UserProfile />}
              />
              <Route
                path={APP_ROUTES.SETTINGS.SECURITY}
                element={<Security />}
              />
              <Route path={APP_ROUTES.SETTINGS.PAYMENT} element={<Payment />} />
              <Route path={APP_ROUTES.SETTINGS.SUPPORT} element={<Support />} />
              <Route
                path={APP_ROUTES.SETTINGS.CORPORATE}
                element={<Corporate />}
              />
            </Route>

            <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route
              path={APP_ROUTES.NOTIFICATION}
              element={<NotificationsPage />}
            />
            <Route path={APP_ROUTES.WALLET.HOME} element={<Wallet />} />
            <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
          </Route>

          {/* SUB: KYC PAGES */}
          <Route element={<KycLayOut isMain={false} />}>
            <Route
              path={APP_ROUTES?.KYC.PHONEVERIFICATION}
              Component={PhoneVerifcation}
            />
            <Route
              path={APP_ROUTES?.KYC.BVNVERIFICATION}
              Component={BVNVerification}
            />
            <Route
              path={APP_ROUTES?.KYC.LEVEL3VERIFICATION}
              Component={Level3Verification}
            />
            <Route element={<KycLayOut />}>
              <Route
                path={APP_ROUTES?.KYC.PERSONAL}
                Component={PersonalInformation}
              />
              <Route path={APP_ROUTES?.KYC.POA} Component={POA} />
              <Route path={APP_ROUTES?.KYC.IDENTITY} Component={Identity} />
            </Route>
          </Route>
        </Route>

        {/* SUB: MAIN PAGES */}
        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms&condition" element={<TermsAndCondition />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/faqs" element={<FAQs />} />
        </Route>
      </Routes>
    </>
  );
};

export default Routing;
