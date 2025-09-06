import { cn } from "@/utils";

const StatusBadge = ({
  status,
  variant,
}: {
  status: string;
  variant?: "primary" | "secondary";
}) => {
  const OK_STATUS = [
    "approved",
    "active",
    "completed",
    "paid",
    "verified",
    "done",
  ];

  const bgColor =
    variant === "secondary"
      ? "font-semibold "
      : OK_STATUS.includes(status)
      ? "bg-green-400/30"
      : status === "pending"
      ? "bg-yellow-400/30"
      : "bg-red-400/30";

  const textColor = OK_STATUS.includes(status)
    ? "text-green-700"
    : status === "pending"
    ? "text-yellow-700"
    : "text-red-700";

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full font-medium w-fit flex items-center gap-1.5 text-xs",
        bgColor,
        textColor
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full inline-block",
          OK_STATUS.includes(status)
            ? "bg-green-500 "
            : status === "pending"
            ? "bg-yellow-500"
            : "bg-red-500"
        )}
      />
      <p className="capitalize">{status}</p>
    </div>
  );
};

export default StatusBadge;
