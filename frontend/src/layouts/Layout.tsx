import { Footer } from "@/components/Footer";
import NavBar from "@/components/NavBar";
import SEO from "@/components/shared/SEO";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
        <NavBar />
        <div className="row-start-2 row-end-3 ">
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <SEO title="" />
    </>
  );
};

export default Layout;
