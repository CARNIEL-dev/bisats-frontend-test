import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import OtherSide from "./auth/OtherSide";

const KycLayOut = () => {
  return (
    <div>
      <div className={`bg-white bg-no-repeat bg-cover h-full w-full py-20`}>
        <div className="w-full lg:w-2/5 mx-auto h-full px-3 lg:items-center ">
          <OtherSide
            header="Complete your KYC"
            subHeader="Verify Your Identity to fully unlock your Bisats account"
            upperSubHeader={<></>}
          />

          <div className="w-full  flex justify-center items-center py-5 bg-white">
            <div className="w-full ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycLayOut;
