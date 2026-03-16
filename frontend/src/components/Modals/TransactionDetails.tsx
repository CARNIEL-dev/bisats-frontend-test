import ModalTemplate from "@/components/Modals/ModalTemplate";
import Divider from "@/components/shared/Divider";
import { Button } from "@/components/ui/Button";
import { ITransaction } from "@/pages/wallet/Transaction";
import { cn, formatter, splitTextInMiddle } from "@/utils";
import { CheckCircle } from "lucide-react";
import CopyButton from "@/components/shared/CopyButton";
import TextBox from "@/components/shared/TextBox";

interface Props {
  close: () => void;
  details?: ITransaction;
}
const TransactionDetails: React.FC<Props> = ({ close, details }) => {
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
        <p className="text-muted-foreground text-xs 2xl:text-base">
          Here is the details of your transacion
        </p>

        <div>
          <div
            className={cn(
              "bg-red-100 rounded-2xl p-2 md:p-4 mt-4 space-y-1",
              isSucessful
                ? "bg-green-100  text-green-700 dark:bg-green-800/10"
                : "text-red-700 bg-red-100 dark:bg-red-900/10",
            )}
          >
            <p
              className={cn("font-semibold capitalize flex items-center gap-2")}
            >
              {details?.Status}
              {isSucessful && <CheckCircle size={16} />}
            </p>

            {!isXNGN && details?.txHash && (
              <TextBox
                label="Transaction Hash"
                value={
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground font-medium text-xs sm:text-sm capitalize break-all text-right">
                      {splitTextInMiddle({
                        str: details?.txHash || "",
                        visibleChars: 8,
                      })}
                    </p>
                    <CopyButton
                      text={details?.txHash || ""}
                      title="Copy hash"
                      type="code"
                    />
                  </div>
                }
              />
            )}
          </div>
        </div>

        <div className="border border-border bg-muted rounded-2xl p-2 md:p-4 mt-4 space-y-2">
          <TextBox
            labelClass="text-muted-foreground"
            label="Asset"
            value={details?.Asset}
          />
          <TextBox
            labelClass="text-muted-foreground"
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
          <TextBox
            labelClass="text-muted-foreground"
            label="Network"
            value={details?.Asset === "xNGN" ? "Bank" : details?.Network || ""}
          />

          {isXNGN && (
            <>
              <Divider text="Bank details" textClassName="bg-muted" />
              <TextBox
                labelClass="text-muted-foreground"
                label="Account Name"
                value={details?.bankDetails?.accountName}
              />
              <TextBox
                labelClass="text-muted-foreground"
                label="Account Number"
                value={details?.bankDetails?.accountNumber}
              />
              <TextBox
                labelClass="text-muted-foreground"
                label="Bank Name"
                value={details?.bankDetails?.bankName}
              />
            </>
          )}
          <Divider text="" />
          <TextBox
            labelClass="text-muted-foreground"
            label="Date"
            value={details?.Date}
          />
          <TextBox
            labelClass="text-muted-foreground"
            label="Reference"
            value={details?.Reference}
          />
        </div>

        <div className="flex items-center gap-2 mt-4 justify-end ">
          <CopyButton
            text={details?.Reference || ""}
            title="Copy reference"
            type="Reference"
            showText
            variant="default"
          />
          <Button variant={"secondary"} onClick={close} className="text-sm">
            Close
          </Button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default TransactionDetails;
