// HDR: SUMMARY CARD
type SummaryTypeProps = {
  type: "fiat" | "crypto";
  dailyLimit: number | string;
  currency: string;
  fee: number | string;
  amount: number | string;
  total: number | string;
};

const SummaryCard = ({
  type,
  dailyLimit,
  currency,
  fee,
  amount,
  total,
}: SummaryTypeProps) => {
  return (
    <div className="border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-4 px-5  my-5 text-sm space-y-2 ">
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
    </div>
  );
};

export default SummaryCard;
