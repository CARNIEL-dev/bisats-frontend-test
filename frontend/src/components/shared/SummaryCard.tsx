import { cn } from "@/utils";
import { AlertCircle, Loader2 } from "lucide-react";

// HDR: SUMMARY CARD
type SummaryTypeProps = {
  type: "fiat" | "crypto";
  dailyLimit: number | string;
  currency: string;
  fee: number | string;
  amount: number | string;
  total: number | string;
  loading?: boolean;
  error?: Error | null;
};

const SummaryCard = ({
  type,
  dailyLimit,
  currency,
  fee,
  amount,
  total,
  loading,
  error,
}: SummaryTypeProps) => {
  return (
    <div className="border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-4 px-5  my-5 text-sm flex flex-col gap-2 relative">
      <div className="flex justify-between items-center">
        <p className="text-[#424A59] font-normal">Daily remaining limit:</p>
        <p className="text-[#606C82]  font-semibold">
          {type === "fiat" && currency} {dailyLimit}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[#424A59] font-normal">
          {type === "fiat" ? "Transaction" : "Network"} fee:
        </p>
        <p className="text-[#606C82]  font-semibold">
          {fee} {currency}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[#424A59] font-normal">Withdrawal amount:</p>
        <p className="text-[#606C82]  font-semibold">
          {amount} {currency}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[#424A59] font-normal">Total:</p>
        <p className="text-[#606C82]  font-semibold">
          {total || "-"} {currency}
        </p>
      </div>
      <div
        className={cn(
          "absolute inset-0 bg-yellow-50/60 grid place-content-center border w-full h-full rounded-md  border-black/20",
          {
            hidden: !loading && !error,
            "bg-red-500/10 border-red-500": error,
          }
        )}
      >
        {loading && (
          <span className="flex items-center gap-2 animate-pulse">
            <Loader2 className="animate-spin size-4" />
            <span className="text-sm font-medium text-gray-600">
              Getting fee...
            </span>
          </span>
        )}
        {error && (
          <span className="text-sm font-medium text-red-600 flex items-center gap-2">
            <AlertCircle className="size-4" />
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
