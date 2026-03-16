/**
 * SwapHistory
 *
 * Fetches swap history from GET /swap/history, groups debit+credit pairs
 * by their shared `reference`, and renders paginated swap cards.
 */

import CopyButton from "@/components/shared/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { TokenData } from "@/data";
import PreLoader from "@/layouts/PreLoader";
import { assetIndexMap } from "@/pages/p2p/components/P2PMarket";
import Bisatsfetch from "@/redux/fetchWrapper";
import { cn, formatter } from "@/utils";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface TransactionHistoryData {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  transactions: SwapHistoryTransaction[];
}

const SwapHistory = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery<
    TransactionHistoryData,
    Error
  >({
    queryKey: ["swapHistory", page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      const response = await Bisatsfetch(
        `${BACKEND_URLS.SWAP.HISTORY}?${params.toString()}`,
        { method: "GET" },
      );
      if (response.success === true || response.status === true) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch swap history");
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // SUB: Group by reference → single swap card (debit + optional credit)
  const groupedSwaps = useMemo<GroupedSwap[]>(() => {
    if (!data?.transactions) return [];
    const groups = new Map<string, SwapHistoryTransaction[]>();
    data.transactions.forEach((tx) => {
      groups.set(tx.reference, [...(groups.get(tx.reference) ?? []), tx]);
    });

    return Array.from(groups.entries()).map(([reference, txs]) => {
      const debit = txs.find((t) => t.type === "swap_debit") ?? txs[0];
      const credit = txs.find((t) => t.type === "swap_credit");
      return {
        reference,
        debit,
        credit,
        status: credit ? "success" : debit.status,
        createdAt: debit.createdAt,
      } satisfies GroupedSwap;
    });
  }, [data?.transactions]);

  const totalPages = data?.pagination?.totalPages ?? 1;

  const formatAmt = (amount: number, asset: string) =>
    formatter({
      decimal: asset === "xNGN" || asset === "USDT" ? 2 : 6,
    }).format(amount);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="h-[40dvh] grid place-content-center">
        <PreLoader primary={false} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive text-sm py-8">
        Failed to load swap history
      </p>
    );
  }

  return (
    <Card className="relative px-6">
      {data?.pagination && (
        <p className="text-muted-foreground text-sm pb-4 border-b border-input">
          Total: {groupedSwaps.length}
        </p>
      )}

      <div className="flex flex-col gap-4 px-4">
        {groupedSwaps.length > 0 ? (
          groupedSwaps.map((swap) => (
            <div
              key={swap.reference}
              className="border-b pb-3 flex flex-col gap-2 text-left w-full border-border last:border-0 last:pb-0"
            >
              {/* SUB: Token pair row */}
              <div className="flex justify-between items-center gap-2">
                {/* Debit (sold) */}
                <div className="flex items-center gap-2">
                  {assetIndexMap?.[swap.debit.asset] !== undefined && (
                    <span>
                      {TokenData[assetIndexMap[swap.debit.asset]]?.tokenLogo}
                    </span>
                  )}
                  <p className="font-semibold text-sm">
                    {formatAmt(swap.debit.amount, swap.debit.asset)}{" "}
                    {swap.debit.asset}
                  </p>
                </div>

                <ArrowRight
                  className="text-muted-foreground shrink-0"
                  strokeWidth={1.5}
                  size={16}
                />

                {/* Credit (received) or status badge */}
                {swap.credit ? (
                  <div className="flex items-center gap-2">
                    {assetIndexMap?.[swap.credit.asset] !== undefined && (
                      <span>
                        {TokenData[assetIndexMap[swap.credit.asset]]?.tokenLogo}
                      </span>
                    )}
                    <p className="font-semibold text-sm">
                      {formatAmt(swap.credit.amount, swap.credit.asset)}{" "}
                      {swap.credit.asset}
                    </p>
                  </div>
                ) : (
                  <Badge
                    variant={
                      swap.status === "failed" ? "destructive" : "secondary"
                    }
                    className="text-xs py-0.5"
                  >
                    {swap.status === "failed" ? "Failed" : "Pending"}
                  </Badge>
                )}
              </div>

              {/* SUB: Reference + date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 max-w-[50%]">
                  <p className="text-xs text-muted-foreground truncate">
                    {swap.reference}
                  </p>
                  <CopyButton
                    text={swap.reference}
                    type="code"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground"
                    title="Copy reference"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {dayjs(swap.createdAt).format("MMM D, YYYY · h:mm A")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-8">
            No swap history
          </p>
        )}
      </div>

      {/* SUB: Pagination controls */}
      <div
        className={cn(
          "flex items-center justify-between border-t border-input pt-4",
          { hidden: groupedSwaps.length < 1 },
        )}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isFetching}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isFetching}
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* SUB: Loading overlay for page transitions */}
      {isFetching && !isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
          <PreLoader primary={false} />
        </div>
      )}
    </Card>
  );
};

export default SwapHistory;
