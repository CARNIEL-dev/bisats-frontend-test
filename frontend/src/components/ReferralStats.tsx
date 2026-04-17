import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { GET_REFERRAL_STATS } from "@/redux/actions/userActions";
import { cn, formatCompactNumber, formatEmail } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/Button";

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

const MAX_DISPLAY_USERS = 2;

const ReferralStats = ({ showLess }: { showLess?: boolean }) => {
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

  if (!hasReferralCode) return null;

  return (
    <div className="flex flex-col gap-5 p-6 pb-8 border border-border rounded-2xl relative overflow-hidden bg-secondary/50">
      <div className="flex items-center justify-between">
        <h3 className="md:text-lg font-semibold flex items-center gap-2">
          <div className="rounded-full w-fit p-2 bg-green-500/20">
            <Users className="size-5 text-green-600 dark:text-green-400" />
          </div>
          Referral Stats
        </h3>
        {!isFetching && data && (
          <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-full px-3 py-1">
            <span className="size-2 rounded-full bg-green-400 inline-block" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {formatCompactNumber(data.usageCount)} joined
            </span>
          </div>
        )}
      </div>

      {isFetching ? (
        <div className="h-16 flex items-center justify-center">
          <PreLoader primary={false} />
        </div>
      ) : isError ? (
        <div className="h-16 flex items-center justify-center">
          <ErrorDisplay
            showIcon={false}
            isError={true}
            message={error?.message || "Failed to load referral stats"}
          />
        </div>
      ) : data && data.referredUsers.length > 0 ? (
        <>
          <Separator />
          <ul className="flex flex-col gap-3">
            {data.referredUsers
              .slice(0, showLess ? MAX_DISPLAY_USERS : undefined)
              .map((referredUser) => {
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
                  <li key={referredUser.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        "bg-green-500/20 text-green-600 dark:text-green-400",
                      )}
                    >
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium  truncate">
                        {referredUser.firstName} {referredUser.lastName}
                        {!(referredUser.firstName || referredUser.lastName) &&
                          "Unverified"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {formatEmail({
                          email: referredUser.email,
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {joinedDate}
                    </span>
                  </li>
                );
              })}
          </ul>
          {showLess && data.referredUsers.length > MAX_DISPLAY_USERS && (
            <Link
              to={APP_ROUTES.REFERRAL}
              className={cn(
                buttonVariants({ variant: "link" }),
                " gap-1 text-sm w-fit",
              )}
            >
              See all {data.usageCount} referrals
              <ArrowRight className="size-4" />
            </Link>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">
          No referrals yet. Share your code to get started!
        </p>
      )}
    </div>
  );
};

export default ReferralStats;
