// KycRouteGuard.tsx

import { formatAccountLevel } from "@/utils";
import { KYC_LEVELS, KYC_RULES } from "@/utils/transaction_limits";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface KycRouteGuardProps {
  requiredAction: string;
  fallbackRedirect?: string;
  children: React.ReactNode;
}

const KycRouteGuard: React.FC<KycRouteGuardProps> = ({
  requiredAction,
  fallbackRedirect = "/",
  children,
}) => {
  const navigate = useNavigate();
  const user: UserState = useSelector((state: any) => state.user);

  const { level, isNA } = formatAccountLevel(user.user?.accountLevel);
  const userKycLevel = isNA ? KYC_LEVELS.NONE : (level ?? KYC_LEVELS.NONE);

  useEffect(() => {
    const rules = KYC_RULES[userKycLevel];

    if (
      userKycLevel === null ||
      !rules ||
      !rules.allowedActions.includes(requiredAction)
    ) {
      navigate(fallbackRedirect, { replace: true });
    }
  }, [userKycLevel, requiredAction, fallbackRedirect, navigate]);

  return <>{children}</>;
};

export default KycRouteGuard;
