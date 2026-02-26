import useUserStatus from "@/hooks/use-user-status";

interface SuspensionBannerProps {
  className?: string;
}

const SuspensionBanner = ({ className = "" }: SuspensionBannerProps) => {
  const { isSuspended, suspensionInfo } = useUserStatus();

  if (!isSuspended || !suspensionInfo) {
    return null;
  }

  return (
    <div
      className={`w-full flex items-start py-5 md:px-7 px-3 rounded-[12px] gap-3 bg-red-600/10 border border-red-600/20 ${className}`}
    >
      <div className="border shrink-0 rounded-full size-12 flex justify-center items-center bg-red-600/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <h4 className="text-red-600 text-base lg:text-[20px] font-semibold">
          Account Suspended
        </h4>
        <p className="text-gray-600 text-xs md:text-sm font-normal">
          {suspensionInfo.reason}
        </p>
        {suspensionInfo.duration && (
          <p className="text-gray-500 text-xs md:text-sm">
            Duration: {suspensionInfo.duration}
          </p>
        )}
        <p className="text-destructive text-xs md:text-sm border border-destructive w-fit px-2 py-1 rounded mt-2">
          Contact support for review
        </p>
      </div>
    </div>
  );
};

export default SuspensionBanner;
