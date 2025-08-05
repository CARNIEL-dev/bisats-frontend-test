import { cn } from "@/utils";
import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({
  message,
  showIcon = true,
  isError = true,
}: {
  message: string;
  showIcon?: boolean;
  isError?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-gray-600 gap-2",
        isError && "text-red-500"
      )}
    >
      {showIcon && <AlertCircle />}
      <p className="capitalize">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
