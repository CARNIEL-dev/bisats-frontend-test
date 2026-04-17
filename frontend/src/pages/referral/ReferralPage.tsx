import BonusStatus from "@/components/BonusStatus";
import ReferralStats from "@/components/ReferralStats";
import ReferralSystem from "@/components/ReferralSystem";
import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import SEO from "@/components/shared/SEO";
import { useSelector } from "react-redux";

const ReferralPage = () => {
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  const hasReferralCode =
    !!user?.referralCode &&
    user.referralCode !== "null" &&
    user.referralCode !== "NULL";

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
