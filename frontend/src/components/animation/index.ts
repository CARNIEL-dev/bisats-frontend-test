import { Variants } from "motion";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Adjust this value for speed (0.1s between each child)
      delayChildren: 0.2, // Optional: delay before animation starts
      ease: "easeInOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ease: "easeInOut", duration: 0.4 },
  },
  exit: {
    opacity: 0,
    x: -120,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.3, // Optional: delay before animation starts
      staggerChildren: 0.6, // Delay between each child animation
    },
  },
};

const slideUpSmallVariant: Variants = {
  hidden: { y: 15, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "anticipate",
    },
  },
};
const slideUpVariant: Variants = {
  hidden: { y: 100, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: "anticipate",
    },
  },
};

const slideInLeft: Variants = {
  hidden: {
    x: 120,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,

    transition: {
      duration: 0.8,
      ease: "backOut",
    },
  },
};

const slideInRight: Variants = {
  hidden: {
    x: -120,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
  },
};

const revealUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
    scaleY: 0.2,
  },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transformOrigin: "bottom",
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    scaleY: 0.2,
    transformOrigin: "top",
  },
};

export {
  containerVariants,
  itemVariants,
  container,
  slideUpVariant,
  slideInLeft,
  slideInRight,
  revealUpVariant,
  slideUpSmallVariant,
};
