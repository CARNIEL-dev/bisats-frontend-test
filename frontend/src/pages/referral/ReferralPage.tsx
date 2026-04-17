import BonusStatus from "@/components/BonusStatus";
import ReferralStats from "@/components/ReferralStats";
import ReferralSystem from "@/components/ReferralSystem";
import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import SEO from "@/components/shared/SEO";
import { Separator } from "@/components/ui/separator";
import PreLoader from "@/layouts/PreLoader";
import { GET_REFERRAL_STATS } from "@/redux/actions/userActions";
import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useSelector } from "react-redux";

type TReferredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

type TReferralStats = {
  referralCode: string;
  usageCount: number;
  referredUsers: TReferredUser[];
};

const ReferralPage = () => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  const hasReferralCode =
    !!user?.referralCode &&
    user.referralCode !== "null" &&
    user.referralCode !== "NULL";

  const { data, isFetching, isError, error } = useQuery<TReferralStats>({
    queryKey: ["referralStats", user?.userId],
    queryFn: GET_REFERRAL_STATS,
    refetchOnMount: false,
    enabled: Boolean(user?.userId && hasReferralCode),
  });

  return (
    <>
      <SEO title="Referral" />
      <MaxWidth
        className="flex flex-col gap-6 min-h-[80dvh] max-w-6xl mt-6 mb-20"
        as="section"
      >
        <BackButton />

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Referral Programme
          </h1>
          <p className="text-sm text-muted-foreground">
            Invite friends, earn rewards, and track your bonuses all in one
            place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Left: Bonus status + stats */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <BonusStatus />

            {/* Full referred users list */}
            {/* {hasReferralCode && (
              <div className="flex flex-col gap-4 p-6 border border-border rounded-2xl bg-slate-800 dark:bg-secondary text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="rounded-full w-fit p-2 bg-green-500/20">
                      <Users className="size-5 text-green-400" />
                    </div>
                    Referred Users
                  </h3>
                  {!isFetching && data && (
                    <span className="text-sm font-semibold text-green-300 bg-green-500/15 border border-green-500/30 rounded-full px-3 py-1">
                      {data.usageCount} joined
                    </span>
                  )}
                </div>

                {isFetching ? (
                  <div className="h-20 flex items-center justify-center">
                    <PreLoader primary={false} />
                  </div>
                ) : isError ? (
                  <div className="h-20 flex items-center justify-center">
                    <ErrorDisplay
                      showIcon={false}
                      isError={true}
                      message={
                        error?.message || "Failed to load referral stats"
                      }
                    />
                  </div>
                ) : data && data.referredUsers.length > 0 ? (
                  <>
                    <Separator className="bg-white/10" />
                    <ul className="flex flex-col gap-3">
                      {data.referredUsers.map((referredUser, idx) => {
                        const initials =
                          `${referredUser?.firstName?.[0] ?? ""}${referredUser?.lastName?.[0] ?? ""}`.toUpperCase();
                        const joinedDate = new Date(
                          referredUser.createdAt,
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <li
                            key={referredUser.id}
                            className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                          >
                            <div
                              className={cn(
                                "size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                                "bg-green-500/20 text-green-300",
                              )}
                            >
                              {initials}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-semibold text-white">
                                {referredUser.firstName} {referredUser.lastName}
                              </span>
                              <span className="text-xs text-gray-400 truncate">
                                {referredUser.email}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                              <span className="text-xs text-gray-400">
                                Joined
                              </span>
                              <span className="text-xs text-gray-300 font-medium">
                                {joinedDate}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No referrals yet. Share your code to get started!
                  </p>
                )}
              </div>
            )} */}
            {hasReferralCode && <ReferralStats />}
          </div>

          <div>
            {/* Referral code/join card */}
            <ReferralSystem />
          </div>
        </div>
      </MaxWidth>
    </>
  );
};

export default ReferralPage;
