import Bisatsfetch from "@/redux/fetchWrapper";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSwapPairs from "./useSwapPairs";
import Toast from "@/components/Toast";

export function useSwapRate(options?: { skipFetch?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Sync Form State with URL query params
  const sourceAsset = searchParams.get("sourceAsset") || "";
  const targetAsset = searchParams.get("targetAsset") || "USDT";
  const amount = searchParams.get("amount") || "";

  // 2. Fetch Pairs cache (to resolve IDs)
  const {
    pairsLoading,
    pairsError,
    validSourceAssets,
    validTargetAssets,
    isPairSupported,
    getPairIds,
  } = useSwapPairs(sourceAsset);

  // 3. Local Rate State
  const [rateData, setRateData] = useState<SwapRateResponse | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Exposed Setters that update the URL
  const setSourceAsset = (val: string) => {
    setSearchParams((prev) => {
      if (val) prev.set("sourceAsset", val);
      else prev.delete("sourceAsset");

      // Reset amount and rate when source changes
      prev.delete("amount");

      return prev;
    });
    setRateData(null);
  };

  const setTargetAsset = (val: string) => {
    setSearchParams((prev) => {
      if (val) prev.set("targetAsset", val);
      else prev.delete("targetAsset");
      return prev;
    });
    setRateData(null);
  };

  const setAmount = (val: string) => {
    setSearchParams((prev) => {
      if (val) prev.set("amount", val);
      else prev.delete("amount");
      return prev;
    });
  };

  // 5. Fetch API Logic
  const fetchRate = useCallback(
    async (src: string, tgt: string, amt: string) => {
      if (!src || !tgt || !amt || Number(amt) <= 0) {
        setRateData(null);
        setTimer(null);
        return;
      }

      const ids = getPairIds(src, tgt);
      if (!ids) {
        setRateData(null);
        setTimer(null);
        return;
      }

      setRateLoading(true);
      try {
        const payload = {
          sourceId: ids.sourceId,
          targetId: ids.targetId,
          amount: Number(amt),
        };
        const response = await Bisatsfetch(BACKEND_URLS.SWAP.GET_RATE, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.success === true && response.data) {
          const data = response.data as SwapRateResponse;
          setRateData(data);

          // Use expiresAt if available, fallback to expiresIn (assume seconds, or calculate if it's minutes)
          let secondsLeft = 0;
          if (data.expiresAt) {
            const diff = new Date(data.expiresAt).getTime() - Date.now();
            secondsLeft = Math.max(0, Math.floor(diff / 1000));
          } else if (data.expiresIn > 0) {
            // If extremely small (like 10), it might be minutes. Assume seconds as safe default,
            // but if the user API actually sends minutes we can multiply by 60. The mock API sent exactly 10.
            secondsLeft = data.expiresIn;
          }
          setTimer(secondsLeft);
        } else {
          setRateData(null);
          setTimer(null);
          // Only show toast if the user explicitly refreshes or types, but not immediately to prevent spam
          // if (response.message) {
          //   Toast.error(response.message || "Pair not available", "Swap Rate");
          // }
        }
      } catch {
        setRateData(null);
        setTimer(null);
        Toast.error("Failed to fetch rate", "Swap Rate");
      } finally {
        setRateLoading(false);
      }
    },
    [getPairIds],
  );

  // 6. Hook to manually refresh using the current URL state
  const refreshRate = useCallback(() => {
    if (sourceAsset && targetAsset && amount) {
      // Clear any existing timer to avoid race conditions
      if (timerRef.current) clearInterval(timerRef.current);
      fetchRate(sourceAsset, targetAsset, amount);
    }
  }, [sourceAsset, targetAsset, amount, fetchRate]);

  // 7. Debounced fetch when user types
  const debouncedFetchRate = useCallback(
    (src: string, tgt: string, amt: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchRate(src, tgt, amt), 500);
    },
    [fetchRate],
  );

  // React to URL changes (e.g. user typing amount)
  useEffect(() => {
    // Also skip fetch if external validation tells us to
    if (options?.skipFetch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    if (sourceAsset && targetAsset && amount) {
      debouncedFetchRate(sourceAsset, targetAsset, amount);
    } else {
      setRateData(null);
      setTimer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceAsset, targetAsset, amount, options?.skipFetch]); // Only run on specific form field changes, NOT debouncedFetchRate or fetchRate to prevent infinite loops

  // 8. Countdown Timer Effect
  useEffect(() => {
    if (timer === null || timer <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        }
        if (timerRef.current) clearInterval(timerRef.current);
        return 0; // 0 indicates expired
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  // Cleanup debouncer
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    sourceAsset,
    targetAsset,
    amount,
    setSourceAsset,
    setTargetAsset,
    setAmount,
    rateData,
    rateLoading,
    timer,
    refreshRate,
    pairsLoading,
    pairsError,
    validSourceAssets,
    validTargetAssets,
    isPairSupported,
    getPairIds,
    clearRate: () => {
      setRateData(null);
      setTimer(null);
    },
  };
}
