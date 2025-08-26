import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import RefreshButton from "@/components/RefreshButton";
import AutoRefreshTimer from "@/components/shared/AutoRefresh";
import TokenSelection from "@/components/shared/TokenSelection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TokenData } from "@/data";
import { assetIndexMap } from "@/pages/p2p/components/P2PMarket";
import Head from "@/pages/wallet/Head";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { History, X } from "lucide-react";
import { ChangeEventHandler } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DUMMY_HISTORY = [
  {
    id: "nfieijoi4rdfhhefhnf",
    from: "USDT",
    to: "ETH",
    fromAmount: 1,
    toAmount: 195,
    rate: 195,
    timestamp: "2025-03-15T16:00:00Z",
  },
  {
    id: "nfieijoi4rhtfhnf",
    from: "USDT",
    to: "ETH",
    fromAmount: 0.5,
    toAmount: 2250,
    rate: 4500,
    timestamp: "2025-04-15T12:00:00Z",
  },
];

const SwapPage = () => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const {
    data: currencyRates,
    isFetching,
    isError,
    refetch,
  } = useCryptoRates({ isEnabled: true });
  const [searchParams, setSearchParams] = useSearchParams();

  const swapHistory = searchParams.get("history");
  const handleSwapHistory = () => {
    if (swapHistory) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("history");
        return params;
      });
    } else {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("history", "true");
        return params;
      });
    }
  };

  const handleRefresh = async () => {
    await refetch()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };
  return (
    <>
      <div className="grid  gap-6">
        <div className="flex flex-col gap-2 w-full ">
          <Head header="Swap" />
          <div className="text-gray-500 w-full text-sm flex items-center gap-1 font-normal">
            <p>1 USDT</p>  ≈ 
            <>
              {isError ? (
                <p className="text-red-500">Error</p>
              ) : (
                <p>
                  {formatNumber(Number(currencyRates?.tether?.ngn))}
                   xNGN
                </p>
              )}
            </>
            <AutoRefreshTimer defaultTime={120} />
            <RefreshButton
              isFetching={isFetching}
              refetch={handleRefresh}
              className="bg-transparent text-green-600"
              refreshTime={60 * 1000} // 1 minute
            />
            <Tooltip>
              <TooltipTrigger className="ml-auto">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="hover:bg-primary-light"
                  onClick={handleSwapHistory}
                >
                  <History
                    className="!size-6 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="sr-only">Swap history</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {swapHistory ? "Close swap history" : "View swap history"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* SUB:  SWAP FORM */}
          <div className="mt-6 flex flex-col gap-3">
            <div>
              <InputField
                label="Amount"
                id="amt"
                value={""}
                error={undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
                  if (isValidDecimal) {
                  }
                }}
                onFocus={() => {}}
                children={
                  <TokenSelection
                    value="xNGN"
                    handleChange={() => {}}
                    error={undefined}
                    touched={undefined}
                    showBalance={false}
                    removeToken="USDT"
                  />
                }
              />

              <Badge variant={"success"}>
                Balance:{" "}
                {formatter({ decimal: 2 }).format(walletState?.wallet?.xNGN)}{" "}
                xNGN
              </Badge>
            </div>

            <InputField
              label="You'll receive at least"
              id="otherAmount"
              tokenData={{
                logo: TokenData[assetIndexMap?.["USDT"]].tokenLogo,
                logoName: TokenData[assetIndexMap?.["USDT"]].tokenName,
              }}
              value={""}
              error={undefined}
              onChange={(e) => {
                const value = e.target.value;
                const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
                if (isValidDecimal) {
                  //   formik.setFieldValue("otherAmount", value);
                }
              }}
              onFocus={() => {}}
            />

            <PrimaryButton loading={false} text="Swap" className="-mt-6" />
          </div>
        </div>

        <Sheet open={Boolean(swapHistory)} onOpenChange={handleSwapHistory}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                History
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500">
                View your past swap transactions
              </SheetDescription>
            </SheetHeader>
            <SwapHistory history={DUMMY_HISTORY} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SwapPage;

// HDR: Swap History

type SwapHistoryProps = {
  history: {
    id: string;
    from: string;
    to: string;
    fromAmount: number;
    toAmount: number;
    rate: number;
    timestamp: string;
  }[];
};
const SwapHistory = ({ history }: SwapHistoryProps) => {
  return (
    <div className="flex flex-col gap-2 px-4">
      {history.map((h, i: number) => {
        return (
          <div key={i}>
            <p>
              {h.from} → {h.to}
            </p>
            <p>
              {h.fromAmount} → {h.toAmount}
            </p>
          </div>
        );
      })}
    </div>
  );
};

// HDR: Input field
type InputFieldProps = {
  label: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;

  maxFunc?: () => void;
  onFocus: () => void;
  value: string;
  error: string | boolean | undefined | null;
  tokenData?: {
    logo: JSX.Element;
    logoName: string;
  };
  children?: React.ReactNode;
};
const InputField = ({
  label,
  id,
  onChange,
  tokenData,
  maxFunc,
  value,
  onFocus,
  error,
  children,
}: InputFieldProps) => {
  return (
    <div className="relative h-32">
      <PrimaryInput
        className={"w-full h-[58px] no-spinner"}
        label={label}
        type="number"
        inputMode="decimal"
        error={error}
        id={id}
        touched={undefined}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        maxFnc={maxFunc ? maxFunc : undefined}
      />

      <div className="absolute right-1 top-1/2 -translate-y-[63%] ">
        {tokenData && (
          <button
            className={`text-gray-600 p-2.5 px-4  border cursor-default h-[48px] rounded-md items-center bg-neutral-100  flex justify-center gap-2 font-semibold text-sm `}
            type="button"
          >
            <span className="shrink-0">{tokenData.logo}</span>

            <div className="">{tokenData.logoName}</div>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
