/**
 * SwapPage
 *
 * Thin orchestration page — mounts the header/rate bar, swap form, and
 * history sheet. All sub-components and logic are in the /components and
 * /hooks directories.
 */

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
import { History } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SwapForm from "./components/SwapForm";
import SwapHistory from "./components/SwapHistory";

const SwapPage = () => {
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

  return (
    <>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2 w-full">
          {/* SUB: Header */}
          <Head header="Swap" />

          <div className="w-full flex items-center justify-end">
            <Tooltip>
              <TooltipTrigger
                className="flex items-center justify-center hover:bg-primary-light rounded-md p-1"
                onClick={handleSwapHistory}
              >
                <History className="!size-6 text-muted-foreground" strokeWidth={1.5} />
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
              <SheetDescription className="text-xs text-muted-foreground">
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
