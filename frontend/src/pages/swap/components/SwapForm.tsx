import { PrimaryButton } from "@/components/buttons/Buttons";
import Toast from "@/components/Toast";
import RefreshButton from "@/components/RefreshButton";
import TokenSelection from "@/components/shared/TokenSelection";
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
import { useSwapRate } from "../hooks/useSwapRate";
import SwapInputField from "./SwapInputField";

type SwapFormProps = {
  onSuccess?: () => void;
};

const SwapForm = ({ onSuccess }: SwapFormProps) => {
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const queryClient = useQueryClient();
  const { refetchWallet } = useGetWallet();

  // SUB: Rate, Form State, and Timer hook handles URL sync + API
  const {
    sourceAsset,
    targetAsset,
    amount,
    setSourceAsset,
    setTargetAsset,
    setAmount,
    rateData,
    rateLoading,
    timer,
    pairsLoading,
    pairsError,
    validSourceAssets,
    validTargetAssets,
    isPairSupported,
    getPairIds,
    clearRate,
    refreshRate,
  } = useSwapRate();

  // SUB: Wallet balance for source asset
  const assetBalance = sourceAsset ? walletState?.wallet?.[sourceAsset] : null;

  const isInsufficientBalance =
    assetBalance !== null &&
    amount !== "" &&
    Number(amount) > Number(assetBalance);

  // We enforce skipping fetches via an effect returning earlier than the hook, since we can't cleanly pass down local state inside itself
  useEffect(() => {
    if (isInsufficientBalance) {
      clearRate();
    }
  }, [isInsufficientBalance, clearRate]);

  // SUB: Execution state
  const [executing, setExecuting] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapExecuteResponse | null>(
    null,
  );
  const [duplicateLockout, setDuplicateLockout] = useState(0);
  const lockoutRef = useRef<NodeJS.Timeout | null>(null);

  // SUB: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lockoutRef.current) clearInterval(lockoutRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
      setAmount(value);
      setSwapResult(null);
    }
  };

  const handleSourceChange = (val: string) => {
    setSourceAsset(val);
    setSwapResult(null);
  };

  const handleTargetChange = (val: string) => {
    setTargetAsset(val);
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
      if (!sourceAsset || !targetAsset || !amount || !rateData?.quoteId) return;

      // Resolve opaque UUIDs — the API requires IDs, not asset codes
      const ids = getPairIds(sourceAsset, targetAsset);
      if (!ids) {
        Toast.error("Trading pair not found. Please try again.", "Pair Error");
        return;
      }

      const payload: SwapExecutePayload = {
        quoteId: rateData.quoteId,
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
          clearRate();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sourceAsset,
      targetAsset,
      amount,
      rateData,
      getPairIds,
      clearRate,
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
    if (isInsufficientBalance)
      return `Insufficient balance. Available: ${
        assetBalance !== null
          ? formatter({
              decimal: sourceAsset === "xNGN" || sourceAsset === "USDT" ? 2 : 6,
            }).format(assetBalance)
          : "0"
      } ${sourceAsset}`;
    if (pairsError) return "Failed to load swap pairs";
    if (!sourceAsset || !targetAsset) return undefined;
    if (!isPairSupported(sourceAsset, targetAsset))
      return "This pair is not supported";
    return undefined;
  }, [
    sourceAsset,
    targetAsset,
    isPairSupported,
    pairsError,
    isInsufficientBalance,
    assetBalance,
  ]);

  const canSwap =
    !!sourceAsset &&
    !!targetAsset &&
    !!amount &&
    Number(amount) > 0 &&
    !rateLoading &&
    rateData !== null &&
    !executing &&
    duplicateLockout === 0 &&
    timer !== 0 && // Disable swap if the quote expired
    !isInsufficientBalance &&
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
          rateData
            ? formatter({ decimal: 6 }).format(rateData.targetAmount)
            : rateLoading
              ? "Loading…"
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

      {/* SUB: Indicative rate + Timer */}
      {rateData && sourceAsset && targetAsset && (
        <div className="flex items-center justify-between -mt-6 mb-2">
          <p className="text-xs text-muted-foreground">
            Indicative rate: 1 {sourceAsset} ≈ {formatNumber(rateData.rate)}{" "}
            {targetAsset}
          </p>
          <div className="flex gap-2 items-center">
            {timer !== null && (
              <div className="flex gap-1 items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-muted">
                {timer > 0 ? (
                  <span
                    className={
                      timer <= 10 ? "text-red-500" : "text-muted-foreground"
                    }
                  >
                    {timer}s
                  </span>
                ) : (
                  <span className="text-red-500 font-bold">Expired</span>
                )}
              </div>
            )}
            <RefreshButton
              isFetching={rateLoading}
              refetch={refreshRate}
              className="bg-transparent hover:bg-muted text-green-600 h-6 w-6 p-1"
              refreshTime={2000}
            />
          </div>
        </div>
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
          <p className="text-muted-foreground text-xs">
            Reference: {swapResult.reference}
          </p>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
