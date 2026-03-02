import {
  Battery,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Play,
  PlusSquare,
  RotateCcw,
  Share,
  Signal,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const APP_URL = window.location.origin;

export default function MockApp() {
  const [phase, setPhase] = useState("0_idle");
  const [currentTime, setCurrentTime] = useState("9:41");
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    const date = new Date();
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    setCurrentTime(`${hours}:${minutes}`);

    // Cleanup timeouts on unmount to optimize performance
    return () => clearTimeouts();
  }, []);

  const clearTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const schedule = (fn: () => void, delay: number): number => {
    const id = window.setTimeout(fn, delay);
    timeoutRefs.current.push(id);
    return id;
  };

  const playFullSequence = () => {
    clearTimeouts();
    setPhase("0_idle");
    schedule(() => setPhase("1_tap_share"), 500);
    schedule(() => setPhase("2_share_sheet"), 1000);
    schedule(() => setPhase("3_tap_add_to_home"), 2500);
    schedule(() => setPhase("4_add_modal"), 3000);
    schedule(() => setPhase("5_tap_add_confirm"), 5000);
    schedule(() => setPhase("6_home_screen"), 5500);
    schedule(() => setPhase("7_tap_app_icon"), 7000);
    schedule(() => setPhase("8_app_splash"), 7500);
    schedule(() => setPhase("9_app_loaded"), 8300);
  };

  const playStep1 = () => {
    clearTimeouts();
    setPhase("0_idle");
    schedule(() => setPhase("1_tap_share"), 500);
    schedule(() => setPhase("2_share_sheet"), 1000);
  };

  const playStep2 = () => {
    clearTimeouts();
    setPhase("2_share_sheet"); // Jump straight to share sheet open
    schedule(() => setPhase("3_tap_add_to_home"), 500);
    schedule(() => setPhase("4_add_modal"), 1000);
    schedule(() => setPhase("5_tap_add_confirm"), 3000);
  };

  const playStep3 = () => {
    clearTimeouts();
    setPhase("6_home_screen"); // Jump straight to home screen
    schedule(() => setPhase("7_tap_app_icon"), 500);
    schedule(() => setPhase("8_app_splash"), 1000);
    schedule(() => setPhase("9_app_loaded"), 1800);
  };

  const dummyApps = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center gap-1 opacity-60"
        >
          <div
            className={`w-[60px] h-[60px] rounded-2xl bg-gradient-to-br ${getGradient(i)} shadow-sm`}
          ></div>
        </div>
      )),
    [],
  );

  function getGradient(i: number) {
    const gradients = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-500",
      "from-red-400 to-red-500",
      "from-yellow-400 to-orange-500",
      "from-purple-400 to-purple-600",
      "from-gray-700 to-gray-900",
      "from-pink-400 to-pink-500",
      "from-teal-400 to-teal-600",
    ];
    return gradients[i % gradients.length];
  }

  // Helper to draw a tapping finger indicator
  const FingerTap = ({ isTapping }: { isTapping: boolean }) => (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/40 rounded-full pointer-events-none z-[100] transition-all duration-300 ${isTapping ? "scale-100 opacity-100" : "scale-150 opacity-0"}`}
    >
      <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col md:flex-row items-center justify-center p-6 gap-8 lg:gap-16 overflow-hidden">
      {/* Left side: Explanation & Controls */}
      <div className="max-w-md w-full flex flex-col gap-6 z-10">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Install Bisats App
          </h1>
          <p className="text-neutral-400 text-base lg:text-lg">
            A step-by-step motion graphic showing exactly how users can save{" "}
            <span className="text-white font-medium">bisats.com</span> directly
            to their device for a native app experience.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={playStep1}
            className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${phase === "0_idle" || phase === "1_tap_share" || phase === "2_share_sheet" ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-neutral-900/50 border-neutral-800 text-neutral-500"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 font-semibold text-sm lg:text-base">
                <Share size={18} /> 1. Share Menu
              </div>
              <Play
                size={16}
                className={
                  phase.startsWith("1") || phase.startsWith("2")
                    ? "opacity-100"
                    : "opacity-30"
                }
              />
            </div>
            <p className="text-xs lg:text-sm opacity-80">
              Open the website in your browser and tap the Share icon in the
              bottom navigation bar.
            </p>
          </button>

          <button
            onClick={playStep2}
            className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${phase === "3_tap_add_to_home" || phase === "4_add_modal" || phase === "5_tap_add_confirm" ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-neutral-900/50 border-neutral-800 text-neutral-500"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 font-semibold text-sm lg:text-base">
                <PlusSquare size={18} /> 2. Add to Home Screen
              </div>
              <Play
                size={16}
                className={
                  phase.startsWith("3") ||
                  phase.startsWith("4") ||
                  phase.startsWith("5")
                    ? "opacity-100"
                    : "opacity-30"
                }
              />
            </div>
            <p className="text-xs lg:text-sm opacity-80">
              Select "Add to Home Screen" from the menu and confirm the app name
              and icon.
            </p>
          </button>

          <button
            onClick={playStep3}
            className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${phase === "6_home_screen" || phase === "7_tap_app_icon" || phase === "8_app_splash" || phase === "9_app_loaded" ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-neutral-900/50 border-neutral-800 text-neutral-500"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 font-semibold text-sm lg:text-base">
                <Zap size={18} /> 3. Native App Launch
              </div>
              <Play
                size={16}
                className={
                  phase.startsWith("6") ||
                  phase.startsWith("7") ||
                  phase.startsWith("8") ||
                  phase.startsWith("9")
                    ? "opacity-100"
                    : "opacity-30"
                }
              />
            </div>
            <p className="text-xs lg:text-sm opacity-80">
              The site behaves exactly like an iOS app, launching instantly in
              full-screen mode.
            </p>
          </button>
        </div>

        <button
          onClick={playFullSequence}
          className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] mt-2"
        >
          {phase === "0_idle" ? (
            <>
              <Play size={20} className="fill-black" /> Play Full Demo
            </>
          ) : (
            <>
              <RotateCcw size={20} /> Restart Full Demo
            </>
          )}
        </button>
      </div>

      {/* Right side: iPhone Simulation */}
      <div className="relative z-10 perspective-[1000px] shrink-0 transform scale-90 lg:scale-100">
        {/* Decorative glow behind phone */}
        <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full scale-150 -z-10"></div>

        {/* iPhone Frame */}
        <div className="w-[320px] h-[680px] bg-black rounded-[55px] border-[12px] border-neutral-900 relative shadow-2xl overflow-hidden ring-1 ring-neutral-800">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-neutral-800 border-[0.5px] border-neutral-700"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-800 border-[0.5px] border-neutral-700"></div>
          </div>

          {/* iOS Status Bar */}
          <div className="absolute top-0 w-full h-12 flex items-center justify-between px-6 z-40 text-white pt-2 mix-blend-difference">
            <span className="text-sm font-semibold">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal size={14} className="fill-white" />
              <Wifi size={14} />
              <Battery size={16} className="fill-white" />
            </div>
          </div>

          {/* SCREEN CONTENT WRAPPER */}
          <div className="w-full h-full relative overflow-hidden bg-black">
            {/* --- LAYER 1: HOME SCREEN (Always bottom layer, visible later) --- */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>

              <div className="absolute inset-0 pt-16 px-4 pb-24 z-10 flex flex-col justify-between">
                <div className="grid grid-cols-4 gap-x-2 gap-y-6">
                  {/* Target App Icon */}
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <div
                      className={`w-[60px] h-[60px] rounded-2xl bg-black flex items-center justify-center shadow-lg border border-neutral-800 z-10 transition-transform duration-200 ${phase === "7_tap_app_icon" ? "scale-90 brightness-75" : "scale-100"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl italic">
                          B
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-white shadow-sm drop-shadow-md">
                      Bisats
                    </span>
                    {/* Simulated Tap on Home Icon */}
                    <FingerTap isTapping={phase === "7_tap_app_icon"} />
                  </div>
                  {dummyApps.slice(0, 19)}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 h-[84px] bg-white/20 backdrop-blur-xl rounded-[30px] z-10 flex items-center justify-around px-2">
                {dummyApps.slice(20, 24)}
              </div>
            </div>

            {/* --- LAYER 2: SAFARI BROWSER (Fades out when going to home screen) --- */}
            <div
              className={`absolute inset-0 bg-white z-20 transition-all duration-700 ${parseInt(phase.split("_")[0]) >= 6 ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}`}
            >
              {/* Fake Safari Top Address Bar */}
              <div className="absolute top-0 w-full pt-14 pb-2 px-4 bg-[#f8f8f8] border-b border-gray-200 z-30 flex items-center justify-center">
                <div className="bg-white border border-gray-300 rounded-xl px-4 py-2 w-full flex items-center justify-between shadow-sm">
                  <span className="text-xs text-gray-500 font-medium">AA</span>
                  <div className="flex items-center gap-1">
                    <span className="text-black text-sm font-semibold">
                      www.bisats.com
                    </span>
                  </div>
                  <RotateCcw size={14} className="text-gray-500" />
                </div>
              </div>

              {/* Safari Content (Iframe) */}
              <div className="absolute inset-0 pt-24 pb-20 pointer-events-none">
                <iframe
                  src={APP_URL}
                  className="w-full h-full border-none pointer-events-none"
                  title="Bisats Safari View"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                  tabIndex={-1}
                />
              </div>

              {/* Fake Safari Bottom Navigation Bar */}
              <div className="absolute bottom-0 w-full h-20 bg-[#f8f8f8]/95 backdrop-blur-md border-t border-gray-200 z-30 flex items-start justify-between px-6 pt-3 text-blue-500">
                <ChevronLeft size={24} className="opacity-50" />
                <ChevronRight size={24} className="opacity-50" />

                {/* Share Button with Tap Indicator */}
                <div className="relative">
                  <Share
                    size={24}
                    className={`transition-all duration-200 ${phase === "1_tap_share" ? "scale-90 opacity-70" : ""}`}
                  />
                  <FingerTap isTapping={phase === "1_tap_share"} />
                </div>

                <BookOpen size={24} />
                <Copy size={24} />
              </div>

              {/* --- OVERLAY 2A: SHARE SHEET --- */}
              <div
                className={`absolute inset-0 bg-black/40 z-40 transition-opacity duration-300 ${parseInt(phase.split("_")[0]) >= 2 && parseInt(phase.split("_")[0]) < 6 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {/* Bottom Sheet Menu */}
                <div
                  className={`absolute bottom-4 left-4 right-4 bg-[#f2f2f6] rounded-2xl flex flex-col gap-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${parseInt(phase.split("_")[0]) >= 2 && parseInt(phase.split("_")[0]) < 4 ? "translate-y-0" : "translate-y-[120%]"}`}
                >
                  {/* Share Preview Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-300">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm italic">
                        B
                      </span>
                    </div>
                    <div>
                      <h4 className="text-black text-sm font-bold m-0 leading-tight">
                        Bisats
                      </h4>
                      <p className="text-gray-500 text-xs m-0">bisats.com</p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl text-black border border-gray-100 opacity-60">
                      <span className="text-sm font-medium">Copy Link</span>
                      <Copy size={18} className="text-gray-400" />
                    </div>

                    {/* Target Row: Add to Home Screen */}
                    <div className="relative">
                      <div
                        className={`flex items-center justify-between p-3 bg-white rounded-xl text-black border border-gray-100 transition-colors duration-200 ${phase === "3_tap_add_to_home" ? "bg-gray-200" : ""}`}
                      >
                        <span className="text-sm font-medium">
                          Add to Home Screen
                        </span>
                        <PlusSquare size={18} className="text-gray-500" />
                      </div>
                      <FingerTap isTapping={phase === "3_tap_add_to_home"} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-xl text-black border border-gray-100 opacity-60">
                      <span className="text-sm font-medium">Find on Page</span>
                      <BookOpen size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- OVERLAY 2B: ADD TO HOME CONFIRMATION MODAL --- */}
              <div
                className={`absolute inset-0 bg-[#f2f2f6] z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${parseInt(phase.split("_")[0]) >= 4 && parseInt(phase.split("_")[0]) < 6 ? "translate-y-0" : "translate-y-[100%]"}`}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 pt-14 bg-[#f8f8f8] border-b border-gray-300">
                  <span className="text-blue-500 text-sm font-medium">
                    Cancel
                  </span>
                  <span className="text-black text-sm font-bold">
                    Add to Home Screen
                  </span>

                  {/* Add Button */}
                  <div className="relative">
                    <span
                      className={`text-blue-500 text-sm font-bold transition-opacity ${phase === "5_tap_add_confirm" ? "opacity-50" : "opacity-100"}`}
                    >
                      Add
                    </span>
                    <FingerTap isTapping={phase === "5_tap_add_confirm"} />
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-4 pt-8">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-white font-bold text-2xl italic">
                        B
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 gap-1 border-b border-gray-100 pb-2">
                      <span className="text-black text-sm font-semibold">
                        Bisats
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-[-10px] pt-4">
                    <span className="text-gray-500 text-xs">
                      https://www.bisats.com/
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- LAYER 3: APP LAUNCH / NATIVE PWA --- */}
            <div
              className={`absolute inset-0 z-30 bg-black flex flex-col items-center justify-center origin-top-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                parseInt(phase.split("_")[0]) >= 8
                  ? "opacity-100 scale-100 rounded-none"
                  : "opacity-0 scale-[0.1] rounded-[40px] pointer-events-none"
              }`}
              style={{ transformOrigin: "15% 15%" }}
            >
              {/* Splash Screen (Fades out when loaded) */}
              <div
                className={`transition-opacity duration-300 ${phase === "8_app_splash" ? "opacity-100" : "opacity-0"}`}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-4xl italic">
                    B
                  </span>
                </div>
              </div>

              {/* The Actual Native App (No browser UI!) */}
              <div
                className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 delay-300 pt-12 ${phase === "9_app_loaded" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {parseInt(phase.split("_")[0]) >= 8 && (
                  <iframe
                    src={APP_URL}
                    className="w-full h-full border-none bg-white rounded-b-[40px] pointer-events-none"
                    title="Bisats Native App View"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                    tabIndex={-1}
                  />
                )}

                {/* Home Indicator (iOS bottom bar for apps) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white/50 backdrop-blur-md rounded-full z-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
