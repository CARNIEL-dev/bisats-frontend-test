import KycUpgrade from "@/components/Modals/KycUpgrade";
import KycVerification from "@/components/Modals/KycVerification";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import SecurityVerification from "@/components/Modals/SecurityVerification";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import Head from "@/pages/wallet/Head";

import { cn, formatAccountLevel } from "@/utils";
import {
  ACTIONS_REQUIRING_2FA,
  ACTIONS_REQUIRING_PIN,
  KYC_RULES,
} from "@/utils/transaction_limits";

import { Lock } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface TKycManager {
  action: string;
  func: (data?: Record<string, any>) => void;
  children: (trigger: () => void) => React.ReactNode;
  isManual?: boolean;
  preAction?: () => Promise<boolean>;
}

type ModalType =
  | "kycVerification"
  | "upgrade"
  | "requiredPin"
  | "required2fa"
  | "2fa"
  | "2faPIN"
  | "PIN"
  | null;

const KycManager: React.FC<TKycManager> = ({
  action,
  func,
  children,
  isManual,
  preAction,
}) => {
  const [modal, setModal] = useState<ModalType>(null);
  const user: UserState = useSelector((state: any) => state.user);

  const { level, isNA } = formatAccountLevel(user.user?.accountLevel);
  const userKycLevel = isNA ? 0 : (level ?? 0);

  const validateAndExecute = async () => {
    const rules = KYC_RULES[userKycLevel];

    if (userKycLevel === 0) {
      setModal("kycVerification");
      return;
    }

    if (!rules?.allowedActions.includes(action)) {
      setModal("upgrade");
      return;
    }

    const requires2FA = ACTIONS_REQUIRING_2FA.includes(action);
    const requiresPIN = ACTIONS_REQUIRING_PIN.includes(action);
    const has2FA = !!user?.user?.twoFactorAuthEnabled;
    const hasPIN = !!user?.user?.wallet?.pinSet;

    // 1. Initial Missing Requirement Checks (Stops flow BEFORE any API call)
    if (requires2FA) {
      if (requiresPIN && !hasPIN) {
        setModal("requiredPin");
        return;
      }
      if (!has2FA) {
        setModal("required2fa");
        return;
      }
    } else if (requiresPIN) {
      if (!hasPIN) {
        setModal("requiredPin");
        return;
      }
    }

    // 2. Execute Pre-Action (e.g. form submission API call) ONLY if all requirements are met
    if (preAction) {
      const success = await preAction();
      if (!success) return; // Stop if the preAction fails
    }

    // 3. Requirements met AND preAction succeeded. Now open the Security Input Modal.
    if (requires2FA) {
      if (has2FA && hasPIN) {
        setModal("2faPIN");
        return;
      }
      if (has2FA && !hasPIN) {
        setModal("2fa");
        return;
      }
      return;
    }

    if (requiresPIN) {
      setModal("PIN");
      return;
    }

    // 4. No security needed, just execute the final function
    func();
  };

  const is2fa = modal === "2fa";
  const is2faPIN = modal === "2faPIN";
  const closeModal = () => setModal(null);

  const secMode = is2fa
    ? "TWO_FA_ONLY"
    : is2faPIN
      ? "TWO_FA_AND_PIN"
      : undefined;

  return (
    <>
      {children(validateAndExecute)}
      {modal === "kycVerification" && <KycVerification close={closeModal} />}
      {modal === "upgrade" && <KycUpgrade close={closeModal} />}

      {Boolean(modal === "2fa" || modal === "2faPIN" || modal === "PIN") && (
        <SecurityVerification
          key={secMode}
          func={func}
          close={closeModal}
          mode={
            modal === "2fa"
              ? "TWO_FA_ONLY"
              : modal === "2faPIN"
                ? "TWO_FA_AND_PIN"
                : "PIN"
          }
          isManual={isManual}
        />
      )}

      <ModalTemplate
        isOpen={modal === "required2fa" || modal === "requiredPin"}
        primary={false}
        onClose={closeModal}
        key={modal}
      >
        <div className="flex flex-col gap-2 my-3">
          <div className="rounded-full size-12 grid bg-muted place-items-center border">
            <Lock className="text-red-600" />
          </div>
          <Head
            header={
              modal === "requiredPin"
                ? "Enable PIN"
                : modal === "required2fa"
                  ? "Enable 2FA"
                  : ""
            }
            subHeader={
              modal === "requiredPin"
                ? "Enable PIN to continue"
                : modal === "required2fa"
                  ? "Enable two factor authentication to continue"
                  : ""
            }
          />
          <Link
            to={APP_ROUTES.SETTINGS.SECURITY}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-fit py-2 px-6 h-fit text-sm mt-6",
            )}
          >
            Go to settings
          </Link>
        </div>
      </ModalTemplate>
    </>
  );
};

export default KycManager;
