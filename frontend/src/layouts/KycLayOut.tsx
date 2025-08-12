import { Outlet } from "react-router-dom";
import OtherSide from "@/layouts/auth/OtherSide";
import MaxWidth from "@/components/shared/MaxWith";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Footer } from "@/components/Footer";

const KycLayOut = ({ isMain = true }: { isMain?: boolean }) => {
  return (
    <>
      {isMain ? (
        <MaxWidth className="space-y-8 min-h-[75dvh] 2xl:max-w-4xl max-w-[23rem] lg:max-w-2xl  lg:pb-5 mb-10 mt-6">
          <OtherSide
            header="Complete your KYC"
            subHeader="Verify Your Identity to fully unlock your Bisats account"
            upperSubHeader={<></>}
          />

          <Outlet />
        </MaxWidth>
      ) : (
        <div className="grid md:grid-rows-[80px_1fr] grid-rows-[62px_1fr]">
          <DashboardNavbar />
          <div className="row-start-2 row-end-3">
            <MaxWidth
              as="main"
              className="min-h-[calc(100vh-90px)] space-y-8  2xl:max-w-4xl max-w-[23rem] lg:max-w-2xl  lg:pb-5 mb-10 mt-6"
            >
              <Outlet />
            </MaxWidth>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default KycLayOut;
