import { useCallback, useEffect, useRef } from "react";
import { isProduction } from "@/utils";

const INACTIVITY_TIMEOUT = isProduction ? 15 * 60 * 1000 : 2 * 60 * 1000;

const useInactivityTimeout = (isActive: boolean) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (delay: number = INACTIVITY_TIMEOUT) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        window.dispatchEvent(new Event("inactivity-warning"));
      }, delay);
    },
    [clearTimer],
  );

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (!isActive) return;
    startTimer();
  }, [isActive, startTimer]);

  useEffect(() => {
    if (!isActive) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer immediately
    resetTimer();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden — pause the timer (don't fire while user is away)
        clearTimer();
      } else {
        // Tab visible again — check how long user was away
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= INACTIVITY_TIMEOUT) {
          window.dispatchEvent(new Event("inactivity-warning"));
        } else {
          startTimer(INACTIVITY_TIMEOUT - elapsed);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimer();
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, resetTimer, clearTimer, startTimer]);

  return { resetTimer };
};

export default useInactivityTimeout;
