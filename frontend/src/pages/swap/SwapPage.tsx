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
import Bisatsfetch from "@/redux/fetchWrapper";
// import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter, isProduction } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { BACKEND_URLS } from "@/utils/backendUrls";
import Toast from "@/components/Toast";
import { useQuery } from "@tanstack/react-query";
// import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { ArrowRight, History, SmileIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SwapPage = () => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const [quoteAmount, setQuoteAmount] = useState<string>("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { data: swapPairs } = useQuery<TradingPair[], Error>({
    queryKey: ["swapPairs"],
    queryFn: async () => {
      const response = await Bisatsfetch(`/api/v1/user/swap/get-pairs`, {
        method: "GET",
      });

      if (response.status === true) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch orders");
    },
    staleTime: 4 * 60 * 60 * 1000, // 4 hours
  });

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
      assetFrom: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const assetBalance = formik.values?.assetFrom
    ? walletState?.wallet?.[formik.values.assetFrom]
    : null;

  // SUB: Debounced getQuote API call
  const fetchQuote = async (assetFrom: string, amount: string) => {
    if (!assetFrom || !amount) {
      setQuoteAmount("");
      return;
    }

    setQuoteLoading(true);
    try {
      const response = await Bisatsfetch(BACKEND_URLS.SWAP.GET_QUOTE, {
        method: "POST",
        body: JSON.stringify({
          sourceId: assetFrom,
          targetId: "USDT",
          side: "SELL",
          amount: Number(amount),
        }),
      });

      if (response.status === true && response.data?.quote) {
        setQuoteAmount(response.data.quote);
      } else {
        setQuoteAmount("");
        Toast.error(response.message || "Failed to get quote", "Swap Quote");
      }
    } catch (error) {
      setQuoteAmount("");
      Toast.error("An error occurred while fetching the quote", "Swap Quote");
    } finally {
      setQuoteLoading(false);
    }
  };

  // SUB: Handle amount change with debounce
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);
    if (isValidDecimal) {
      formik.setFieldValue("amount", value);

      // Clear previous debounce timer
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new debounce timer - wait 500ms after user stops typing
      debounceRef.current = setTimeout(() => {
        fetchQuote(formik.values.assetFrom, value);
      }, 1000); // 1 second
    }
  };

  // SUB: Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // SUB: Getting if the assest is swapable
  useEffect(() => {
    if (formik.values.assetFrom && swapPairs) {
      const item = swapPairs.find(
        (item) => item.source.code === formik.values.assetFrom,
      )?.source.code;

      if (!item) {
        formik.setErrors({
          assetFrom: "Asset can not be swapped",
        });
      } else {
        formik.setErrors({
          assetFrom: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.assetFrom, swapPairs]);

  if (isProduction) {
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
                error={formik.errors.amount || formik.errors.assetFrom}
                onChange={handleAmountChange}
                onFocus={() => {}}
                children={
                  <TokenSelection
                    value={formik.values.assetFrom}
                    handleChange={(e) => {
                      formik.setFieldValue("assetFrom", e);
                      formik.setFieldValue("amount", "");
                      setQuoteAmount("");
                    }}
                    error={undefined}
                    touched={undefined}
                    showBalance={false}
                    removeToken="USDT"
                    removexNGN
                    variant="dialog"
                    placeholder="Select asset"
                  />
                }
              />
              {assetBalance !== null && (
                <Badge variant={"success"}>
                  Balance:{" "}
                  {formatter({
                    decimal: 6,
                  }).format(assetBalance)}{" "}
                  {formik.values?.assetFrom}
                </Badge>
              )}
            </div>

            <InputField
              label="You'll receive at least"
              id="otherAmount"
              tokenData={{
                logo: TokenData[assetIndexMap?.["USDT"]].tokenLogo,
                logoName: TokenData[assetIndexMap?.["USDT"]].tokenName,
              }}
              value={quoteLoading ? "Loading..." : quoteAmount}
              error={undefined}
              onChange={() => {}}
              disabled={true}
              loading={quoteLoading}
            />

            <PrimaryButton
              loading={false}
              text="Swap"
              className="-mt-6"
              disabled={quoteLoading}
            />
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
  onFocus?: () => void;
  value: string;
  error: string | boolean | undefined | null;
  tokenData?: {
    logo: JSX.Element;
    logoName: string;
  };
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
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
  disabled = false,
  loading = false,
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
        disabled={disabled}
        loading={loading}
        loadingLeft
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
