import { motion, AnimatePresence } from "motion/react";
import { Check, LoaderCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/utils";

export interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  isTimedOut?: boolean;
  timedOutMessage?: string;
}

type StepState = "pending" | "active" | "completed";

const getStepState = (
  index: number,
  currentStep: number,
  totalSteps: number,
  isTimedOut?: boolean,
): StepState => {
  if (index < currentStep) return "completed";
  // Last step reached = success, show as completed
  if (index === currentStep && index === totalSteps - 1) return "completed";
  if (index === currentStep) return isTimedOut ? "active" : "active";
  return "pending";
};

const StepIndicator = ({ state }: { state: StepState }) => {
  if (state === "completed") {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className="size-9 rounded-full bg-green-500 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.25, ease: "backOut" }}
        >
          <Check className="size-5 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>
    );
  }

  if (state === "active") {
    return (
      <div className="size-9 rounded-full border-[3px] border-amber-400 flex items-center justify-center bg-amber-400/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <LoaderCircle className="size-5 text-amber-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="size-9 rounded-full border-2 border-muted-foreground/25 flex items-center justify-center bg-muted/50">
      <div className="size-2.5 rounded-full bg-muted-foreground/25" />
    </div>
  );
};

const ConnectingLine = ({ completed }: { completed: boolean }) => (
  <div className="absolute left-[17px] top-[36px] bottom-0 w-[2px]">
    <div className="h-full w-full bg-muted-foreground/15 rounded-full" />
    <motion.div
      className="absolute inset-0 w-full bg-green-500 rounded-full origin-top"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: completed ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  </div>
);

const StepProgress = ({
  steps,
  currentStep,
  className,
  isTimedOut,
  timedOutMessage,
}: StepProgressProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      {steps.map((step, index) => {
        const state = getStepState(index, currentStep, steps.length, isTimedOut);
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="relative">
            {/* Connecting line */}
            {!isLast && (
              <ConnectingLine completed={state === "completed"} />
            )}

            <div
              className={cn(
                "flex items-start gap-3",
                !isLast && "pb-7",
              )}
            >
              {/* Step indicator */}
              <StepIndicator state={state} />

              {/* Step content */}
              <div className="pt-1.5 flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "text-sm font-medium leading-tight",
                    state === "completed" && "text-green-500",
                    state === "active" && "text-foreground",
                    state === "pending" && "text-muted-foreground/50",
                  )}
                >
                  {step.label}
                </motion.p>

                {step.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: state === "pending" ? 0.35 : 0.7,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.15 + 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="text-xs text-muted-foreground mt-0.5"
                  >
                    {step.description}
                  </motion.p>
                )}

                {/* Timed out message */}
                <AnimatePresence>
                  {isTimedOut && state === "active" && timedOutMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mt-2 flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-2"
                    >
                      <AlertTriangle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {timedOutMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
