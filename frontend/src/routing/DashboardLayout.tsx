import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
      <DashboardNavbar />
      <div className="row-start-2 row-end-3 ">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
