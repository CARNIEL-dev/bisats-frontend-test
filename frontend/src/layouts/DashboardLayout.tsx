import React, { useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  useEffect(() => {
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/68792ed91786aa1911e6c5be/1j0clu16v";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
      <DashboardNavbar />
      <div className="row-start-2 row-end-3">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
