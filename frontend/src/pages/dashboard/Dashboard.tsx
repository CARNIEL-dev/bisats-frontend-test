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
        className="space-y-8 min-h-[75dvh] max-w-6xl lg:pb-5 mb-10 mt-6"
      >
        {openKycModal && <KycBanner />}
        <div className="">
          <h2 className="text-xl text-slate-700  font-semibold">
            Hello, {user?.userName || "User"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 my-4  items-start">
            <Balance />
            <MarketRate />
          </div>
        </div>
      </MaxWidth>
    </>
  );
};
export default Dashboard;
