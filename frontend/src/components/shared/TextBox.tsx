import { cn } from "@/utils";
import { ReactNode } from "react";

const TextBox = ({
  label,
  value,
  labelClass,
  showIndicator = true,
}: {
  label: string;
  value: string | ReactNode;
  labelClass?: string;
  showIndicator?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center gap-x-3 gap-y-1 flex-wrap sm:flex-nowrap">
      <p className={cn("text-gray-600", labelClass)}>
        {label}
        {showIndicator && ":"}
      </p>
      <div className="text-gray-500">{value}</div>
    </div>
  );
};

export default TextBox;
