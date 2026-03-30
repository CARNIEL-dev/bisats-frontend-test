import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import StepProgress, { type Step } from "@/components/StepProgress";
import { PrimaryButton } from "@/components/buttons/Buttons";
import useWithdrawalStatus from "@/hooks/use-withdrawalStatus";
import useGetWallet from "@/hooks/use-getWallet";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_NGN_STEPS: Step[] = [
  { label: "Initiating", description: "Setting up your withdrawal" },
  { label: "Processing", description: "Sending to your bank account" },
  { label: "Successful", description: "Withdrawal complete" },
];

const TIMED_OUT_MESSAGE =
  "Your request is taking longer than expected due to high traffic. You'll be notified when it completes.";

interface WithdrawalProcessingModalProps {
  isOpen: boolean;
  reference: string | null;
  onComplete: () => void;
  steps?: Step[];
  successTitle?: string;
  successMessage?: string;
}

const WithdrawalProcessingModal: React.FC<WithdrawalProcessingModalProps> = ({
  isOpen,
  reference,
  onComplete,
  steps = DEFAULT_NGN_STEPS,
  successTitle = "Withdrawal Successful!",
  successMessage = "Your funds have been sent to your bank account.",
}) => {
  const queryClient = useQueryClient();
  const { refetchWallet } = useGetWallet();

  const handleSuccess = async () => {
    await Promise.all([
      queryClient.refetchQueries({
        queryKey: ["userWalletHistory"],
        exact: false,
      }),
      refetchWallet(),
    ]);
  };

  const { currentStep, isTimedOut } = useWithdrawalStatus({
    reference,
    onSuccess: handleSuccess,
  });

  const isSuccess = currentStep === 2;

  return (
    <ModalTemplate isOpen={isOpen} onClose={() => {}} showCloseButton={false}>
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
                  {successTitle}
                </h4>
                <p className="text-muted-foreground text-sm mt-1">
                  {successMessage}
                </p>
              </div>

              <div className="w-full mt-2">
                <PrimaryButton
                  className="w-full"
                  text="Done"
                  loading={false}
                  onClick={onComplete}
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
                  steps={steps}
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
                  onClick={onComplete}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalTemplate>
  );
};

export default WithdrawalProcessingModal;
