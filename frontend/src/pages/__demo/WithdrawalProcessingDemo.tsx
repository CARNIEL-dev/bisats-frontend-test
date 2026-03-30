/**
 * TEMPORARY DEMO PAGE — delete after testing.
 *
 * Simulates the withdrawal processing modal step progression
 * so you can see the animations without triggering a real withdrawal.
 *
 * Route: /demo/withdrawal-processing
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import StepProgress from "@/components/StepProgress";

const STEPS = [
  { label: "Initiating", description: "Setting up your withdrawal" },
  { label: "Processing", description: "Sending to your bank account" },
  { label: "Successful", description: "Withdrawal complete" },
];

const TIMED_OUT_MESSAGE =
  "Your request is taking longer than expected due to high traffic. You'll be notified when it completes.";

/** Simulates the hook behaviour with adjustable timing */
const useSimulatedStatus = (isRunning: boolean, simulateTimeout: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  useEffect(() => {
    if (!isRunning) return;

    setCurrentStep(0);
    setIsTimedOut(false);
    clearTimers();

    // Step 0 → 1 after 1.5s (matches real hook)
    const t1 = setTimeout(() => setCurrentStep(1), 1500);
    timerRef.current.push(t1);

    if (simulateTimeout) {
      // Simulate timeout after 6s
      const t2 = setTimeout(() => setIsTimedOut(true), 6000);
      timerRef.current.push(t2);
    } else {
      // Step 1 → 2 after 5s (simulates successful poll)
      const t2 = setTimeout(() => setCurrentStep(2), 5000);
      timerRef.current.push(t2);
    }

    return clearTimers;
  }, [isRunning, simulateTimeout]);

  const reset = () => {
    clearTimers();
    setCurrentStep(0);
    setIsTimedOut(false);
  };

  return { currentStep, isTimedOut, reset };
};

const WithdrawalProcessingDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [simulateTimeout, setSimulateTimeout] = useState(false);

  const { currentStep, isTimedOut, reset } = useSimulatedStatus(
    modalOpen,
    simulateTimeout,
  );

  const isSuccess = currentStep === 2;

  const handleClose = () => {
    setModalOpen(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-foreground">
        Withdrawal Processing Modal — Demo
      </h1>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Click a button below to simulate the withdrawal processing flow. The
        modal will step through the animated states automatically.
      </p>

      <div className="flex gap-4">
        <PrimaryButton
          text="Simulate Success"
          loading={false}
          onClick={() => {
            setSimulateTimeout(false);
            setModalOpen(true);
          }}
        />
        <PrimaryButton
          text="Simulate Timeout"
          loading={false}
          className="!bg-orange-500"
          onClick={() => {
            setSimulateTimeout(true);
            setModalOpen(true);
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Success: Initiating (1.5s) → Processing (3.5s) → Successful
        <br />
        Timeout: Initiating (1.5s) → Processing (4.5s) → Timed out message
      </p>

      {/* ── Standalone StepProgress preview (no modal) ── */}
      <div className="mt-10 border border-border rounded-lg p-6 w-full max-w-sm bg-card">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Static StepProgress Preview (step 1 active)
        </h2>
        <StepProgress steps={STEPS} currentStep={1} />
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <ModalTemplate
          isOpen={modalOpen}
          onClose={() => {}}
          showCloseButton={false}
        >
          <div className="flex flex-col items-center w-full py-2">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className="flex flex-col items-center text-center gap-4 w-full py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 200,
                      delay: 0.1,
                    }}
                    className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="size-14 text-green-600 dark:text-green-400" />
                  </motion.div>

                  <div>
                    <h4 className="text-2xl font-bold text-green-700 dark:text-green-400">
                      Withdrawal Successful!
                    </h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your funds have been sent to your bank account.
                    </p>
                  </div>

                  <div className="w-full mt-2">
                    <PrimaryButton
                      className="w-full"
                      text="Done"
                      loading={false}
                      onClick={handleClose}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="processing"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <h4 className="text-[22px] leading-[32px] font-semibold text-left w-full mb-6">
                    Processing Withdrawal
                  </h4>

                  <div className="w-full px-1 mb-6">
                    <StepProgress
                      steps={STEPS}
                      currentStep={currentStep}
                      isTimedOut={isTimedOut}
                      timedOutMessage={TIMED_OUT_MESSAGE}
                    />
                  </div>

                  {isTimedOut && (
                    <PrimaryButton
                      className="w-full"
                      text="Close"
                      loading={false}
                      onClick={handleClose}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ModalTemplate>
      )}
    </div>
  );
};

export default WithdrawalProcessingDemo;
