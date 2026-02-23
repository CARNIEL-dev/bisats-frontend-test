/** @format */

import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";

/**
 * Decide the next KYC navigation route based on the current user state.
 *
 * Priority order (short-circuits as soon as one matches):
 * 1) Email verification (if not verified)
 * 2) Phone verification (if not verified)
 * 3) Personal information (if not verified)
 * 4) Identity (if not verified)
 * 5) BVN (only if level_1 and hasAppliedToBeInLevelOne and BVN not verified)
 * 6) Become Merchant (only if level_2, BVN verified and has not applied)
 * 7) Level 3 Verification (only if level_2, BVN verified and has applied)
 * 8) Fallback to dashboard
 */
export function getNextKycRoute(
  userState: UserState | null | undefined,
): string {
  const user = userState?.user ?? null;
  const kyc = (user as any)?.kyc ?? userState?.kyc ?? null;

  // 1) Email verification (auth flow)
  if (user && user.emailVerified === false) return APP_ROUTES.AUTH.VERIFY;

  // 2) Phone verification
  if (user && !Boolean(user.phoneNumber))
    return APP_ROUTES.KYC.PHONEVERIFICATION;

  // 3) Personal information
  if (!kyc?.personalInformationVerified) return APP_ROUTES.KYC.PERSONAL;

  // 4) Identity
  if (!kyc?.identificationVerified) return APP_ROUTES.KYC.IDENTITY;

  // 5) BVN: only when prior steps done, user has a level_1 and has applied to be in level one
  const accountLevel = user?.accountLevel ?? null;
  const isLevel1 = accountLevel === "level_1";
  const isLevel2 = accountLevel === "level_2";
  const isLevel3 = accountLevel === "level_3";
  const bvnOk = !!kyc?.bvnVerified;
  const hasAppliedToBeInLevelOne = !!user?.hasAppliedToBeInLevelOne;
  const hasAppliedToBecomeAMerchant = !!user?.hasAppliedToBecomeAMerchant;

  // SUB: LEVEL 1 CORE
  switch (isLevel1) {
    case true:
      // Can only has this set to true when this true to be in level 1
      if (!kyc?.identificationVerified) {
        return APP_ROUTES.KYC.IDENTITY;
      }
      // Can only has this set to true when this true to be in level 1
      if (!kyc?.personalInformationVerified) {
        return APP_ROUTES.KYC.PERSONAL;
      }
      // Only way to go level 2
      if (hasAppliedToBeInLevelOne && !bvnOk) {
        return APP_ROUTES.KYC.BVNVERIFICATION;
      }

      // Re apply for bvn.. because bvn is okay only for level 2
      // if (!hasAppliedToBeInLevelOne && bvnOk) {
      //   return APP_ROUTES.KYC.BVNVERIFICATION;
      // }

      // HDR: MERCHANT LOGIC

      //? The application is pending for merchant approval
      if (hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.DASHBOARD;
      }

      //? BVN needs to be verified before merchant approval
      if (hasAppliedToBecomeAMerchant && !bvnOk) {
        return APP_ROUTES.KYC.BVNVERIFICATION;
      }

      if (!hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.KYC.BECOME_MERCHANT;
      }

      if (!hasAppliedToBecomeAMerchant && !bvnOk) {
        return APP_ROUTES.KYC.BVNVERIFICATION;
      }

      break;
  }

  /*
  if hasApplti to merchant and bvn .. but levle 1 ... it is pending
  if not hasn applied .. still level 
  */

  // SUB: LEVEL 2 CORE
  switch (isLevel2) {
    //? MAIN CHECK == YOU Applied to become a merchant, bvn and level 2

    case true:
      // Can only has this set to true when this true to be in level 2
      if (!bvnOk) {
        return APP_ROUTES.KYC.BVNVERIFICATION;
      }
      // Only way to go level 3
      if (hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.KYC.LEVEL3VERIFICATION;
      }

      //INCASE: You were moved to level 2 without Apply to be a merchant.. before can be moved to level 3
      if (!hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.KYC.BECOME_MERCHANT;
      }
      break;
  }

  //SUB: LEVEL 3 CORE
  switch (isLevel3) {
    case true:
      // Can only has this set to true when this true to be in level 3
      if (!hasAppliedToBecomeAMerchant || !bvnOk) {
        return APP_ROUTES.KYC.BECOME_MERCHANT;
      }
      // Only way to go level 3
      if (hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.KYC.LEVEL3VERIFICATION;
      }
      // Can only be on level 3 when you have bvn
      if (hasAppliedToBecomeAMerchant && !bvnOk) {
        return APP_ROUTES.KYC.BVNVERIFICATION;
      }
      // Re apply for merchant.. before can be moved to level 3
      if (!hasAppliedToBecomeAMerchant && bvnOk) {
        return APP_ROUTES.KYC.BECOME_MERCHANT;
      }
      break;
  }

  // 8) Fallback
  return APP_ROUTES.DASHBOARD;
}

/**
 * Convenience helper to perform the navigation side-effect.
 */
export function goToNextKycRoute(userState: UserState | null | undefined) {
  const route = getNextKycRoute(userState);
  // console.log("Route", route);
  window.location.href = route;
}
