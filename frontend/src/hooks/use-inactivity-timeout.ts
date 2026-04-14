import { useCallback, useEffect, useRef } from "react";
import { isProduction } from "@/utils";

const INACTIVITY_TIMEOUT = isProduction ? 15 * 60 * 1000 : 2 * 60 * 1000;

const useInactivityTimeout = (isActive: boolean) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isActive) return;
    timerRef.current = setTimeout(() => {
      window.dispatchEvent(new Event("inactivity-warning"));
    }, INACTIVITY_TIMEOUT);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer immediately
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isActive, resetTimer]);

  return { resetTimer };
};

export default useInactivityTimeout;
