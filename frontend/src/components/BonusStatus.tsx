import ErrorDisplay from "@/components/shared/ErrorDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { GET_BONUS_STATUS } from "@/redux/actions/userActions";
import { cn, formatter } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Gift, Sparkles, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/Button";

type TSignUpBonus = {
  amount: number;
  creditedAt: string | null;
  progressPercent: number;
  status: string;
  targetVolumeUSD: number;
  tradingVolumeUSD: number;
  type: string;
};

type TReferralBonus = {
  amount: number;
  creditedAt: string | null;
  status: string;
  targetVolumeUSD: number;
  type: string;
};

type TBonusStatus = {
  signupBonus: TSignUpBonus;
  referralBonuses: TReferralBonus[];
  totalBonusCreditedNGN: number;
};

const BonusStatus = ({ showView }: { showView?: boolean }) => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  const { data, isFetching, isError, error } = useQuery<TBonusStatus>({
    queryKey: ["bonusStatus", user?.userId],
    queryFn: GET_BONUS_STATUS,
    refetchOnMount: false,
    enabled: Boolean(user?.userId),
  });

  return (
    <div className="flex flex-col gap-5 p-6 pb-8 border border-border rounded-2xl bg-slate-800 dark:bg-secondary text-white relative overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="rounded-full w-fit p-2 bg-green-500/20">
            <Sparkles className="size-5 text-green-400" />
          </div>
          Referral Bonus Earnings
        </h3>
        {showView && (
          <Link
            to={APP_ROUTES.REFERRAL}
            className={cn(buttonVariants({ variant: "link", size: "sm" }))}
          >
            View Referrals
          </Link>
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
            message={error?.message || "Failed to load bonus status"}
          />
        </div>
      ) : data ? (
        <div className="flex flex-col gap-5">
          {/* Sign-up Bonus */}
          {data.signupBonus && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Gift className="size-4 text-green-400" />
                <span className="text-sm font-semibold text-gray-200">
                  Sign-up Bonus
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">
                  ₦{formatter({ decimal: 0 }).format(data.signupBonus.amount)}
                </span>
                <StatusBadge status={data.signupBonus.status} />
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-700"
                    style={{
                      width: `${Math.min(data.signupBonus.progressPercent, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="size-3" />$
                    {formatter({ decimal: 2 }).format(
                      data.signupBonus.tradingVolumeUSD,
                    )}{" "}
                    traded
                  </span>
                  <span>
                    target: $
                    {formatter({ decimal: 0 }).format(
                      data.signupBonus.targetVolumeUSD,
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Referral Bonuses */}
          {data.referralBonuses && data.referralBonuses.length > 0 && (
            <>
              <Separator className="bg-white/10" />
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-200">
                  Referral Bonuses
                </span>
                <ul className="flex flex-col gap-2">
                  {data.referralBonuses.map((bonus, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-white">
                          ₦{formatter({ decimal: 0 }).format(bonus.amount)}
                        </span>
                        <span className="text-xs text-gray-400">
                          Target: $
                          {formatter({ decimal: 0 }).format(
                            bonus.targetVolumeUSD,
                          )}
                        </span>
                      </div>
                      <StatusBadge status={bonus.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Total Credited */}
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Credited</span>
            <span className="text-base font-bold text-green-400">
              ₦{formatter({ decimal: 0 }).format(data.totalBonusCreditedNGN)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BonusStatus;
