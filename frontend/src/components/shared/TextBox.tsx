import { cn } from "@/utils";
import { ReactNode } from "react";

const TextBox = ({
  label,
  value,
  labelClass,
  showIndicator = true,
  direction = "row",
  containerClassName,
}: {
  label: string;
  value: string | ReactNode;
  labelClass?: string;
  showIndicator?: boolean;
  direction?: "row" | "column";
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-x-3 gap-y-1 flex-wrap sm:flex-nowrap",
        direction === "column" && "flex-col items-start justify-start",
        containerClassName,
      )}
    >
      <p className={cn("text-muted-foreground", labelClass)}>
        {label}
        {showIndicator && ":"}
      </p>
      <div className="text-foreground text-sm">{value}</div>
    </div>
  );
};

export default TextBox;
