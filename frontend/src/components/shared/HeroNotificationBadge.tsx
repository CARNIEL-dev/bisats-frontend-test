import bisatLogo from "@/assets/logo/logo-icon.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils";
import { Variants } from "motion";
import { motion } from "motion/react";

type Props = {
  className?: string;
  subText?: string;
  text: string | React.ReactElement;
  logo?: string;
  style?: React.CSSProperties;
  variant?: Variants;
};
const HeroNotificationBadge = ({
  className,
  subText,
  text,
  logo,
  style,
  variant,
}: Props) => {
  const isMobile = useIsMobile();
  return (
    <motion.article
      className={cn(
        "flex w-fit min-w-[18rem] items-center gap-3 p-2.5 border bg-white/20 rounded-lg backdrop-blur-md scale-[63%] lg:scale-[88%]",
        className
      )}
      style={{
        scale: isMobile ? 0.63 : 0.85,
      }}
      variants={variant}
    >
      <div className="border p-1.5 rounded-sm">
        <img src={logo || bisatLogo} alt="bisat logo" className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-medium text-gray-800">{text}</div>
        <p className="text-[11px] text-gray-500">{subText}</p>
      </div>
    </motion.article>
  );
};

export default HeroNotificationBadge;
