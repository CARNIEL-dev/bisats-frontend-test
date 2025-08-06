import MaxWidth from "@/components/shared/MaxWith";
import { APP_ROUTES } from "@/constants/app_route";
import { GET_ACTIVITY_SUMMARY } from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";
import { formatNumber } from "@/utils/numberFormat";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import BackButton from "@/components/shared/BackButton";

type TActivitySummary = {
  currentActiveAds: number;
  totalAdsCreated: number;
  totalAdsCreatedIn30d: number;
  totalOrderCompleted: number;
  totalOrderCompletedIn30d: number;
  totalOrderVolume: number;
  totalOrderVolumeIn30d: number;
};

const Profile = () => {
  const [activitySummary, setActivitySummary] = useState<TActivitySummary>();
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const account_level = user?.accountLevel ?? "level_1";
  const navigate = useNavigate();

  const limits = bisats_limit[account_level as AccountLevel];
  const kycStatus = [
    {
      type: "Email",
      verified: user?.emailVerified,
    },
    {
      type: "Phone no",
      verified: user?.phoneNumberVerified,
    },
    {
      type: "Govt ID",
      verified: userState?.kyc?.identificationVerified,
    },
    {
      type: "BVN",
      verified: userState?.kyc?.bvnVerified,
    },
    {
      type: "Proof of Address",
      verified: userState?.kyc?.utilityBillVerified,
    },
    {
      type: "Source of wealth",
      verified: userState?.kyc?.sourceOfWealthVerified,
    },
    {
      type: "Proof of Profile",
      verified: userState?.kyc?.proofOfProfileVerified,
    },
  ];

  const Limits = [
    {
      limit: "Daily Fiat Withdrawal Limit",
      amount: `${
        limits?.daily_withdrawal_limit_fiat > 500000000
          ? "Unlimited"
          : limits?.daily_withdrawal_limit_fiat
      } NGN`,
    },
    {
      limit: "Daily Crypto Withdrawal Limit",
      amount: `${formatNumber(limits?.daily_withdrawal_limit_crypto)} USD`,
    },
    {
      limit: "Sell Ad Limit",
      amount: `${formatNumber(limits.maximum_ad_creation_amount)} NGN`,
    },
    {
      limit: "Buy Ad limit",
      amount: `${formatNumber(limits.maximum_ad_creation_amount)} NGN`,
    },
  ];

  const ActivitySummary = [
    {
      type: "Volume Traded (30d)",
      value: `${formatNumber(
        activitySummary?.totalOrderVolumeIn30d ?? 0
      )} xNGN`,
    },
    {
      type: "Ads Created (30d) ",
      value: `${formatNumber(activitySummary?.totalAdsCreatedIn30d ?? 0)} `,
    },
    {
      type: "Completed Orders (30d)",
      value: `${formatNumber(activitySummary?.totalOrderCompletedIn30d ?? 0)} `,
    },

    {
      type: "Current Running Ads",
      value: `${formatNumber(activitySummary?.currentActiveAds ?? 0)} `,
    },
    {
      type: "Total Volume Traded",
      value: `${formatNumber(activitySummary?.totalOrderVolume ?? 0)} xNGN`,
    },
    {
      type: "Total Ads Created",
      value: `${formatNumber(activitySummary?.totalAdsCreated ?? 0)} `,
    },
    {
      type: "Total Completed Orders",
      value: `${formatNumber(activitySummary?.totalOrderCompleted ?? 0)} `,
    },
    {
      type: "Total Ads Created",
      value: `${formatNumber(activitySummary?.totalAdsCreated ?? 0)} `,
    },
  ];

  useEffect(() => {
    const GetSummary = async () => {
      const summary = await GET_ACTIVITY_SUMMARY(user?.userId);
      console.log(summary);
      setActivitySummary(summary?.data);
    };
    GetSummary();
  }, [user?.userId]);

  const clickHandler = () => {
    if (!user?.accountLevel) {
      window.location.href = APP_ROUTES.KYC.PHONEVERIFICATION;
    } else if (user?.accountLevel === "level_1") {
      window.location.href = APP_ROUTES.KYC.BVNVERIFICATION;
    } else {
      window.location.href = APP_ROUTES.KYC.LEVEL3VERIFICATION;
    }
  };
  return (
    <>
      <MaxWidth
        className="flex flex-col gap-4 min-h-[80dvh] max-w-6xl mt-6"
        as="section"
      >
        <BackButton />
        <div className="flex items-center mx-3">
          <p className="text-[28px] md:text-[34px] leading-[40px] font-semibold text-[#0A0E12] mr-4">
            {user?.userName || "Hello, User"}
          </p>
          <BadgeCheck fill="#22C55D" stroke="#fff" />
        </div>

        <div
          className="border border-[#F3F4F6] p-3 lg:p-5 rounded-[12px] bg-linear-to-r from-[#FFFFFF] to-[#F6F7F8] w-full mx-3"
          style={{
            background:
              "linear-gradient(103.09deg, #FFFFFF 7.36 %, #F6F7F8 95.14 %)",
          }}
        >
          <div className="flex items-center text-[18px]  leading-[32px] font-semibold mb-3">
            <h1 className="text-[#515B6E] ">Account Tier:</h1>
            <h1 className="text-[#17A34A] mx-2">
              Level{" "}
              {!user?.accountLevel
                ? "N/A"
                : user?.accountLevel === "level_1"
                ? 1
                : user?.accountLevel === "level_2"
                ? 2
                : 3}
            </h1>
            {(!user?.accountLevel || user?.accountLevel !== "level_3") && (
              <button
                type="submit"
                className={`h-[24px]  px-3 rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-[12px] leading-[24px] font-semibold text-center  shadow-[0_0_0.8px_#000] `}
                onClick={clickHandler}
              >
                Upgrade
              </button>
            )}
          </div>

          <div className="flex flex-wrap  items-center">
            {kycStatus?.map((item, idx) => (
              <div className="flex  items-center mr-3 my-1" key={idx}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 0.125C4.03582 0.125 3.09329 0.410914 2.2916 0.946586C1.48991 1.48226 0.865067 2.24363 0.496089 3.13442C0.127112 4.02521 0.030571 5.00541 0.218674 5.95107C0.406777 6.89672 0.871076 7.76536 1.55286 8.44715C2.23464 9.12893 3.10328 9.59323 4.04894 9.78133C4.99459 9.96943 5.97479 9.87289 6.86558 9.50391C7.75637 9.13494 8.51775 8.51009 9.05342 7.7084C9.58909 6.90671 9.875 5.96418 9.875 5C9.87252 3.70783 9.35811 2.46929 8.44441 1.55559C7.53071 0.641888 6.29217 0.127478 5 0.125ZM7.32031 4.14688L4.57344 6.77188C4.50243 6.83868 4.40843 6.8756 4.31094 6.875C4.26329 6.87568 4.21597 6.86692 4.17172 6.84922C4.12747 6.83152 4.08716 6.80523 4.05313 6.77188L2.67969 5.45938C2.6416 5.42614 2.61061 5.38554 2.58861 5.34003C2.5666 5.29452 2.55403 5.24502 2.55164 5.19452C2.54925 5.14403 2.5571 5.09357 2.57471 5.04618C2.59232 4.99879 2.61933 4.95545 2.65411 4.91877C2.6889 4.88208 2.73074 4.85281 2.77713 4.83271C2.82352 4.81261 2.87349 4.8021 2.92404 4.80181C2.9746 4.80152 3.02469 4.81145 3.07131 4.83101C3.11792 4.85056 3.1601 4.87935 3.19531 4.91562L4.31094 5.97969L6.80469 3.60312C6.8776 3.53951 6.97229 3.50654 7.06894 3.51112C7.1656 3.51569 7.25675 3.55745 7.32333 3.62766C7.38991 3.69788 7.42678 3.79111 7.42621 3.88788C7.42565 3.98464 7.38771 4.07744 7.32031 4.14688Z"
                    fill={item.verified ? "#22C55D" : "#606C82"}
                  />
                </svg>
                <p className="text-[12px]  leading-[16px] font-normal text-[#606C82] ml-1">
                  {item.type}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between mt-5 ">
            {Limits?.map((item, idx) => (
              <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                <p className="text-[12px]  leading-[16px] font-normal text-[#707D96] mb-2">
                  {" "}
                  {item.limit}
                </p>
                <h1 className="text-[14px]  leading-[24px] font-semibold text-[#515B6E]">
                  {item.amount}
                </h1>
              </div>
            ))}
          </div>
        </div>

        <div
          className="border border-[#F3F4F6] rounded-[12px] p-3 lg:p-5 bg-linear-to-r from-[#FFFFFF] to-[#F6F7F8] w-full mx-3"
          style={{
            background:
              "linear-gradient(103.09deg, #FFFFFF 7.36 %, #F6F7F8 95.14 %)",
          }}
        >
          <div className="flex items-center text-[18px]  leading-[32px] font-semibold mb-3">
            <h1 className="text-[#515B6E] ">Activity Summary</h1>
          </div>

          <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
            {ActivitySummary.slice(0, 4)?.map((item, idx) => (
              <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                <p className="text-[12px]  leading-[16px] font-normal text-[#707D96] mb-2">
                  {" "}
                  {item.type}
                </p>
                <h1 className="text-[14px]  leading-[24px] font-semibold text-[#515B6E]">
                  {item.value}
                </h1>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between mt-0 lg:mt-5">
            {ActivitySummary.slice(4)?.map((item, idx) => (
              <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                <p className="text-[12px]  leading-[16px] font-normal text-[#707D96] mb-2">
                  {" "}
                  {item.type}
                </p>
                <h1 className="text-[14px]  leading-[24px] font-semibold text-[#515B6E]">
                  {item.value}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </MaxWidth>
    </>
  );
};

export default Profile;
