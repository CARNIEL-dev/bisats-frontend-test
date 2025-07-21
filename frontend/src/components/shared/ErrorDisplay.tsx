import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center text-red-500 gap-2">
      <AlertCircle />
      <p className="capitalize">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
