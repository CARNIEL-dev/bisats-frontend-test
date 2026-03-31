/**
 * Temporary demo page for testing WithdrawalProcessingModal.
 * Remove this file before shipping to production.
 *
 * Route: /demo/withdrawal-processing
 */

import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import StepProgress, { type Step } from "@/components/StepProgress";
import { useState, useRef, useCallback, useEffect } from "react";

const NGN_STEPS: Step[] = [
  { label: "Initiating", description: "Setting up your withdrawal" },
  { label: "Processing", description: "Sending to your bank account" },
  { label: "Successful", description: "Withdrawal complete" },
];

const CRYPTO_STEPS: Step[] = [
  { label: "Initiating", description: "Setting up your withdrawal" },
  { label: "Processing", description: "Sending to your wallet" },
  { label: "Successful", description: "Withdrawal complete" },
];

const TIMED_OUT_MESSAGE =
  "Your request is taking longer than expected due to high traffic. You'll be notified when it completes.";

type Scenario = "ngn-success" | "ngn-timeout" | "crypto-success" | "crypto-timeout";

const SCENARIOS: { key: Scenario; label: string; description: string }[] = [
  {
    key: "ngn-success",
    label: "NGN — Success",
    description: "Simulates a successful NGN withdrawal (Initiating → Processing → Successful)",
  },
  {
    key: "ngn-timeout",
    label: "NGN — Timeout",
    description: "Simulates a timed-out NGN withdrawal (stuck on Processing)",
  },
  {
    key: "crypto-success",
    label: "Crypto — Success",
    description: "Simulates a successful crypto withdrawal with wallet steps",
  },
  {
    key: "crypto-timeout",
    label: "Crypto — Timeout",
    description: "Simulates a timed-out crypto withdrawal",
  },
];

const WithdrawalProcessingDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [activeSteps, setActiveSteps] = useState<Step[]>(NGN_STEPS);
  const [activeTitle, setActiveTitle] = useState("Processing Withdrawal");
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const runScenario = (scenario: Scenario) => {
    clearTimers();
    setCurrentStep(0);
    setIsTimedOut(false);
    setIsOpen(true);

    const isCrypto = scenario.startsWith("crypto");
    const isTimeout = scenario.endsWith("timeout");

    setActiveSteps(isCrypto ? CRYPTO_STEPS : NGN_STEPS);
    setActiveTitle("Processing Withdrawal");

    // Step 0 → 1 after 1.5s (initiating → processing)
    const t1 = setTimeout(() => setCurrentStep(1), 1500);
    timerRef.current.push(t1);

    if (isTimeout) {
      // After 4s on processing, show timed-out state
      const t2 = setTimeout(() => setIsTimedOut(true), 5500);
      timerRef.current.push(t2);
    } else {
      // Step 1 → 2 after 4s (processing → successful)
      const t2 = setTimeout(() => setCurrentStep(2), 5500);
      timerRef.current.push(t2);
    }
  };

  const isComplete = currentStep === activeSteps.length - 1;
  const showButton = isComplete || isTimedOut;

  return (
    <div className="min-h-screen bg-background p-6 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Withdrawal Processing Demo</h1>
        <p className="text-muted-foreground text-sm">
          Test the step-by-step processing modal with different scenarios.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            onClick={() => runScenario(s.key)}
            className="text-left p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <p className="font-semibold text-sm">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
          </button>
        ))}
      </div>

      {/* The modal under test */}
      <ModalTemplate isOpen={isOpen} onClose={() => {}} showCloseButton={false}>
        <div className="flex flex-col items-center w-full py-2">
          <h4 className="text-[22px] leading-[32px] font-semibold text-left w-full mb-6">
            {activeTitle}
          </h4>

          <div className="w-full px-1 mb-6">
            <StepProgress
              steps={activeSteps}
              currentStep={currentStep}
              isTimedOut={isTimedOut}
              timedOutMessage={TIMED_OUT_MESSAGE}
            />
          </div>

          {showButton && (
            <PrimaryButton
              className="ml-auto"
              text={isComplete ? "Done" : "Close"}
              loading={false}
              onClick={() => {
                setIsOpen(false);
                clearTimers();
              }}
            />
          )}
        </div>
      </ModalTemplate>
    </div>
  );
};

export default WithdrawalProcessingDemo;