import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import StepProgress, { type Step } from "@/components/StepProgress";
import useGetWallet from "@/hooks/use-getWallet";
import useWithdrawalStatus from "@/hooks/use-withdrawalStatus";
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
  title?: string;
}

const WithdrawalProcessingModal: React.FC<WithdrawalProcessingModalProps> = ({
  isOpen,
  reference,
  onComplete,
  steps = DEFAULT_NGN_STEPS,
  title = "Processing Withdrawal",
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

  const isComplete = currentStep === steps.length - 1;
  const showButton = isComplete || isTimedOut;

  return (
    <ModalTemplate isOpen={isOpen} onClose={() => {}} showCloseButton={false}>
      <div className="flex flex-col items-center w-full py-2">
        <h4 className="text-[22px] leading-[32px] font-semibold text-left w-full mb-6">
          {title}
        </h4>

        <div className="w-full px-1 mb-6">
          <StepProgress
            steps={steps}
            currentStep={currentStep}
            isTimedOut={isTimedOut}
            timedOutMessage={TIMED_OUT_MESSAGE}
          />
        </div>

        {showButton && (
          <PrimaryButton
            className="w-full !h-12"
            text={isComplete ? "Done" : "Close"}
            loading={false}
            onClick={onComplete}
          />
        )}
      </div>
    </ModalTemplate>
  );
};

export default WithdrawalProcessingModal;
