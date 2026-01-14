import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import RefreshButton from "@/components/RefreshButton";
import AutoRefreshTimer from "@/components/shared/AutoRefresh";
import TokenSelection from "@/components/shared/TokenSelection";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DUMMY_HISTORY, TokenData } from "@/data";
import { assetIndexMap } from "@/pages/p2p/components/P2PMarket";
import Head from "@/pages/wallet/Head";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { ArrowRight, History, SmileIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ChangeEventHandler, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const isComingSoon = true;
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

  const formik = useFormik({
    initialValues: {
      amount: "",
      assetFrom: "xNGN",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  if (isComingSoon) {
    return (
      <div className="flex flex-col items-center gap-1 border rounded-lg px-4 py-6 shadow bg-background">
        <SmileIcon className="size-20 text-primary" />
        <p className="font-semibold text-lg mt-4">
          The swap feature is coming soon
        </p>
        <p className="text-sm text-gray-500">Please check back later</p>
      </div>
    );
  }

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
              <TooltipTrigger
                className="ml-auto flex items-center justify-center hover:bg-primary-light"
                onClick={handleSwapHistory}
              >
                <History className="!size-6 text-gray-500" strokeWidth={1.5} />

                <span className="sr-only">Swap history</span>
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
                value={formik.values.amount}
                error={undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
                  if (isValidDecimal) {
                    formik.setFieldValue("amount", value);
                  }
                }}
                onFocus={() => {}}
                children={
                  <TokenSelection
                    value={formik.values.assetFrom}
                    handleChange={(e) => {
                      formik.setFieldValue("assetFrom", e);
                      formik.setFieldValue("amount", "");
                    }}
                    error={undefined}
                    touched={undefined}
                    showBalance={false}
                    removeToken="USDT"
                  />
                }
              />

              <Badge variant={"success"}>
                Balance:{" "}
                {formatter({
                  decimal: formik.values?.assetFrom === "xNGN" ? 2 : 6,
                }).format(walletState?.wallet?.[formik.values.assetFrom])}{" "}
                {formik.values?.assetFrom}
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
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="mt-4">
              <SheetTitle className="text-2xl font-semibold">
                History
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500">
                View your past swap transactions
              </SheetDescription>
            </SheetHeader>
            {DUMMY_HISTORY.length > 0 && (
              <p className="text-gray-500 text-sm px-4 pb-4 border-b">
                Total: {DUMMY_HISTORY.length}
              </p>
            )}
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
  const [hide, setHide] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.98) {
      setHide(true);
    } else {
      setHide(false);
    }
  });

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col gap-8 px-6 h-[68dvh] overflow-auto no-scrollbar"
      >
        {history.length > 0 ? (
          history.map((item) => {
            return (
              <div key={item.id} className="border-b pb-3 flex flex-col gap-3">
                <div className="flex justify-between items-center gap-2">
                  {/* SUB: From */}
                  <div className="flex items-center gap-2">
                    <span>
                      {TokenData[assetIndexMap?.[item.from]].tokenLogo}
                    </span>
                    <p className="font-semibold tex-sm">
                      {formatter({
                        decimal: item.from === "xNGN" ? 2 : 6,
                      }).format(item.fromAmount)}{" "}
                      {item.from}
                    </p>
                  </div>

                  <ArrowRight className="text-gray-500" strokeWidth={1.5} />

                  {/* SUB: to */}
                  <div className="flex items-center gap-2">
                    <span>{TokenData[assetIndexMap?.[item.to]].tokenLogo}</span>
                    <p className="font-semibold tex-sm">
                      {formatter({ decimal: 2 }).format(item.toAmount)}{" "}
                      {item.to}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 ">
                    1 {item.from}  ≈ {" "}
                    {formatter({ decimal: 0 }).format(item.rate)} {item.to}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(item.timestamp).format("MMM D, YYYY - h:mm A")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-sm">No swap history</p>
        )}
      </div>
      {history.length > 6 && !hide && (
        <p className="text-xs text-center text-gray-500 animate-bounce">
          Scroll Down
        </p>
      )}
    </>
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
