import { useEffect, useRef } from "react";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const useInactivityTimeout = (isActive: boolean) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        window.dispatchEvent(new Event("session-expired"));
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer immediately
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [isActive]);
};

export default useInactivityTimeout;
