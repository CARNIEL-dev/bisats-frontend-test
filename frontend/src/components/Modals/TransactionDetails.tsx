import ModalTemplate from "@/components/Modals/ModalTemplate";
import Divider from "@/components/shared/Divider";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { ITransaction } from "@/pages/wallet/Transaction";
import { handleCopy } from "@/redux/actions/generalActions";
import { cn, formatter } from "@/utils";
import { Check, CheckCircle, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  close: () => void;
  details?: ITransaction;
}
const TransactionDetails: React.FC<Props> = ({ close, details }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClip = async (prop: string) => {
    const result = await handleCopy(prop);
    if (result.status) {
      setCopied(true);
    } else {
      Toast.error(result.message, "");
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied]);

  const isXNGN = details?.Asset === "xNGN";
  const isSucessful = [
    "success",
    "completed",
    "paid",
    "approved",
    "successful",
    "confirmed",
  ].includes(details?.Status!);

  return (
    <ModalTemplate onClose={close} className="md:!max-w-[45rem]">
      <div className="">
        <p
          className={` ${
            details?.Type === "top_up" ? "text-green-600" : "text-red-600"
          }  text-lg md:text-xl 2xl:text-3xl font-semibold`}
        >
          {details?.Type === "top_up" ? "Deposit" : "Withdrawal"}
        </p>
        <p className="text-gray-600 text-xs 2xl:text-base">
          Here is the details of your transacion
        </p>

        <div>
          <div
            className={cn(
              "bg-red-100 rounded-2xl p-2 md:p-4 mt-4 space-y-1",
              isSucessful
                ? "bg-green-100  text-green-700"
                : "text-red-700 bg-red-100"
            )}
          >
            <p
              className={cn("font-semibold capitalize flex items-center gap-2")}
            >
              {details?.Status}
              {isSucessful && <CheckCircle size={16} />}
            </p>

            {!isXNGN && (
              <TextBetweenDisplay
                label="Transaction Hash"
                value={details?.txHash}
              />
            )}
          </div>
        </div>

        <div className="border bg-gray-100 rounded-2xl p-2 md:p-4 mt-4 space-y-2">
          <TextBetweenDisplay label="Asset" value={details?.Asset} />
          <TextBetweenDisplay
            label="Amount"
            value={formatter({
              decimal:
                details?.Asset === "xNGN"
                  ? 0
                  : details?.Asset === "USDT"
                  ? 2
                  : 6,
            }).format(details?.Amount || 0)}
          />
          <TextBetweenDisplay
            label="Network"
            value={details?.Asset === "xNGN" ? "Bank" : details?.Network || ""}
          />
          <TextBetweenDisplay label="Reference" value={details?.Reference} />
          {isXNGN && (
            <>
              <Divider text="Bank details" textClassName="bg-gray-100" />
              <TextBetweenDisplay
                label="Account Name"
                value={details?.bankDetails?.accountName}
              />
              <TextBetweenDisplay
                label="Account Number"
                value={details?.bankDetails?.accountNumber}
              />
              <TextBetweenDisplay
                label="Bank Name"
                value={details?.bankDetails?.bankName}
              />
            </>
          )}
          <Divider text="" />
          <TextBetweenDisplay label="Date" value={details?.Date} />
          <TextBetweenDisplay label="Reference" value={details?.Reference} />
        </div>

        <div className="flex items-center gap-2 mt-4 justify-end ">
          <Button
            onClick={() => handleCopyToClip(details?.Reference || "")}
            className="text-sm"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"} Reference
          </Button>
          <Button variant={"secondary"} onClick={close} className="text-sm">
            Close
          </Button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default TransactionDetails;

const TextBetweenDisplay = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  return (
    <div className="flex justify-between items-center text-sm w-full ">
      <p className="text-gray-500 font-normal">{label}:</p>
      <p className="text-gray-600 font-medium text-xs sm:text-sm capitalize break-all text-right">
        {value}
      </p>
    </div>
  );
};
