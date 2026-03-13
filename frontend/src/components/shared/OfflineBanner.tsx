import useOnlineStatus from "@/hooks/useOnlineStatus";

import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-1.5 bg-primary/95 text-black text-[11px] font-medium py-1.5 px-3 backdrop-blur-sm shadow-sm animate-pulse"
        >
          <WifiOff className="size-3 shrink-0" />
          <span>You&apos;re offline — Internet connection lost</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
