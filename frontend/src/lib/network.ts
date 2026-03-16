import { onlineManager } from "@tanstack/react-query";

const PROBE_URL = "https://www.gstatic.com/generate_204";
const PROBE_TIMEOUT = 3000;
const INITIAL_PROBE_INTERVAL = 10000; // Start at 10 seconds
const MAX_PROBE_INTERVAL = 60000; // Cap at 1 minute

let intervalId: ReturnType<typeof setInterval> | null = null;
let currentInterval = INITIAL_PROBE_INTERVAL;

const cleanup = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  currentInterval = INITIAL_PROBE_INTERVAL;
};

// The core function to check actual internet access
const verifyInternetAccess = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);

    const res = await fetch(`${PROBE_URL}?t=${Date.now()}`, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);
    // no-cors returns an opaque response (status 0), so a non-throwing fetch means we're online
    return res.type === "opaque" || res.ok;
  } catch {
    return false;
  }
};

// Override TanStack Query's default online listener
onlineManager.setEventListener((setOnline) => {
  const updateOnlineStatus = async () => {
    const isActuallyOnline = await verifyInternetAccess();
    setOnline(isActuallyOnline);

    if (!isActuallyOnline && !intervalId) {
      const retryHandler = async () => {
        const backOnline = await verifyInternetAccess();
        if (backOnline) {
          setOnline(true);
          cleanup();
        } else {
          // ✅ Exponential backoff: double the interval up to max
          currentInterval = Math.min(currentInterval * 2, MAX_PROBE_INTERVAL);
          if (intervalId) {
            clearInterval(intervalId);
          }
          intervalId = setInterval(retryHandler, currentInterval);
        }
      };

      intervalId = setInterval(retryHandler, currentInterval);
    }
  };

  // 1. Hardware event listeners (Immediate triggers)
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", () => {
    setOnline(false); // Instant UI feedback on hard disconnect
    updateOnlineStatus(); // Verify and start polling
  });

  // 2. Initial check on load
  updateOnlineStatus();

  return () => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", () => setOnline(false));
    cleanup();
  };
});
