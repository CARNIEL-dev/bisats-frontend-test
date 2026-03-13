/**
 * useSwapPairs
 *
 * Fetches and caches tradeable pairs + currencies from the API.
 * Provides helpers to compute valid target assets for a given source,
 * and valid source assets that have at least one tradeable target.
 */

import Bisatsfetch from "@/redux/fetchWrapper";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/** Assets that are never shown in swap pickers regardless of API response */
const HARD_EXCLUDED = ["TRX", "xNGN"];

const STALE_TIME = 1000 * 60 * 30; // 30 minutes

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const useSwapPairs = (sourceAsset?: string) => {
  // SUB: Fetch all trading pairs (GET /swap/pairs)
  const {
    data: pairs,
    isLoading: pairsLoading,
    isError: pairsError,
  } = useQuery<SwapPairEntry[], Error>({
    queryKey: ["swapPairs"],
    queryFn: async () => {
      const res = await Bisatsfetch(BACKEND_URLS.SWAP.GET_PAIRS, {
        method: "GET",
      });
      if (res.data) return res.data as SwapPairEntry[];
      throw new Error(res.message || "Failed to fetch swap pairs");
    },
    staleTime: STALE_TIME,
  });

  // SUB: Fetch tradeable currencies (GET /swap/currencies)
  const { data: currencies } = useQuery<SwapCurrency[], Error>({
    queryKey: ["swapCurrencies"],
    queryFn: async () => {
      const res = await Bisatsfetch(BACKEND_URLS.SWAP.GET_CURRENCIES, {
        method: "GET",
      });
      if (res.status || res.data) return res.data as SwapCurrency[];
      throw new Error(res.message || "Failed to fetch swap currencies");
    },
    staleTime: STALE_TIME,
  });

  // SUB: Build a Set of all currency codes that appear in any active pair,
  //      excluding hard-excluded tokens.
  const allTradeable = useMemo<Set<string>>(() => {
    if (!pairs) return new Set();
    const codes = new Set<string>();
    pairs.forEach((p) => {
      if (!HARD_EXCLUDED.includes(p.source.code)) codes.add(p.source.code);
      if (!HARD_EXCLUDED.includes(p.target.code)) codes.add(p.target.code);
    });
    return codes;
  }, [pairs]);

  // console.log("pairs", pairs);

  // SUB: Valid SOURCE assets — unique source codes from pairs (excluding hard-excluded)
  const validSourceAssets = useMemo<string[]>(() => {
    if (!pairs) return [];
    const seen = new Set<string>();
    pairs.forEach((p) => {
      if (![...HARD_EXCLUDED, "USDT"].includes(p.source.code))
        seen.add(p.source.code);
    });
    return Array.from(seen);
  }, [pairs]);

  // SUB: Valid TARGET assets given the currently selected source
  const validTargetAssets = useMemo<string[]>(() => {
    if (!pairs || !sourceAsset) return [];
    return pairs
      .filter(
        (p) =>
          p.source.code === sourceAsset &&
          !HARD_EXCLUDED.includes(p.target.code),
      )
      .map((p) => p.target.code);
  }, [pairs, sourceAsset]);

  // SUB: Check if a source→target pair is supported
  const isPairSupported = (src: string, tgt: string): boolean => {
    if (!pairs) return false;
    return pairs.some((p) => p.source.code === src && p.target.code === tgt);
  };

  // SUB: Resolve opaque UUID IDs for a given source→target code pair.
  //      These are needed by GET /swap/rate and POST /swap/execute.
  const getPairIds = (
    src: string,
    tgt: string,
  ): { sourceId: string; targetId: string } | null => {
    if (!pairs) return null;
    const pair = pairs.find(
      (p) => p.source.code === src && p.target.code === tgt,
    );
    return pair ? { sourceId: pair.sourceId, targetId: pair.targetId } : null;
  };

  return {
    pairs,
    currencies,
    pairsLoading,
    pairsError,
    allTradeable,
    validSourceAssets,
    validTargetAssets,
    isPairSupported,
    getPairIds,
  };
};

export default useSwapPairs;
