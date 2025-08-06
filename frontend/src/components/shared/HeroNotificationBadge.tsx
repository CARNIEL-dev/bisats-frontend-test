import bisatLogo from "@/assets/logo/logo-icon.svg";
import { cn } from "@/utils";

type Props = {
  className?: string;
  subText?: string;
  text: string | JSX.Element;
  logo?: string;
};
const HeroNotificationBadge = ({ className, subText, text, logo }: Props) => {
  return (
    <article
      className={cn(
        "flex w-fit min-w-[18rem] items-center gap-3 p-2.5 border bg-white/20 rounded-lg backdrop-blur-md scale-[63%] lg:scale-[88%]",
        className
      )}
    >
      <div className="border p-1.5 rounded-sm">
        <img src={logo || bisatLogo} alt="bisat logo" className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-medium text-gray-800">{text}</div>
        <p className="text-[11px] text-gray-500">{subText}</p>
      </div>
    </article>
  );
};

export default HeroNotificationBadge;
