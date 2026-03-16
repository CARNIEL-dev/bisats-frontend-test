import BisatLogo from "@/components/shared/Logo";
import { cn } from "@/utils";
import { motion } from "motion/react";
import { PuffLoader } from "react-spinners";

type Props = {
  primary?: boolean;
  fullscreen?: boolean;
};

const PreLoader = ({ primary = true, fullscreen = false }: Props) => {
  if (fullscreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <BisatLogo className="scale-125 md:scale-150" />
        </motion.div>

        <motion.div
          className="mt-8 h-1 w-24 overflow-hidden rounded-full bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full w-full rounded-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center",
        primary && "animate-pulse mt-10"
      )}
    >
      {primary ? (
        <BisatLogo className="md:scale-110" />
      ) : (
        <PuffLoader
          color={"#F5BB00"}
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
          size={100}
        />
      )}
    </div>
  );
};

export default PreLoader;
