import KycUpgrade from "@/components/Modals/KycUpgrade";
import KycVerification from "@/components/Modals/KycVerification";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import SecurityVerification from "@/components/Modals/SecurityVerification";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import Head from "@/pages/wallet/Head";

import { cn } from "@/utils";
import { ACTIONS_REQUIRING_2FA, KYC_RULES } from "@/utils/transaction_limits";

import { Lock } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface TKycManager {
  action: string;
  func: () => void;
  children: (trigger: () => void) => React.ReactNode;
}

const KycManager: React.FC<TKycManager> = ({ action, func, children }) => {
  const [modal, setModal] = useState<string | null>(null);
  const user: UserState = useSelector((state: any) => state.user);

  const userKycLevel =
    user.user?.accountLevel === null
      ? 0
      : user.user?.accountLevel === "level_1"
      ? 1
      : user.user?.accountLevel === "level_2"
      ? 2
      : user.user?.accountLevel === "level_3"
      ? 3
      : 10;

  const validateAndExecute = () => {
    const level = Number(userKycLevel);

    const rules = KYC_RULES[level];

    if (level === 0) {
      setModal("kycVerification");
      return;
    }

    if (!rules?.allowedActions.includes(action)) {
      setModal("upgrade");
      return;
    }

    if (ACTIONS_REQUIRING_2FA.includes(action)) {
      if (user?.user?.twoFactorAuthEnabled && user?.user?.wallet?.pinSet) {
        setModal("2faPIN");
        return;
      }
      if (user?.user?.twoFactorAuthEnabled && !user?.user?.wallet?.pinSet) {
        setModal("2fa");
        return;
      }
      if (!user?.user?.twoFactorAuthEnabled) {
        setModal("required2fa");
        return;
      }
    }

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

      {Boolean(modal === "2fa" || modal === "2faPIN") && (
        <SecurityVerification
          key={secMode}
          func={func}
          close={closeModal}
          mode={modal === "2fa" ? "TWO_FA_ONLY" : "TWO_FA_AND_PIN"}
        />
      )}

      <ModalTemplate
        isOpen={modal === "required2fa"}
        primary={false}
        onClose={closeModal}
      >
        <div className="flex flex-col gap-2 my-3">
          <div className="rounded-full size-12 grid bg-gray-100 place-items-center border">
            <Lock className="text-red-600" />
          </div>
          <Head
            header="Enable 2FA"
            subHeader="Enable two factor authentication to continue"
          />
          <Link
            to={APP_ROUTES.SETTINGS.SECURITY}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-fit py-2 px-6 h-fit text-sm mt-6"
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
