import Logo from "@/assets/logo/blackTextLogo.png";
import { cn } from "@/utils";
const BisatLogo = ({ className }: { className?: string }) => {
  return (
    <a href="/" className="cursor-pointer">
      <img
        className={cn(
          "w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8",
          className
        )}
        alt="Bisats Logo"
        src={Logo}
      />
    </a>
  );
};

export default BisatLogo;
