import { useSyncExternalStore } from "react";
import { onlineManager } from "@tanstack/react-query";

/**
 * Subscribes to TanStack Query's global online state.
 * This is incredibly lightweight and triggers 0 unnecessary re-renders.
 */
const useOnlineStatus = (): boolean => {
  return useSyncExternalStore(
    onlineManager.subscribe,
    () => onlineManager.isOnline(),
    () => onlineManager.isOnline(), // Server-side fallback
  );
};

export default useOnlineStatus;
