import ModalTemplate from "@/components/Modals/ModalTemplate";
import Divider from "@/components/shared/Divider";
import MaxWidth from "@/components/shared/MaxWith";
import TextBox from "@/components/shared/TextBox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatter } from "@/utils";
import { Check, Info, Verified } from "lucide-react";
import { useState } from "react";

type Props = {
  className?: string;
  userBalance: UserBalanceType;
  currency: "ngn" | "usd";
  wallet: TWallet | null;
};
const BalanceInfo = ({ className, currency, userBalance, wallet }: Props) => {
  const [open, setOpen] = useState(false);

  const symbol = currency !== undefined && currency === "ngn" ? "₦" : "$";

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setOpen(true)}
          className={cn(
            "hover:bg-primary/10 text-gray-500 hover:text-primary size-10 rounded-full ml-auto flex items-center justify-center",
            className
          )}
        >
          <Info className={"!size-5 "} strokeWidth={1.5} />
        </TooltipTrigger>
        <TooltipContent>
          <p>View your wallet balance</p>
        </TooltipContent>
      </Tooltip>

      <ModalTemplate
        primary={false}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <h3 className="font-semibold text-lg">Wallet Balance</h3>
        <div className="mt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "font-medium text-sm",
                  wallet?.activated ? "text-green-600" : "text-red-500"
                )}
              >
                {wallet?.activated
                  ? "Your wallet is activate"
                  : "Your wallet is not activate"}
              </h3>
              {wallet?.activated && (
                <Verified fill="#22c55e" stroke="white" className=" size-5" />
              )}
            </div>
            <div>
              <TextBox
                label="Total Balance"
                value={
                  <p>
                    {symbol}{" "}
                    <span className="font-bold text-2xl text-black">
                      {formatter({}).format(
                        (userBalance?.balanceTotal ?? 0) +
                          (userBalance?.lockedBalanceTotal ?? 0)
                      )}
                    </span>
                  </p>
                }
                labelClass="text-gray-900"
              />
              <InfoDisplay text="Total Amount in your Bisats account" />
            </div>
            <div>
              <TextBox
                label="Available Balance"
                value={
                  <p>
                    {symbol}{" "}
                    <span className="font-semibold text-lg text-gray-700">
                      {formatter({}).format(userBalance?.balanceTotal ?? 0)}
                    </span>
                  </p>
                }
                labelClass="text-gray-900"
              />

              <InfoDisplay text="Amount available for trading and withdrawal" />
            </div>
            <div>
              <TextBox
                labelClass="text-gray-900"
                label="Amount Locked in Escrow"
                value={
                  <p>
                    {symbol}{" "}
                    <span className="font-semibold text-lg text-gray-700">
                      {formatter({}).format(
                        userBalance?.lockedBalanceTotal ?? 0
                      )}
                    </span>
                  </p>
                }
              />

              <InfoDisplay text="Amount locked in your created ads" />
            </div>
            <Divider text="Limits" className="my-1" />
            <MaxWidth className="border space-y-2 bg-neutral-50  p-4 rounded-xl">
              <TextBox
                labelClass="text-sm"
                label="Buy"
                value={
                  <p className="text-sm text-gray-800">
                    <span className="text-gray-400 text-xs">xNGN</span>{" "}
                    {formatter({ decimal: 0 }).format(
                      wallet?.AdsLimit?.buy ?? 0
                    )}
                  </p>
                }
              />
              <TextBox
                labelClass="text-sm"
                label="Sell"
                value={
                  <p className="text-sm text-gray-800">
                    <span className="text-gray-400 text-xs">xNGN</span>{" "}
                    {formatter({ decimal: 0 }).format(
                      wallet?.AdsLimit?.sell ?? 0
                    )}
                  </p>
                }
              />
              <TextBox
                labelClass="text-sm"
                label="Daily Withdrawal (xNGN)"
                value={
                  <p className="text-sm text-gray-800">
                    <span className="text-gray-400 text-xs">xNGN</span>{" "}
                    {wallet?.NGNMaxDailyWithdrawalLimit?.toLowerCase() ===
                    "unlimited"
                      ? "Unlimited"
                      : formatter({ decimal: 0 }).format(
                          parseInt(wallet?.NGNMaxDailyWithdrawalLimit || "0")
                        )}
                  </p>
                }
              />
              <TextBox
                labelClass="text-sm"
                label="Daily Withdrawal (USD)"
                value={
                  <p className="text-sm text-gray-800">
                    $
                    {formatter({ decimal: 0 }).format(
                      parseInt(wallet?.USDMaxDailyWithdrawalLimit || "0")
                    )}
                  </p>
                }
              />
            </MaxWidth>
          </div>
          {/* SUB: Info */}
          <Divider text="Info" />
          <MaxWidth className="border space-y-2 bg-neutral-50  p-4 rounded-xl">
            <TextBox
              labelClass="text-sm"
              label="Wallet pin"
              value={
                <p
                  className={cn(
                    wallet?.pinSet && "text-green-500",
                    "flex items-center gap-1 text-sm"
                  )}
                >
                  {wallet?.pinSet ? "Enabled" : "Not set"}
                  {wallet?.pinSet && <Check className="size-4" />}
                </p>
              }
            />
            <TextBox
              labelClass="text-sm"
              label="Wallet status"
              value={
                <p
                  className={cn(
                    "px-3 py-1 text-xs rounded-full bg-gray-200",
                    wallet?.onHold && "text-red-500 bg-red-50 "
                  )}
                >
                  {wallet?.onHold ? "On Hold" : "Not on hold"}
                </p>
              }
            />
          </MaxWidth>
        </div>
      </ModalTemplate>
    </>
  );
};

export default BalanceInfo;

const InfoDisplay = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <p className={cn("text-xs text-gray-400 md:-mt-1", className)}>{text}</p>
  );
};
