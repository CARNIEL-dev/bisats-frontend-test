import React, { useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";
import SEO from "@/components/shared/SEO";

const DashboardLayout: React.FC = () => {
  useEffect(() => {
    const inlineScript = document.createElement("script");
    inlineScript.type = "text/javascript";
    inlineScript.text =
      "window.$zoho=window.$zoho || {};" +
      "$zoho.salesiq=$zoho.salesiq||{ready:function(){}};";

    const zohoScript = document.createElement("script");
    zohoScript.id = "zsiqscript";
    zohoScript.src = process.env.REACT_APP_ZOHO_URL!;
    zohoScript.defer = true;

    document.body.appendChild(inlineScript);
    document.body.appendChild(zohoScript);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(inlineScript);
      document.body.removeChild(zohoScript);
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
        keywords="Bisats dashboard, manage crypto Nigeria, peer to peer trading Nigeria, crypto wallet dashboard, buy sell bitcoin Nigeria, crypto automation"
      />
    </>
  );
};

export default DashboardLayout;
