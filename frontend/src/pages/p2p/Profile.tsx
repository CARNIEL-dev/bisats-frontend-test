import ReferralSystem from "@/components/ReferralSystem";
import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import SEO from "@/components/shared/SEO";
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PreLoader from "@/layouts/PreLoader";
import {
  GET_ACTIVITY_SUMMARY,
  GetUserDetails,
} from "@/redux/actions/userActions";

import {
  cn,
  formatAccountLevel,
  formatCompactNumber,
  formatter,
  getUpgradeButtonState,
} from "@/utils";
import { goToNextKycRoute } from "@/utils/kycNavigation";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  Check,
  Info,
  User2,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

type TActivitySummary = {
  currentActiveAds: number;
  totalAdsCreated: number;
  totalAdsCreatedIn30d: number;
  totalOrderCompleted: number;
  totalOrderCompletedIn30d: number;
  totalOrderVolume: number;
  totalOrderVolumeIn30d: number;
};

// pull this out of the component if you want to reuse it

const getKycStatus = (userState: UserState) => {
  const { level } = formatAccountLevel(userState?.user?.accountLevel);
  const kycStatus = [
    {
      type: "Email",
      verified: userState?.user?.emailVerified,
    },
    {
      type: "Phone no",
      verified: userState?.user?.phoneNumber,
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
      type: "Merchant",
      verified:
        (userState?.user?.hasAppliedToBecomeAMerchant || (level || 0) > 2) &&
        (level || 0) >= 2,
    },
    {
      type: "Super Merchant",
      verified: level === 3,
    },
  ];
  return kycStatus;
};

const Profile = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const account_level = user?.accountLevel;

  const limits = bisats_limit[account_level as AccountLevel] || null;
  const userLimits = limits
    ? [
        {
          limit: "Daily Fiat Withdrawal Limit",
          amount: `${
            formatCompactNumber(limits?.daily_withdrawal_limit_fiat).endsWith(
              "T",
            )
              ? "Unlimited"
              : formatCompactNumber(limits?.daily_withdrawal_limit_fiat)
          } NGN`,
        },
        {
          limit: "Daily Crypto Withdrawal Limit",
          amount: `${formatCompactNumber(
            limits?.daily_withdrawal_limit_crypto,
          )} USD`,
        },
        {
          limit: "Sell Ad Limit",
          amount: `${formatCompactNumber(
            limits.maximum_ad_creation_amount,
          )} NGN`,
        },
        {
          limit: "Buy Ad limit",
          amount: `${formatCompactNumber(
            limits.maximum_ad_creation_amount,
          )} NGN`,
        },
      ]
    : [];

  //SUB: Query function
  const {
    data: activitySummary,
    isFetching,
    isError,

    error,
  } = useQuery<TActivitySummary, Error, TActivitySummary, [string, string]>({
    queryKey: ["activitySummary", user?.userId],
    queryFn: GET_ACTIVITY_SUMMARY,
    refetchOnMount: false,
    enabled: Boolean(user?.userId),
  });

  const ActivitySummary = useMemo(() => {
    return [
      {
        type: "Volume Traded (30d)",
        value: `${formatter({ decimal: 2 }).format(
          activitySummary?.totalOrderVolumeIn30d ?? 0,
        )} xNGN`,
        isColoured: true,
      },
      {
        type: "Ads Created (30d) ",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.totalAdsCreatedIn30d ?? 0,
        )} `,
      },
      {
        type: "Completed Orders (30d)",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.totalOrderCompletedIn30d ?? 0,
        )} `,
      },

      {
        type: "Current Running Ads",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.currentActiveAds ?? 0,
        )} `,
      },
      {
        type: "Total Volume Traded",
        value: `${formatter({ decimal: 2 }).format(
          activitySummary?.totalOrderVolume ?? 0,
        )} xNGN`,
        isColoured: true,
      },
      {
        type: "Total Ads Created",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.totalAdsCreated ?? 0,
        )} `,
      },
      {
        type: "Total Completed Orders",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.totalOrderCompleted ?? 0,
        )} `,
      },
      {
        type: "Total Ads Created",
        value: `${formatter({ decimal: 0 }).format(
          activitySummary?.totalAdsCreated ?? 0,
        )} `,
      },
    ];
  }, [activitySummary]);

  const clickHandler = () => {
    goToNextKycRoute(userState);
  };

  const { disabled, label } = useMemo(
    () => getUpgradeButtonState(user!, limits),
    [user, limits],
  );

  useEffect(() => {
    const isPending = label.startsWith("Pending");

    if (isPending) {
      GetUserDetails({
        userId: user?.userId,
        token: user?.token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { display, isNA, level } = formatAccountLevel(user?.accountLevel);

  return (
    <>
      <MaxWidth
        className="flex flex-col gap-4 min-h-[80dvh] max-w-6xl mt-6 mb-20"
        as="section"
      >
        <BackButton />
        <Card className="bg-[#f9f9f9]  gap-3 items-center md:items-start px-6">
          <h3 className="text-[28px] md:text-[34px] leading-[40px] font-semibold text-[#0A0E12] flex items-center gap-2">
            {user?.userName || "Hello, User"}
            {level === 3 ? (
              // <Medal fill="#FFD700" />
              <BadgeCheck fill="#F5BB00" stroke="#fff" size={30} />
            ) : (
              <BadgeCheck fill="#22C55D" stroke="#fff" />
            )}
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="uppercase font-semibold text-foreground bg-primary/20 px-4 py-0.5">
              {isNA ? "Unverified" : `Verified ${display}`}
            </Badge>

            <StatusBadge status={user?.accountStatus} />
          </div>
        </Card>
        <Card className="bg-primary/10 border-primary/20 md:flex-row   gap-3 items-center md:items-start px-6 justify-between">
          <div className=" flex flex-col gap-0.5 items-center md:items-start">
            <h3 className="text-base md:text-lg  font-semibold text-gray-800 flex items-center gap-2 w-fit">
              <span className=" ">Account Tier:</span>
              <span className="">{display}</span>
            </h3>
            {label.includes("Pending") && (
              <p className="text-sm text-gray-500">
                Your account is pending verification
              </p>
            )}
          </div>
          {(isNA || level !== 3) && (
            <Button
              type="submit"
              className={` px-4 rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-sm font-semibold text-center `}
              onClick={clickHandler}
              disabled={disabled}
            >
              {label}
            </Button>
          )}
        </Card>

        <Card className="bg-[#f9f9f9]  gap-8   px-6 ">
          <div className="grid  md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid-cols-2 gap-4">
            <div className="flex items-center gap-2 col-span-full mb-3">
              <User2 className="text-primary size-6" />
              <h4 className="font-semibold text-base">Personal Information</h4>
            </div>
            {getKycStatus(userState)?.map((item, idx) => (
              <div className="space-y-2" key={idx}>
                <p className="text-sm font-medium text-[#606C82]">
                  {item.type}
                </p>

                {item.verified ? (
                  <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="size-4" strokeWidth={3} />
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">No</span>
                )}
              </div>
            ))}
          </div>
          <Separator />

          <div className="grid  grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            <div className="flex items-center gap-2 col-span-full mb-3">
              <User2 className="text-primary size-6" />
              <h4 className="font-semibold text-base">Limits</h4>
            </div>

            {userLimits.length > 0 ? (
              userLimits?.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs font-normal text-[#707D96]">
                    {item.limit}
                  </p>
                  <p className="text-sm  font-semibold text-[#515B6E]">
                    {item.amount}
                  </p>
                </div>
              ))
            ) : (
              <div className="my-3 flex items-center gap-1 text-gray-600 border border-[#F3F4F6] rounded-[8px] py-2 px-3 bg-priYellow/10">
                <Info className="size-5" />
                <p className="text-sm text-center ">
                  Verify your account to get your limits
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* SUB: Activity section */}
        <section className="grid md:grid-cols-3 gap-4 mt-4 items-start">
          <div className="md:col-span-2 space-y-4">
            <h1 className="flex items-center gap-2 ">
              <ChartNoAxesCombined className="text-primary" />
              <span className="font-semibold text-2xl">Activity Summary</span>
            </h1>
            <div>
              {isFetching ? (
                <div className="h-[8rem] flex items-center justify-center">
                  <PreLoader primary={false} />
                </div>
              ) : isError ? (
                <div className="h-[8rem] text-sm flex items-center justify-center">
                  <ErrorDisplay
                    showIcon={false}
                    isError={false}
                    message={error?.message || "Failed to get summary"}
                  />
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    {ActivitySummary?.map((item, idx) => (
                      <Card key={idx} className="px-4 gap-2 bg-[#f9f9f9]">
                        <p className="text-[12px]  leading-[16px] font-normal text-[#707D96]">
                          {" "}
                          {item.type}
                        </p>
                        <h5
                          className={cn(
                            "text-xl font-semibold text-[#515B6E]",
                            item?.isColoured && "text-primary",
                          )}
                        >
                          {item.value}
                        </h5>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <ReferralSystem />
        </section>
      </MaxWidth>

      <SEO title="Profile" />
    </>
  );
};

export default Profile;
