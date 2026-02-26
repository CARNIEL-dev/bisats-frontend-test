import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Hook to check if the user account is suspended
 * Returns suspension status and related information
 */
export const useUserStatus = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState?.user as Record<string, any> | null;

  const { isSuspended, suspensionInfo } = useMemo(() => {
    const accountStatus = user?.accountStatus?.toLowerCase() || "";

    // Check if account status indicates suspension
    // Common values: "suspended", "suspension", "locked", "deactivated"
    const suspendedStatuses = [
      "suspended",
      "suspension",
      "locked",
      "deactivated",
    ];
    const isAccountSuspended = suspendedStatuses.some((status) =>
      accountStatus.includes(status),
    );

    return {
      isSuspended: isAccountSuspended,
      suspensionInfo: isAccountSuspended
        ? {
            status: user?.accountStatus,
            reason:
              user?.suspensionReason ||
              user?.suspensionNote ||
              "Account has been suspended. Please contact support for more information.",
            suspendedAt: user?.suspendedAt || user?.suspensionDate || null,
            duration: user?.suspensionDuration || null,
          }
        : null,
    };
  }, [
    user?.accountStatus,
    user?.suspensionReason,
    user?.suspensionNote,
    user?.suspendedAt,
    user?.suspensionDate,
    user?.suspensionDuration,
  ]);

  return {
    isSuspended,
    suspensionInfo,
    accountStatus: user?.accountStatus,
  };
};

export default useUserStatus;
