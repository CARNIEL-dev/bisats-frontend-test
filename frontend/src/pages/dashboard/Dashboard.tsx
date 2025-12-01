import KycBanner from "@/components/KycBanner";
import MaxWidth from "@/components/shared/MaxWith";
import OrdersChart from "@/components/shared/OrdersChart";
import { Button } from "@/components/ui/Button";
import Balance from "@/pages/dashboard/Balance";
import MarketRate from "@/pages/dashboard/MarketRate";
import { decryptDataInfo } from "@/utils/encryptor";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [openKycModal, setKycModalOpen] = useState(false);
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  useEffect(() => {
    const unverifiedFields = [
      !user?.kyc?.identificationVerified && !user?.hasAppliedToBeInLevelOne,
      !user?.kyc?.personalInformationVerified,
      // !user?.phoneNumberVerified,
    ];

    if (unverifiedFields.some(Boolean)) {
      setKycModalOpen(true);
    }
  }, [
    user?.kyc?.identificationVerified,
    user?.kyc?.personalInformationVerified,
    // user?.phoneNumberVerified,
  ]);

  return (
    <>
      <MaxWidth
        as="section"
        className="space-y-8 min-h-[75dvh] max-w-6xl lg:pb-5 mb-10 mt-6"
      >
        {openKycModal && <KycBanner />}
        <Button
          className="hidden"
          onClick={() => {
            const val = decryptDataInfo({
              data: "eyJwYXlsb2FkIjoidXYrVUVmb0N3Y3ZabU8zUDlGWmdVanFFS2sxOWppdFllUUgyaGRFMzZqU3ppZmZtZ3RiUGFqNjdPUUE3RVdWSi9nZFNYanliaXpCWG1xVnVaZnJ1bkRuczE2amg4UFlzWCtybTUzbDM3Zm16M1gyKzVBS0JjOEVCOEd6eEl0M0lWT29wd3NSbWFGN3RQWXh5UEhSeDF3M0NscjBaQnJYc1VkcWExMDlWSXUxWGF6elJaMXlCbnZsbjBJbEZZWXZ2Ujd2UmczZTRybGpMMmNXNERkV3Q1WjQ5Z1RnNE9SZnR2Zzd0dDErTlBxVzNaRWpzVHhJRjh3UTNJNEM2VjZyN0NxMUFPKytJR2RJb1BJQlJsb1hMR0JhV2dDWEg0U0g0NXdYb203ZlRucDdieVMvRmJ4eVNtQytQNjVuYkJ6WjRQTFFQYmpvSTlMdnVNTW1mdDFQdzlnMmhscytYQytLZFhtZEJiZW9PK2NUZndZcUo3MTQ1bkNxNUJLYjNZUHZKdVpSM2pIQVFQVGs3SFBUMWxLdVlVOFJmM2Y4azM0REd0VE8zOTRIWU1nMXdYQ1h4VFVUMzJxVk1uOVAwWHVoRklqeVloLy9JSC8yYzYxVDAyaVJDQ3Y1VlVIbHF1WnlZU2llLzFSc0dTSjA9IiwiaXYiOiJjVndYZEJqVUgzYUxyNENFVU0yRUxRPT0iLCJ0aW1lc3RhbXAiOiIyMDI1LTExLTI2VDEzOjAzOjIyLjI1MFoifQ==",
            });
            console.log("decrypted val", val);
          }}
        >
          Decrypr
        </Button>

        <div className="">
          <div className="grid md:grid-cols-2 gap-4 my-4 ">
            <div className="space-y-4">
              <div className="border-0 rounded-2xl px-5 py-2 border-priYellow bg-priYellow/10 md:mt-4">
                <h2 className="text-base font-medium capitalize ">
                  Hello 👋, {user?.userName || user?.firstName || "User"}
                </h2>
              </div>
              <Balance />
            </div>
            <MarketRate />
          </div>
          {!openKycModal && <OrdersChart />}
        </div>
      </MaxWidth>
    </>
  );
};
export default Dashboard;
