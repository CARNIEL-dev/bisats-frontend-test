import { cn } from "@/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import TextBox from "./TextBox";

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
    <div className="border  border-border bg-secondary/60 rounded-md py-4 px-5  my-5 text-sm flex flex-col gap-2 relative">
      <TextBox
        label="Daily remaining limit"
        value={
          <span className="font-semibold">
            {type === "fiat" && currency} {dailyLimit}
          </span>
        }
      />
      <TextBox
        label={`${type === "fiat" ? "Transaction" : "Network"} fee`}
        value={
          <span className="font-semibold">
            {fee} {currency}
          </span>
        }
      />

      <TextBox
        label="Withdrawal amount"
        value={
          <span className="font-semibold">
            {amount} {currency}
          </span>
        }
      />

      <TextBox
        label="Total"
        value={
          <span className="font-semibold">
            {total || "-"} {currency}
          </span>
        }
      />

      <div
        className={cn(
          "absolute inset-0 bg-yellow-50/60 grid place-content-center border w-full h-full rounded-md  border-black/20",
          {
            hidden: !loading && !error,
            "bg-red-500/10 border-red-500": error,
          },
        )}
      >
        {loading && (
          <span className="flex items-center gap-2 animate-pulse">
            <Loader2 className="animate-spin size-4" />
            <span className="text-sm font-medium text-muted-foreground">
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
