/**
 * SwapHistory
 *
 * Fetches swap history from GET /swap/history, groups debit+credit pairs
 * by their shared `reference`, and renders paginated swap cards.
 * Tapping a card opens the SwapDetail overlay.
 */

import { Badge } from "@/components/ui/badge";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { TokenData } from "@/data";
import { assetIndexMap } from "@/pages/p2p/components/P2PMarket";
import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter } from "@/utils";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SwapDetail from "./SwapDetail";

const SwapHistory = () => {
  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState<
    SwapHistoryTransaction[]
  >([]);
  const [detailRef, setDetailRef] = useState<string | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery<
    SwapHistoryResponse,
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
      if (response.status === true) return response.data;
      throw new Error(response.message || "Failed to fetch swap history");
    },
    staleTime: 30 * 1000,
  });

  // SUB: Accumulate pages for "load more"
  useEffect(() => {
    if (data?.transactions) {
      setAllTransactions((prev) =>
        page === 1 ? data.transactions : [...prev, ...data.transactions],
      );
    }
  }, [data, page]);

  // SUB: Group by reference → single swap card (debit + optional credit)
  const groupedSwaps = useMemo<GroupedSwap[]>(() => {
    const groups = new Map<string, SwapHistoryTransaction[]>();
    allTransactions.forEach((tx) => {
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
  }, [allTransactions]);

  const hasMore = data?.pagination ? page < data.pagination.totalPages : false;

  const formatAmt = (amount: number, asset: string) =>
    formatter({
      decimal: asset === "xNGN" || asset === "USDT" ? 2 : 6,
    }).format(amount);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-muted-foreground" />
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
    <div className="relative h-[68dvh]">
      {data?.pagination && (
        <p className="text-muted-foreground text-sm px-4 pb-4 border-b">
          Total: {data.pagination.total}
        </p>
      )}

      <div className="flex flex-col gap-4 px-6 h-full overflow-auto no-scrollbar pb-16 pt-4">
        {groupedSwaps.length > 0 ? (
          <>
            {groupedSwaps.map((swap) => (
              <button
                key={swap.reference}
                className="border-b pb-3 flex flex-col gap-3 text-left w-full hover:bg-muted rounded-md -mx-2 px-2 py-2 transition-colors"
                onClick={() => setDetailRef(swap.reference)}
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
                          {
                            TokenData[assetIndexMap[swap.credit.asset]]
                              ?.tokenLogo
                          }
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
                      className="text-xs"
                    >
                      {swap.status === "failed" ? "Failed" : "Pending"}
                    </Badge>
                  )}
                </div>

                {/* SUB: Reference + date */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate max-w-[50%]">
                    {swap.reference}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(swap.createdAt).format("MMM D, YYYY · h:mm A")}
                  </p>
                </div>
              </button>
            ))}

            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                className="text-sm text-primary font-semibold py-2 hover:underline disabled:opacity-50"
              >
                {isFetching ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-8">
            No swap history
          </p>
        )}
      </div>

      {groupedSwaps.length > 6 && (
        <ProgressiveBlur
          position="bottom"
          height="15%"
          className="rounded-b-md"
        />
      )}

      {/* SUB: Detail overlay */}
      {detailRef && (
        <SwapDetail reference={detailRef} onClose={() => setDetailRef(null)} />
      )}
    </div>
  );
};

export default SwapHistory;
