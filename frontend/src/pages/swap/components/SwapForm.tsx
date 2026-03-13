import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import RefreshButton from "@/components/RefreshButton";
import TextBox from "@/components/shared/TextBox";
import TokenSelection from "@/components/shared/TokenSelection";
import Toast from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import useGetWallet from "@/hooks/use-getWallet";
import KycManager from "@/pages/kyc/KYCManager";
import SwapInputField from "@/pages/swap/components/SwapInputField";
import { useSwapRate } from "@/pages/swap/hooks/useSwapRate";
import Bisatsfetch from "@/redux/fetchWrapper";
import { formatter } from "@/utils";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { formatNumber } from "@/utils/numberFormat";
import { ACTIONS } from "@/utils/transaction_limits";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlinkBlur } from "react-loading-indicators";

type SwapFormProps = {
  onSuccess?: () => void;
};

const SwapForm = ({ onSuccess }: SwapFormProps) => {
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
    assetBalance,
    isInsufficientBalance,
  } = useSwapRate();

  // SUB: Execution state
  const [executing, setExecuting] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapExecuteResponse | null>(
    null,
  );
  const [duplicateLockout, setDuplicateLockout] = useState(0);
  const lockoutRef = useRef<NodeJS.Timeout | null>(null);

  // New Modal States
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapStage, setSwapStage] = useState<
    "confirmation" | "executing" | "success"
  >("confirmation");
  const [executionError, setExecutionError] = useState<string | null>(null);

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
      if (
        response?.status === false ||
        response?.success === false ||
        response?.statusCode === 400
      ) {
        if (msg.toLowerCase().includes("account locked")) {
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

  const handleExecuteSwap = useCallback(
    async () => {
      if (!sourceAsset || !targetAsset || !amount || !rateData?.quoteId) return;

      // Resolve opaque UUIDs — the API requires IDs, not asset codes
      const ids = getPairIds(sourceAsset, targetAsset);
      if (!ids) {
        Toast.error("Trading pair not found. Please try again.", "Pair Error");
        return;
      }
      if (swapResult !== null) {
        setSwapResult(null);
      }

      const payload: SwapExecutePayload = {
        quoteId: rateData.quoteId,
        sourceId: ids.sourceId,
        targetId: ids.targetId,
        amount: Number(amount),
        sourceCode: sourceAsset,
        targetCode: targetAsset,
      };

      setExecuting(true);
      setSwapStage("executing");
      setExecutionError(null);
      try {
        const response = await Bisatsfetch(BACKEND_URLS.SWAP.EXECUTE, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (
          (response.status === true || response.success === true) &&
          response.data
        ) {
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
          setSwapStage("success");
        } else {
          handleSwapError(response);
          setSwapStage("confirmation");
          setExecutionError(response?.message || "Swap failed");
        }
      } catch (err) {
        const error = err as Error;
        setSwapStage("confirmation");
        setExecutionError(error?.message || "Something went wrong");
        Toast.error(
          error?.message || "Something went wrong. Please try again.",
          "Error",
        );
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
    !isInsufficientBalance &&
    !pairError;

  // ---------------------------------------------------------------------------
  // Execution flow
  // ---------------------------------------------------------------------------

  const handleInitiateSwap = useCallback(() => {
    if (!canSwap) return;
    setSwapStage("confirmation");
    setIsSwapModalOpen(true);
    setExecutionError(null);
  }, [canSwap]);

  // ---------------------------------------------------------------------------
  //HDR: Render
  // ---------------------------------------------------------------------------

  return (
    <>
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
              placeholder={pairsLoading ? "Loading assets..." : "Select asset"}
              disabled={pairsLoading}
            />
          </SwapInputField>
          {assetBalance !== null && sourceAsset && (
            <Badge variant="success">
              Balance:{" "}
              {formatter({
                decimal:
                  sourceAsset === "xNGN" || sourceAsset === "USDT" ? 2 : 6,
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
              ? rateData.targetAmount.toString()
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
            onlyShowTokens={
              pairsLoading || !sourceAsset ? [] : validTargetAssets
            }
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
                        timer <= 10
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {timer}s
                    </span>
                  ) : (
                    <span className="text-destructive font-bold">Expired</span>
                  )}
                </div>
              )}
              <RefreshButton
                isFetching={rateLoading}
                refetch={refreshRate}
                className="bg-transparent hover:bg-muted text-green-600 size-6 p-1"
                refreshTime={15 * 1000} // 15 seconds
              />
            </div>
          </div>
        )}

        {/* SUB: Swap button wrapped with KycManager */}
        <KycManager action={ACTIONS.SWAP} func={handleInitiateSwap}>
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
      </div>

      <ModalTemplate
        isOpen={isSwapModalOpen}
        onClose={() => {
          if (swapStage !== "executing") {
            setIsSwapModalOpen(false);
          }
        }}
        showCloseButton={swapStage !== "executing"}
        className="max-w-md"
      >
        <AnimatePresence mode="wait">
          {swapStage === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6 py-4"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Confirm Swap</h3>
                <p className="text-muted-foreground text-xs">
                  Please review your swap details below
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-6 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    You are swapping
                  </p>
                  <h2 className="text-3xl font-extrabold tracking-tight mt-2">
                    {amount} {sourceAsset}
                  </h2>
                </div>

                <div className="bg-muted p-2 rounded-full">
                  <ArrowRight className="size-6 text-foreground/50" />
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    To receive
                  </p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-primary mt-2">
                    {rateData?.targetAmount} {targetAsset}
                  </h2>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">
                    1 {sourceAsset} ≈ {formatNumber(rateData?.rate || 0)}{" "}
                    {targetAsset}
                  </span>
                </div>
                {executionError && (
                  <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                    <AlertCircle className="size-4" />
                    <span>{executionError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsSwapModalOpen(false)}
                  disabled={executing}
                  className="!text-sm"
                >
                  Cancel
                </Button>
                <PrimaryButton
                  onClick={handleExecuteSwap}
                  loading={executing}
                  text="Confirm Swap"
                  className="w-full flex-1 h-12 "
                />
              </div>
            </motion.div>
          )}

          {swapStage === "executing" && (
            <motion.div
              key="executing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-12 gap-8"
            >
              <div className="relative flex items-center justify-center w-full max-w-[300px] h-32">
                {/* Source Asset Bubble */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute left-0 z-10 size-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg font-bold text-xs"
                >
                  {sourceAsset}
                </motion.div>

                <BlinkBlur
                  color="#32cd32"
                  size="small"
                  text="Swapping..."
                  textColor=""
                />

                {/* Target Asset Bubble */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute right-0 z-10 size-20 rounded-full bg-primary flex items-center justify-center shadow-xl text-black font-bold text-sm animate-pulse"
                >
                  {targetAsset}
                </motion.div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-muted-foreground  text-sm">
                  Swapping {amount} {sourceAsset} to{" "}
                  <span className="text-primary font-semibold">
                    {rateData?.targetAmount} {targetAsset}
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {swapStage === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 gap-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="size-14 text-green-600 dark:text-green-400" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Swap Successful!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your funds have been successfully converted.
                </p>
              </div>

              <div className="w-full bg-muted/30 rounded-2xl p-6 border border-border space-y-2">
                <TextBox
                  label="Swapped"
                  value={
                    <div className="text-right font-bold">
                      {swapResult?.sourceAmount} {sourceAsset}
                    </div>
                  }
                  labelClass="text-sm"
                  showIndicator={false}
                />
                <TextBox
                  label="Received"
                  value={
                    <div className="text-right font-bold text-primary">
                      {swapResult?.targetAmount} {targetAsset}
                    </div>
                  }
                  labelClass="text-sm"
                  showIndicator={false}
                />
                <TextBox
                  label="Reference"
                  value={swapResult?.reference}
                  labelClass="text-sm"
                  showIndicator={false}
                />
              </div>

              <PrimaryButton
                onClick={() => setIsSwapModalOpen(false)}
                text="Close"
                className="w-full h-12 mt-4"
                loading={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ModalTemplate>
    </>
  );
};

export default SwapForm;
