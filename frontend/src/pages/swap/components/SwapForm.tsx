/**
 * SwapForm
 *
 * The main swap form. Handles:
 * - Source asset selection (only assets with at least one tradeable pair)
 * - Target asset selection (only assets that pair with the selected source)
 * - Debounced rate fetching (500ms) via GET /swap/rate
 * - KycManager-wrapped execution via POST /swap/execute
 * - Full error handling: PIN, 2FA, lockout, duplicate (60s), suspension, 5xx
 * - Wallet balance refresh on success
 */

import { PrimaryButton } from "@/components/buttons/Buttons";
import Toast from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import useGetWallet from "@/hooks/use-getWallet";
import KycManager from "@/pages/kyc/KYCManager";
import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter } from "@/utils";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { formatNumber } from "@/utils/numberFormat";
import { ACTIONS } from "@/utils/transaction_limits";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSwapPairs from "../hooks/useSwapPairs";
import SwapInputField from "./SwapInputField";

import TokenSelection from "@/components/shared/TokenSelection";

// ---------------------------------------------------------------------------
// SwapForm
// ---------------------------------------------------------------------------

type SwapFormProps = {
  /** Triggered after a successful swap so the parent can refresh the rate banner etc. */
  onSuccess?: () => void;
};

const SwapForm = ({ onSuccess }: SwapFormProps) => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const queryClient = useQueryClient();
  const { refetchWallet } = useGetWallet();

  // SUB: Form state
  const [sourceAsset, setSourceAsset] = useState("");
  const [targetAsset, setTargetAsset] = useState("");
  const [amount, setAmount] = useState("");

  // SUB: Rate state
  const [rateData, setRateData] = useState<SwapRateResponse | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // SUB: Execution state
  const [executing, setExecuting] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapExecuteResponse | null>(
    null,
  );
  const [duplicateLockout, setDuplicateLockout] = useState(0);
  const lockoutRef = useRef<NodeJS.Timeout | null>(null);

  // SUB: Pairs hook — provides valid source and target asset lists
  const {
    pairsLoading,
    pairsError,
    validSourceAssets,
    validTargetAssets,
    isPairSupported,
    getPairIds,
  } = useSwapPairs(sourceAsset);

  // SUB: Auto-select target if only one valid option
  useEffect(() => {
    if (validTargetAssets.length === 1) {
      setTargetAsset(validTargetAssets[0]);
    } else if (
      validTargetAssets.length > 0 &&
      !validTargetAssets.includes(targetAsset)
    ) {
      // Selected target is no longer valid for the new source → reset
      setTargetAsset("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validTargetAssets]);

  // SUB: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (lockoutRef.current) clearInterval(lockoutRef.current);
    };
  }, []);

  // SUB: Wallet balance for source asset
  const assetBalance = sourceAsset ? walletState?.wallet?.[sourceAsset] : null;

  // ---------------------------------------------------------------------------
  // Rate fetching — debounced 500ms
  // ---------------------------------------------------------------------------

  const fetchRate = useCallback(
    async (src: string, tgt: string, amt: string) => {
      if (!src || !tgt || !amt || Number(amt) <= 0) {
        setRateData(null);
        return;
      }
      // Resolve opaque UUIDs from the pairs cache before calling the API
      const ids = getPairIds(src, tgt);
      if (!ids) {
        setRateData(null);
        return;
      }
      setRateLoading(true);
      try {
        const params = new URLSearchParams({
          sourceId: ids.sourceId,
          targetId: ids.targetId,
          amount: amt,
        });
        const response = await Bisatsfetch(
          `${BACKEND_URLS.SWAP.GET_RATE}?${params.toString()}`,
          { method: "GET" },
        );

        if (response.status === true && response.data) {
          setRateData(response.data);
        } else {
          setRateData(null);
          if (response.message) {
            Toast.error(response.message || "Pair not available", "Swap Rate");
          }
        }
      } catch {
        setRateData(null);
        Toast.error("Failed to fetch rate", "Swap Rate");
      } finally {
        setRateLoading(false);
      }
    },
    [getPairIds],
  );

  const debouncedFetchRate = useCallback(
    (src: string, tgt: string, amt: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchRate(src, tgt, amt), 500);
    },
    [fetchRate],
  );

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
      setAmount(value);
      setSwapResult(null);
      debouncedFetchRate(sourceAsset, targetAsset, value);
    }
  };

  const handleSourceChange = (val: string) => {
    setSourceAsset(val);
    setAmount("");
    setRateData(null);
    setSwapResult(null);
    // Target will be reset via the useEffect above when validTargetAssets updates
  };

  const handleTargetChange = (val: string) => {
    setTargetAsset(val);
    setRateData(null);
    if (amount && sourceAsset) {
      debouncedFetchRate(sourceAsset, val, amount);
    }
  };

  // ---------------------------------------------------------------------------
  // Duplicate lockout
  // ---------------------------------------------------------------------------

  const startDuplicateLockout = useCallback(() => {
    setDuplicateLockout(60);
    if (lockoutRef.current) clearInterval(lockoutRef.current);
    lockoutRef.current = setInterval(() => {
      setDuplicateLockout((prev) => {
        if (prev <= 1) {
          if (lockoutRef.current) clearInterval(lockoutRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ---------------------------------------------------------------------------
  // Error handler
  // ---------------------------------------------------------------------------

  const handleSwapError = useCallback(
    (response: any) => {
      const msg: string = response?.message ?? "";
      if (response?.statusCode === 403) {
        Toast.error(msg || "Account suspended", "Account Suspended");
        return;
      }
      if (response?.statusCode === 400) {
        if (msg.toLowerCase().includes("incorrect pin")) {
          Toast.error("Incorrect PIN. Please try again.", "PIN Error");
        } else if (msg.toLowerCase().includes("invalid two-factor")) {
          Toast.error("Invalid authenticator code.", "2FA Error");
        } else if (msg.toLowerCase().includes("account locked")) {
          Toast.error(msg, "Account Locked");
        } else if (msg.toLowerCase().includes("duplicate")) {
          Toast.error(
            "Duplicate request. Please wait before retrying.",
            "Duplicate Request",
          );
          startDuplicateLockout();
        } else if (msg.toLowerCase().includes("insufficient")) {
          Toast.error(msg, "Insufficient Balance");
        } else if (msg.toLowerCase().includes("must set a pin")) {
          Toast.error("Set a wallet PIN before swapping.", "PIN Required");
        } else if (
          msg.toLowerCase().includes("two-factor authentication must")
        ) {
          Toast.error("Enable 2FA before swapping.", "2FA Required");
        } else if (msg.toLowerCase().includes("no trading pair")) {
          Toast.error("This trading pair is not supported.", "Pair Error");
        } else {
          Toast.error(msg || "Swap failed", "Swap Error");
        }
        return;
      }
      Toast.error("Something went wrong. Please try again.", "Error");
    },
    [startDuplicateLockout],
  );

  // ---------------------------------------------------------------------------
  // Execution — called by KycManager with { pin, code }
  // ---------------------------------------------------------------------------

  const handleExecuteSwap = useCallback(
    async (secureData?: Record<string, any>) => {
      if (!sourceAsset || !targetAsset || !amount) return;

      // Resolve opaque UUIDs — the API requires IDs, not asset codes
      const ids = getPairIds(sourceAsset, targetAsset);
      if (!ids) {
        Toast.error("Trading pair not found. Please try again.", "Pair Error");
        return;
      }

      const payload: SwapExecutePayload = {
        sourceId: ids.sourceId,
        targetId: ids.targetId,
        amount: Number(amount),
        side: "sell",
        withdrawalPin: secureData?.pin ?? "",
        twoFactorCode: secureData?.code ?? "",
      };

      setExecuting(true);
      try {
        const response = await Bisatsfetch(BACKEND_URLS.SWAP.EXECUTE, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.status === true && response.data) {
          const result: SwapExecuteResponse = response.data;
          setSwapResult(result);
          // Use local asset codes for human-readable labels (response sourceId/targetId are UUIDs)
          Toast.success(
            `Swapped ${result.sourceAmount} ${sourceAsset} → ${result.targetAmount} ${targetAsset}`,
            "Swap Successful",
          );
          setAmount("");
          setRateData(null);

          // Refresh balances + history
          await Promise.all([
            refetchWallet(),
            queryClient.invalidateQueries({
              queryKey: ["swapHistory"],
              exact: false,
            }),
          ]);

          onSuccess?.();
        } else {
          handleSwapError(response);
        }
      } catch {
        Toast.error("Something went wrong. Please try again.", "Error");
      } finally {
        setExecuting(false);
      }
    },
    [
      sourceAsset,
      targetAsset,
      amount,
      getPairIds,
      refetchWallet,
      queryClient,
      handleSwapError,
      onSuccess,
    ],
  );

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const pairError = useMemo(() => {
    if (pairsError) return "Failed to load swap pairs";
    if (!sourceAsset || !targetAsset) return undefined;
    if (!isPairSupported(sourceAsset, targetAsset))
      return "This pair is not supported";
    return undefined;
  }, [sourceAsset, targetAsset, isPairSupported, pairsError]);

  const canSwap =
    !!sourceAsset &&
    !!targetAsset &&
    !!amount &&
    Number(amount) > 0 &&
    !rateLoading &&
    rateData !== null &&
    !executing &&
    duplicateLockout === 0 &&
    !pairError;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-3 mt-6">
      {/* SUB: You pay */}
      <div>
        <SwapInputField
          label="You pay"
          id="amt"
          value={amount}
          error={pairError}
          onChange={handleAmountChange}
          onFocus={() => {}}
        >
          <TokenSelection
            value={sourceAsset}
            handleChange={handleSourceChange}
            error={undefined}
            touched={undefined}
            showBalance={false}
            onlyShowTokens={pairsLoading ? [] : validSourceAssets}
            variant="dialog"
            placeholder="Select asset"
            disabled={pairsLoading}
          />
        </SwapInputField>
        {assetBalance !== null && sourceAsset && (
          <Badge variant="success">
            Balance:{" "}
            {formatter({
              decimal: sourceAsset === "xNGN" || sourceAsset === "USDT" ? 2 : 6,
            }).format(assetBalance)}{" "}
            {sourceAsset}
          </Badge>
        )}
      </div>

      {/* SUB: You'll receive */}
      <SwapInputField
        label="You'll receive (estimated)"
        id="receiveAmount"
        value={
          rateLoading
            ? "Loading…"
            : rateData
              ? formatter({ decimal: 6 }).format(rateData.estimatedTargetAmount)
              : ""
        }
        error={undefined}
        onChange={() => {}}
        disabled={true}
        loading={rateLoading}
      >
        <TokenSelection
          value={targetAsset}
          handleChange={handleTargetChange}
          error={undefined}
          touched={undefined}
          showBalance={false}
          onlyShowTokens={pairsLoading || !sourceAsset ? [] : validTargetAssets}
          variant="dialog"
          placeholder={!sourceAsset ? "Select source first" : "Select asset"}
          disabled={pairsLoading || !sourceAsset}
        />
      </SwapInputField>

      {/* SUB: Indicative rate */}
      {rateData && sourceAsset && targetAsset && (
        <p className="text-xs text-gray-500 -mt-6">
          Indicative rate: 1 {sourceAsset} ≈ {formatNumber(rateData.rate)}{" "}
          {targetAsset}
        </p>
      )}

      {/* SUB: Swap button wrapped with KycManager */}
      <KycManager action={ACTIONS.SWAP} func={handleExecuteSwap} isManual>
        {(validateAndExecute) => (
          <PrimaryButton
            type="button"
            loading={executing}
            text={
              duplicateLockout > 0 ? `Retry in ${duplicateLockout}s` : "Swap"
            }
            className="-mt-2"
            disabled={!canSwap}
            onClick={validateAndExecute}
          />
        )}
      </KycManager>

      {/* SUB: Success card */}
      {swapResult && (
        <div className="border rounded-lg p-4 bg-green-50 text-sm space-y-1">
          <p className="font-semibold text-green-700">
            Swap completed successfully!
          </p>
          <p>
            Sold {swapResult.sourceAmount} {sourceAsset} → Received{" "}
            {swapResult.targetAmount} {targetAsset}
          </p>
          <p className="text-gray-500 text-xs">
            Reference: {swapResult.reference}
          </p>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
