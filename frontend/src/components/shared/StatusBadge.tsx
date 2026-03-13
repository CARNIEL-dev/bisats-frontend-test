import { cn } from "@/utils";

export type StatusBadgeVariant = "primary" | "secondary" | "icon" | undefined;

const OK_STATUS = [
  "approved",
  "active",
  "completed",
  "paid",
  "verified",
  "done",
  "success",
  "successful",
];

const PENDING_STATUS = ["pending", "awaiting", "awaiting_payment", "on_hold"];
const StatusBadge = ({
  status,
  variant,
}: {
  status: string;
  variant?: StatusBadgeVariant;
}) => {
  const bgColor =
    variant === "secondary"
      ? "font-semibold "
      : OK_STATUS.includes(status)
        ? "bg-green-400/20 dark:bg-green-600/10"
        : PENDING_STATUS.includes(status)
          ? "bg-yellow-300/20 dark:bg-yellow-300/10"
          : "bg-destructive/10";

  const textColor = OK_STATUS.includes(status)
    ? "text-green-600 dark:text-green-400"
    : PENDING_STATUS.includes(status)
      ? "text-yellow-700 dark:text-yellow-400"
      : "text-destructive";

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full font-medium w-fit flex items-center gap-1.5 text-xs",
        bgColor,
        textColor,
        variant === "icon" && "p-1",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full inline-block",
          OK_STATUS.includes(status)
            ? "bg-green-500 "
            : PENDING_STATUS.includes(status)
              ? "bg-yellow-500"
              : "bg-destructive",
        )}
      />
      <p className={cn("capitalize", variant === "icon" && "hidden")}>
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;
