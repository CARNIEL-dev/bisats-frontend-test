/**
 * SwapPage
 *
 * Thin orchestration page — mounts the header/rate bar, swap form, and
 * history sheet. All sub-components and logic are in the /components and
 * /hooks directories.
 */

import RefreshButton from "@/components/RefreshButton";
import AutoRefreshTimer from "@/components/shared/AutoRefresh";
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
import Head from "@/pages/wallet/Head";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { formatNumber } from "@/utils/numberFormat";
import { History } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SwapForm from "./components/SwapForm";
import SwapHistory from "./components/SwapHistory";

const SwapPage = () => {
  const {
    data: currencyRates,
    isFetching,
    isError,
    refetch,
  } = useCryptoRates({ isEnabled: true });

  const [searchParams, setSearchParams] = useSearchParams();
  const swapHistory = searchParams.get("history");

  const handleSwapHistory = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (swapHistory) {
        params.delete("history");
      } else {
        params.set("history", "true");
      }
      return params;
    });
  };

  const handleRefresh = async () => {
    await refetch().catch(() => {});
  };

  return (
    <>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2 w-full">
          {/* SUB: Header */}
          <Head header="Swap" />

          {/* SUB: Rate bar */}
          <div className="text-gray-500 w-full text-sm flex items-center gap-1 font-normal">
            <p>1 USDT</p>≈
            {isError ? (
              <p className="text-red-500">Error</p>
            ) : (
              <p>{formatNumber(Number(currencyRates?.tether?.ngn))} xNGN</p>
            )}
            <AutoRefreshTimer defaultTime={120} />
            <RefreshButton
              isFetching={isFetching}
              refetch={handleRefresh}
              className="bg-transparent text-green-600"
              refreshTime={60 * 1000}
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
                <p>{swapHistory ? "Close history" : "View history"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* SUB: Swap form */}
          <SwapForm />
        </div>

        {/* SUB: History sheet */}
        <Sheet open={Boolean(swapHistory)} onOpenChange={handleSwapHistory}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader className="mt-4">
              <SheetTitle className="text-2xl font-semibold">
                History
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500">
                View your past swap transactions
              </SheetDescription>
            </SheetHeader>
            <SwapHistory />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SwapPage;
