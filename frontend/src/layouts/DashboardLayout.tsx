import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";
import MobileAppPrompt from "@/components/shared/MobileAppPrompt";
import SEO from "@/components/shared/SEO";
import useGetWallet from "@/hooks/use-getWallet";
import ChatWidget from "@/layouts/ChatWidget";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  useGetWallet();
  return (
    <>
      <ChatWidget />
      <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
        <MobileAppPrompt />
        <DashboardNavbar />
        <div className="row-start-2 row-end-3">
          <main className="min-h-[60dvh]">
            <Outlet />
          </main>
          <Footer isDashboard />
        </div>
      </div>
      <SEO
        title="Dashboard"
        description="View all your account details and transactions on Bisats."
        keywords="Bisats dashboard, manage crypto Nigeria, peer to peer trading Nigeria, crypto wallet dashboard, buy sell bitcoin Nigeria, crypto automation"
      />
    </>
  );
};

export default DashboardLayout;
