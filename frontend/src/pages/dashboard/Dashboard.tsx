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
          className=""
          onClick={() => {
            const val = decryptDataInfo({
              data: "eyJwYXlsb2FkIjoiSmVPWUNzbkFUNStOeUd1RmlzeXY4ZnNKMGVKd0V0NXpRRWFLcUJFcTE0Q1liY0FGOUkzTFBsUGpiUHFjNjJWWWhySmxXNFN4VnE5NTNNZGV4YTU5K25saEpZNmlYUjJoRSt3RlJnU1dIRm03bFpkWUJ5b1hNbCt1ZklsZmI4V2Y2ajhiZm03WllqWkNxQU1NcUdSOXNOZUxZK0Z4NVlHYkFLV29qandGUWFXVmRFRzJpdEpYRTlUZ01jdHRDWE5VOFpSdS9FQVlNcVpXOEs1NEtXSTB6UG1VbGRiSzFTMG1DTXdlOWtveHpXeVlkZVpSVEFOZjN3MVJMU3R5NnhydnRSZDZvNHZHZXV6OHFKNmtQQzF0TmdhK1M0S1BUMTJHbWIrdnpsRzVqOTUyTzFYc0NRVk1uS3dNNm0rWHhCR2NiaFlaWWxmKzRDQWlIYkdDRE5rdHNVVWFGSE56RzVRRkY5WklBekl2REM3dE5BbUtzWmtvMzBXWWozZ0REQkE4NVRYbHJWeG1aZVE5VTFoN2NoMjFrekx4THE1YWFvcUpQNEkva1VIcVRYMzhpWHkxM1k2Y1VBc09XRkVtQTIvRlFFOWkrdUlqRkVWN3lUOURsNUdhNmFwcHluaUQ4NDhHNUx2cHIzbXlkeWM9IiwiaXYiOiJiUE1ibDM0cFh6VXZuSHhkb2xBK2V3PT0iLCJ0aW1lc3RhbXAiOiIyMDI1LTEyLTAyVDE4OjUwOjQ0LjI2N1oifQ==",
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
