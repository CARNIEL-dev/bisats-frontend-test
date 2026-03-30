import BackButton from "@/components/shared/BackButton";
import { motion } from "motion/react";
import { container, slideUpSmallVariant } from "@/components/animation";

const ComingSoon = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex items-center justify-center min-h-[85dvh] px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center max-w-lg gap-4"
      >
        <motion.div
          variants={slideUpSmallVariant}
          className="size-20 md:size-24 rounded-full bg-primary/10 flex items-center justify-center mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-10 md:size-12 text-primary"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </motion.div>

        <motion.h1
          variants={slideUpSmallVariant}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          Coming Soon
        </motion.h1>

        <motion.p
          variants={slideUpSmallVariant}
          className="text-muted-foreground"
        >
          The <span className="text-primary font-semibold">{title}</span> page
          is currently under development.{" "}
          {description ||
            "We're working hard to bring you something great. Stay tuned!"}
        </motion.p>

        <motion.div variants={slideUpSmallVariant} className="mt-4">
          <BackButton />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
