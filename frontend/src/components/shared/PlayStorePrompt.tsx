import PlayStoreSVG from "@/assets/icons/playstore-svg";
import { InputCheck } from "@/components/Inputs/CheckBox";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { Button, buttonVariants } from "@/components/ui/Button";
import { STORE_URL } from "@/constants";
import { cn } from "@/utils";
import { useState } from "react";

const PlayStoreBadge = () => <PlayStoreSVG className="size-6 shrink-0" />;
const PlayStoreIcon = () => <PlayStoreSVG className="size-16" />;

const PLAY_STORE_URL = STORE_URL.playstore;

const PlayStorePrompt = () => {
  const [showModal, setShowModal] = useState(() => {
    const permanentlyDismissed = localStorage.getItem(
      "playStorePromptDismissed",
    );
    const sessionDismissed = sessionStorage.getItem("playStorePromptShown");
    return !permanentlyDismissed && !sessionDismissed;
  });

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("playStorePromptDismissed", "true");
    } else {
      sessionStorage.setItem("playStorePromptShown", "true");
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <ModalTemplate
      isOpen={showModal}
      onClose={handleClose}
      primary={false}
      showCloseButton={false}
      className="md:max-w-lg p-0 overflow-hidden"
    >
      {/* Dark gradient header */}
      <div className="relative bg-gradient-to-br from-[#0A0E12] via-[#0f1e2e] to-[#1C2F42] px-6 pt-8 pb-10 rounded-t-lg overflow-hidden">
        {/* Decorative glowing dots */}
        <span className="absolute top-4 left-6 size-1.5 rounded-full bg-[#F5BB00] opacity-60" />
        <span className="absolute top-8 left-14 size-1 rounded-full bg-[#F5BB00] opacity-30" />
        <span className="absolute top-3 right-10 size-2 rounded-full bg-[#F5BB00] opacity-40" />
        <span className="absolute top-10 right-6 size-1 rounded-full bg-amber-300 opacity-25" />
        <span className="absolute bottom-6 left-4 size-1 rounded-full bg-[#F5BB00] opacity-20" />
        <span className="absolute bottom-4 right-16 size-1.5 rounded-full bg-amber-400 opacity-30" />

        {/* Subtle radial glow behind icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-40 rounded-full bg-[#F5BB00]/5 blur-2xl" />
        </div>

        {/* Announcement pill */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 border-[0.5px] border-primary text-primary text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            Now on Google Play
          </span>
        </div>

        {/* Play Store icon with glow ring */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center size-24 rounded-2xl bg-white/5 ring-1 ring-[#F5BB00]/30 shadow-[0_0_32px_rgba(245,187,0,0.2)]">
            <PlayStoreIcon />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-4 px-6 pt-6 pb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F5BB00] to-amber-400 bg-clip-text text-transparent leading-tight">
            Bisats is on Google Play!
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The wait is over — trade crypto, manage your wallet, and track your
            portfolio on the go. Download the Bisats app now and take control of
            your finances from anywhere.
          </p>
        </div>

        {/* Play Store download button */}
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full justify-center gap-3 text-sm py-6 bg-[#0A0E12] hover:bg-[#0A0E12]/90 text-white dark:bg-white dark:text-[#0A0E12] dark:hover:bg-white/90",
          )}
        >
          <PlayStoreBadge />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[9px] opacity-75 font-normal uppercase tracking-wider">
              Get it on
            </span>
            <span className="text-base font-semibold -mt-0.5">Google Play</span>
          </span>
        </a>

        {/* Close button */}
        <Button
          onClick={handleClose}
          variant="outline"
          className="w-full text-sm py-5"
        >
          Maybe Later
        </Button>

        {/* Don't show again checkbox */}
        <div className="flex items-center justify-center gap-2 font-semibold text-xs text-muted-foreground">
          <InputCheck
            type="checkbox"
            name="dontShowPlayStorePrompt"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          <p>Don't Show Me Again</p>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default PlayStorePrompt;
