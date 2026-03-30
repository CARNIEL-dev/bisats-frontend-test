import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getXNGNWithdrawalStatus } from "@/redux/actions/walletActions";

interface UseWithdrawalStatusOptions {
  reference: string | null;
  onSuccess?: () => void;
  maxAttempts?: number;
  intervalMs?: number;
}

interface UseWithdrawalStatusReturn {
  currentStep: number;
  isPolling: boolean;
  isTimedOut: boolean;
  reset: () => void;
}

const useWithdrawalStatus = ({
  reference,
  onSuccess,
  maxAttempts = 10,
  intervalMs = 5000,
}: UseWithdrawalStatusOptions): UseWithdrawalStatusReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const attemptCount = useRef(0);
  const queryClient = useQueryClient();

  // Start polling after a short delay (initiating → processing transition)
  useEffect(() => {
    if (!reference) return;

    setCurrentStep(0);
    attemptCount.current = 0;
    setIsTimedOut(false);

    const timer = setTimeout(() => {
      setCurrentStep(1);
      setShouldPoll(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [reference]);

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ["ngnWithdrawalStatus", reference],
    queryFn: () => getXNGNWithdrawalStatus(reference!),
    enabled: !!reference && shouldPoll,
    refetchInterval: shouldPoll ? intervalMs : false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle poll results
  useEffect(() => {
    if (!dataUpdatedAt || !shouldPoll) return;

    attemptCount.current += 1;

    const status = data?.data?.status ?? data?.status;
    if (status === "successful" || status === "completed") {
      setShouldPoll(false);
      setCurrentStep(2);
      onSuccess?.();
      return;
    }

    if (attemptCount.current >= maxAttempts) {
      setShouldPoll(false);
      setIsTimedOut(true);
    }
  }, [dataUpdatedAt, data, shouldPoll, maxAttempts, onSuccess]);

  const reset = useCallback(() => {
    setShouldPoll(false);
    setCurrentStep(0);
    setIsTimedOut(false);
    attemptCount.current = 0;
    queryClient.removeQueries({
      queryKey: ["ngnWithdrawalStatus", reference],
    });
  }, [queryClient, reference]);

  return {
    currentStep,
    isPolling: shouldPoll,
    isTimedOut,
    reset,
  };
};

export default useWithdrawalStatus;
