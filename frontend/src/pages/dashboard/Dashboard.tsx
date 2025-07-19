import MaxWidth from "@/components/shared/MaxWith";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import KycBanner from "@/components/KycBanner";
import { APP_ROUTES } from "@/constants/app_route";
import { GetWallet } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import Ads from "@/pages/dashboard/Ads";
import Balance from "@/pages/dashboard/Balance";
import MarketRate from "@/pages/dashboard/MarketRate";
import Orders from "@/pages/dashboard/Orders";

const Dashboard = () => {
  const [openKycModal, setKycModalOpen] = useState(false);
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  useEffect(() => {
    GetWallet();
  }, []);

  useEffect(() => {
    const kyscStatus = user?.kyc;
    if (
      !kyscStatus?.identificationVerified ||
      !kyscStatus?.personalInformationVerified ||
      !user?.phoneNumberVerified
    ) {
      setKycModalOpen(true);
    }
    // GetKYCStatus({ userId: user?.userId })
  }, []);

  return (
    <>
      <MaxWidth
        as="section"
        className="space-y-8 max-w-6xl lg:pb-5 mb-10 mt-6"
      >
        {openKycModal && <KycBanner />}
        <div className="w-full flex justify-center ">
          <div className="w-full">
            <h2 className="text-xl text-slate-700  font-semibold">
              Hello, {user?.userName || "User"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 my-4  items-start">
              <div className="h-full">
                <Balance />
              </div>
              <div className="h-full">
                <MarketRate />
              </div>
            </div>

            <div className="lg:border flex flex-col gap-4   sm:p-[24px] rounded-2xl">
              <div className="flex items-center gap-2">
                <p className=" text-lg sm:text-base font-semibold">
                  My Open ads
                </p>
                <Link
                  to={APP_ROUTES.P2P.MY_ADS}
                  className="text-[#C49600] text-sm font-semibold"
                >
                  {" "}
                  view all
                </Link>
              </div>
              <Ads />
            </div>
            <div className="lg:border mt-4  flex flex-col gap-4  rounded-2xl sm:p-[24px]">
              <div className="flex items-center gap-2">
                <p className=" text-lg sm:text-base font-semibold">
                  Order History
                </p>
                <Link
                  to={APP_ROUTES.P2P.ORDER_HISTORY}
                  className="text-[#C49600] text-sm font-semibold"
                >
                  {" "}
                  view all
                </Link>
              </div>

              <Orders />
            </div>
          </div>
        </div>
      </MaxWidth>
    </>
  );
};
export default Dashboard;
