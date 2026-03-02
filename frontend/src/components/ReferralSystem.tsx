import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { GetUserDetails } from "@/redux/actions/userActions";
import Bisatsfetch from "@/redux/fetchWrapper";
import { cn } from "@/utils";
import { CheckCircle, Copy, Loader2, Sparkles, Users } from "lucide-react"; // Added CheckCircle
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import CopyButton from "./shared/CopyButton";
import ShareButton from "./shared/ShareButton";
import { Confetti, ConfettiRef } from "./ui/confetti";

const triggerSideCannons = (instance: ConfettiRef) => {
  if (!instance) return;

  const end = Date.now() + 5 * 1000; // 5 seconds
  const colors = ["#f5bb00", "#a786ff", "#fd8bbc", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    // Left Cannon
    instance.fire({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });

    // Right Cannon
    instance.fire({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

const ReferralSystem = () => {
  const userState = useSelector((state: any) => state.user); // Adjusted type for snippet
  const user = userState.user;

  const confettiRef = useRef<ConfettiRef>(null);

  const [isJoined, setIsJoined] = useState(Boolean(user?.referralCode));
  const [referralCode, setReferralCode] = useState(user?.referralCode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessView, setIsSuccessView] = useState(false);

  const joinReferralProgram = async () => {
    setIsLoading(true);

    try {
      const response = await Bisatsfetch("/api/v1/user/referral-code", {
        method: "GET",
      });

      if (response && response.status && response.data) {
        const code =
          response.data.referralCode || response.data.code || response.data;
        if (typeof code === "string") {
          setReferralCode(code);
          setIsJoined(true);

          // DO NOT close modal. Instead, switch to success view & fire confetti
          setIsSuccessView(true);
          triggerSideCannons(confettiRef.current);

          await GetUserDetails({ userId: user?.userId, token: user?.token });
          Toast.success(
            "Successfully joined the Referral Programme!",
            "Referral System",
          );
        } else {
          throw new Error("Invalid code format received from server");
        }
      } else {
        throw new Error(
          response?.message || "Failed to generate referral code",
        );
      }
    } catch (error: any) {
      Toast.error(
        error?.message || "An error occurred while joining.",
        "Referral System",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: Reset success view after modal closes so it's fresh if ever reopened
    setTimeout(() => setIsSuccessView(false), 300);
  };

  const referralLink = `${window.location.origin}${APP_ROUTES.AUTH.SIGNUP}?ref=${referralCode}`;

  return (
    <>
      <Confetti
        ref={confettiRef}
        manualstart={true}
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      <div className="flex flex-col gap-6 p-6 border rounded-2xl bg-white shadow-sm relative overflow-hidden mx-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#515B6E] flex items-center gap-2">
              <div className="rounded-full w-fit p-2 bg-green-500/20">
                <Users className="size-5 text-green-600" />
              </div>
              Referral Program
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Invite your friends to the platform and earn rewards for every
              successful registration and trade!
            </p>
          </div>
          {!isJoined && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-all"
              onClick={() => {
                setIsSuccessView(false); // Ensure we start on the info screen
                setIsModalOpen(true);
              }}
              size={"sm"}
            >
              Join Referral Programme
            </Button>
          )}
        </div>

        {isJoined && (
          <div className={cn("grid gap-6 transition-all duration-700")}>
            <div className="h-px w-full bg-gray-100" />

            <div className="grid md:grid-cols-2 gap-8 md:gap-6">
              {/* Referral Link */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Your Referral Link
                </label>
                <div className="flex bg-gray-50 border rounded-xl focus-within:ring-2 focus-within:ring-green-500/20 p-1.5 items-center transition-all">
                  <input
                    type="text"
                    className="w-full bg-transparent border-none outline-none text-gray-600 font-mono text-sm px-3 py-1.5 truncate"
                    value={referralLink}
                    readOnly
                  />
                  <div className="flex items-center gap-1.5 pr-1 pl-2 border-l border-gray-200">
                    <CopyButton
                      text={referralLink}
                      type="link"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50"
                      title="Copy Link"
                    />
                    <ShareButton
                      referralLink={referralLink}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50"
                      title="Share Link"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Share this link directly with your friends. The code is
                  already included!
                </p>
              </div>

              {/* Referral Code */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Referral Code
                </label>
                <div className="flex gap-3 items-center justify-between p-2.5 border rounded-xl bg-green-50/50 transition-all duration-500 ring-0 border-green-200">
                  <span className="font-mono text-xl font-bold text-green-700 tracking-widest pl-3 select-all">
                    {referralCode}
                  </span>
                  <CopyButton
                    text={referralCode}
                    type="code"
                    variant="secondary"
                    size="sm"
                    className="bg-white hover:bg-gray-50 text-gray-700 border shadow-sm h-9 px-4 rounded-lg"
                    showText={true}
                  >
                    <Copy className="size-4 mr-2" /> Copy Code
                  </CopyButton>
                </div>
                <p className="text-xs text-gray-500">
                  Your friends can also enter this code manually during
                  registration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalTemplate isOpen={isModalOpen} onClose={handleCloseModal}>
        <AnimatePresence mode="wait">
          {!isSuccessView ? (
            // --- VIEW 1: JOIN PROGRAMME DETAILS ---
            <div key="join-view" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Join Referral Programme
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm">
                Become a part of our exclusive referral program. By joining,
                you'll receive a unique code to share with your network. Earn
                rewards and bonuses every time someone registers and transacts
                on our P2P platform using your link.
              </p>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100 mt-2">
                <h4 className="font-medium text-green-800 text-sm mb-2">
                  Benefits include:
                </h4>
                <ul className="text-sm text-green-700 space-y-1.5 list-disc list-inside">
                  <li>Earn a percentage of fees on referrals</li>
                  <li>Exclusive access to premium features</li>
                  <li>Track your referrals in real-time</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={joinReferralProgram}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[120px] w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      {" "}
                      <Loader2 className="animate-spin" /> Joining...
                    </>
                  ) : (
                    "Join Now"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // --- VIEW 2: SUCCESS STATE ---
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="flex flex-col items-center justify-center gap-3 py-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">You're In!</h2>

              <p className="text-gray-500 text-sm max-w-[280px]">
                Congratulations! Your unique referral code has been generated
                successfully.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full mt-4 flex flex-col items-center">
                <p className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wider">
                  Your Code
                </p>
                <p className="text-2xl font-mono font-bold text-green-800 tracking-widest">
                  {referralCode}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalTemplate>
    </>
  );
};

export default ReferralSystem;
