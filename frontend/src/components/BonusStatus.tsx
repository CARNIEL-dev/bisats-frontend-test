import CircularProgress from "@/components/shared/CircularProgress";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { GET_BONUS_STATUS } from "@/redux/actions/userActions";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { cn, formatter } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Gift, Sparkles, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RefreshButton from "./RefreshButton";

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

// ─── Main component ───────────────────────────────────────────────────────────
const BonusStatus = ({ showView }: { showView?: boolean }) => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  const { data, isFetching, isError, error, refetch } = useQuery<TBonusStatus>({
    queryKey: ["bonusStatus", user?.userId],
    queryFn: GET_BONUS_STATUS,
    refetchOnMount: false,
    enabled: Boolean(user?.userId),
  });

  // Reuse cached rate — no extra network request if already fetched
  const { data: rates } = useCryptoRates({ isEnabled: Boolean(user?.userId) });
  const ngnPerUsd = rates?.tether?.ngn ?? 1;
  const toUsd = (ngn: number) => ngn / ngnPerUsd;

  // ── Loading / error states ──────────────────────────────────────────────────
  const loadingOrError = isFetching ? (
    <div className="h-full flex items-center justify-center">
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
  ) : null;

  //HDR: ── Compact / showView variant ─────────────────────────────────────────────
  if (showView) {
    const pendingReferralBonuses =
      data?.referralBonuses?.filter((b) => b.status !== "credited") ?? [];
    const creditedReferralBonuses =
      data?.referralBonuses?.filter((b) => b.status === "credited") ?? [];
    const totalPendingReferralNGN = pendingReferralBonuses.reduce(
      (sum, b) => sum + b.amount,
      0,
    );

    return (
      <div className="flex flex-col gap-3 p-4 sm:p-5 border border-border rounded-2xl   relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <div className="rounded-full w-fit p-1.5 bg-green-500/20">
              <Sparkles className="size-4 text-green-600 dark:text-green-400" />
            </div>
            Bonuses
          </h3>
          <Link
            to={APP_ROUTES.REFERRAL}
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              " p-0 h-auto",
            )}
          >
            View details →
          </Link>
        </div>

        {loadingOrError ??
          (data && (
            <div className="flex md:flex-row flex-col gap-2">
              {/* Sign-up Bonus */}
              {data.signupBonus && (
                <div className="flex items-center gap-2 bg-secondary rounded-xl p-4 basis-[40%] ">
                  <CircularProgress
                    percent={data.signupBonus.progressPercent}
                  />
                  <div className="flex flex-col  gap-1">
                    <span className="text-base sm:text-lg font-bold ">
                      ₦
                      {formatter({ decimal: 0 }).format(
                        data.signupBonus.amount,
                      )}
                    </span>
                    <StatusBadge status={data.signupBonus.status} />
                    <p className="hidden sm:block text-xs text-muted-foreground leading-tight mt-0.5">
                      Sign-up bonus
                    </p>
                  </div>
                </div>
              )}

              {/* Referral Bonuses summary */}
              <div className="flex flex-col justify-center gap-2 bg-secondary rounded-xl p-4 basis-[100%]">
                <span className="text-xs text-muted-foreground font-medium">
                  Referral Bonuses
                </span>
                <span className="text-base sm:text-lg font-bold ">
                  ₦{formatter({ decimal: 0 }).format(totalPendingReferralNGN)}
                </span>
                <div className="flex flex-col gap-1">
                  {pendingReferralBonuses.length > 0 && (
                    <StatusBadge status="pending" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {pendingReferralBonuses.length} pending
                    {creditedReferralBonuses.length > 0 &&
                      ` · ${creditedReferralBonuses.length} credited`}
                  </p>
                </div>
                <p className="hidden sm:block text-xs text-gray-500 leading-tight">
                  Unlocks per referee who completes their target trades
                </p>
              </div>
            </div>
          ))}

        {/* Total credited footer */}
        {data && (
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-xs text-muted-foreground">
              Total credited
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              ₦{formatter({ decimal: 0 }).format(data.totalBonusCreditedNGN)}
            </span>
          </div>
        )}
      </div>
    );
  }

  //HDR: ── Full / detailed variant (default) ──────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6 pb-8 border border-border rounded-2xl  relative overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <div className="rounded-full w-fit p-2 bg-green-500/20">
            <Sparkles className="size-5 text-green-600 dark:text-green-400" />
          </div>
          Referral Bonus Earnings
        </h3>
        {Boolean(data?.signupBonus || data?.referralBonuses?.length) && (
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        )}
      </div>

      {loadingOrError ??
        (data && (
          <div className="flex flex-col gap-5">
            {/*SUB: Sign-up Bonus */}
            {data.signupBonus && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Gift className="size-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold">Sign-up Bonus</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold ">
                    ₦{formatter({ decimal: 0 }).format(data.signupBonus.amount)}
                  </span>
                  <StatusBadge status={data.signupBonus.status} />
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground">
                  {data.signupBonus.creditedAt ? (
                    <>
                      Credited on{" "}
                      {new Date(data.signupBonus.creditedAt).toLocaleDateString(
                        undefined,
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </>
                  ) : (
                    <>
                      Bonus is credited once your total trading volume reaches{" "}
                      <span className=" font-medium">
                        $
                        {formatter({ decimal: 0 }).format(
                          data.signupBonus.targetVolumeUSD,
                        )}
                      </span>
                    </>
                  )}
                </p>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full  bg-green-500 transition-all duration-700"
                      style={{
                        width: `${Math.min(data.signupBonus.progressPercent, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      <span className="hidden sm:inline">
                        $
                        {formatter({ decimal: 2 }).format(
                          data.signupBonus.tradingVolumeUSD,
                        )}{" "}
                        traded
                      </span>
                      <span className="sm:hidden">
                        $
                        {formatter({ decimal: 0 }).format(
                          data.signupBonus.tradingVolumeUSD,
                        )}
                      </span>
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

            {/*SUB: Referral Bonuses */}
            {data.referralBonuses && data.referralBonuses.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold ">
                      Referral Bonuses
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Each bonus is paid out when your referee completes their
                      target trading volume
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2 max-h-[40dvh] overflow-y-auto">
                    {data.referralBonuses.map((bonus, idx) => {
                      const isCredited = bonus.status === "credited";
                      const bonusProgress = isCredited ? 100 : 0;
                      const usdEquiv = toUsd(bonus.amount);

                      return (
                        <li
                          key={idx}
                          className="flex flex-col gap-2 bg-secondary/50 rounded-xl px-3 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-semibold ">
                                ₦
                                {formatter({ decimal: 0 }).format(bonus.amount)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ≈ ${formatter({ decimal: 2 }).format(usdEquiv)}{" "}
                                · target: $
                                {formatter({ decimal: 0 }).format(
                                  bonus.targetVolumeUSD,
                                )}
                              </span>
                            </div>
                            <StatusBadge status={bonus.status} />
                          </div>

                          {/* Per-bonus progress bar */}
                          <div className="flex flex-col gap-1">
                            <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-700",
                                  isCredited
                                    ? "bg-green-500"
                                    : "bg-yellow-500/60",
                                )}
                                style={{ width: `${bonusProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              {isCredited
                                ? bonus.creditedAt
                                  ? `Credited ${new Date(bonus.creditedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`
                                  : "Credited"
                                : `Waiting for referee to reach $${formatter({ decimal: 0 }).format(bonus.targetVolumeUSD)} in trades`}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}

            {/* Total Credited */}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Credited
              </span>
              <span className="text-base font-bold text-green-600 dark:text-green-400">
                ₦{formatter({ decimal: 0 }).format(data.totalBonusCreditedNGN)}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BonusStatus;
