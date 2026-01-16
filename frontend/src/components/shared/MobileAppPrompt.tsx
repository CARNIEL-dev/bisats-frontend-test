import mobileAppImage from "@/assets/illustrations/mobile-app_prompt.svg";
import { InputCheck } from "@/components/Inputs/CheckBox";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

const MobileAppPrompt = () => {
  const [showModal, setShowModal] = useState(() => {
    const permanentlyDismissed = localStorage.getItem("appPromptDismissed");
    const sessionDismissed = sessionStorage.getItem("appPromptShown");

    return !permanentlyDismissed && !sessionDismissed;
  });

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("appPromptDismissed", "true");
    } else {
      sessionStorage.setItem("appPromptShown", "true");
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <ModalTemplate
      isOpen={showModal}
      onClose={handleClose}
      primary={false}
      className="md:max-w-md"
    >
      <div className="flex flex-col gap-4 mt-10">
        <img
          src={mobileAppImage}
          alt="Mobile phone"
          className="w-full h-[13rem] object-cover rounded-xl"
        />
        <h2 className="text-xl font-semibold">
          Bisats Web App at Your Fingertips
        </h2>
        <p className="leading-7 text-sm text-gray-600">
          Add the Bisats web app directly to your phone’s home screen for
          faster, seamless access—trade instantly without opening your browser
        </p>

        <Link
          to={"#"}
          className={cn(buttonVariants({ size: "lg" }), "text-sm py-6")}
        >
          Learn More
        </Link>

        {/* Checkbox Logic */}
        <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-600 mt-3">
          <InputCheck
            type="checkbox"
            name="agreeToTerms"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          <p>Don't Show Me Again</p>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default MobileAppPrompt;
