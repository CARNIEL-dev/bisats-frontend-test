import React, { useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";
import SEO from "@/components/shared/SEO";

const DashboardLayout: React.FC = () => {
  useEffect(() => {
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = process.env.REACT_APP_TAWK_URL!;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
        <DashboardNavbar />
        <div className="row-start-2 row-end-3">
          <main className="min-h-[60dvh]">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <SEO
        title="Dashboard"
        description="View all your account details and transactions on Bisats."
      />
    </>
  );
};

export default DashboardLayout;
