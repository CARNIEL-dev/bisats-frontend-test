import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({
  message,
  showIcon = true,
}: {
  message: string;
  showIcon?: boolean;
}) => {
  return (
    <div className="flex items-center justify-center text-red-500 gap-2">
      {showIcon && <AlertCircle />}
      <p className="capitalize">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
