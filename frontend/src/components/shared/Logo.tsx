import Logo from "@/assets/logo/blackTextLogo.png";
import LogoWhite from "@/assets/logo/Logo.png";
import { cn } from "@/utils";
import { Link } from "react-router-dom";
const BisatLogo = ({
  className,
  reload = true,
  variant = "dark",
}: {
  className?: string;
  reload?: boolean;
  variant?: "light" | "dark";
}) => {
  return (
    <>
      {reload ? (
        <a href="/" className="cursor-pointer">
          <img
            className={cn(
              "w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8",
              className
            )}
            alt="Bisats Logo"
            src={variant === "dark" ? Logo : LogoWhite}
          />
        </a>
      ) : (
        <Link to="/" className="cursor-pointer">
          <img
            className={cn(
              "w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8",
              className
            )}
            alt="Bisats Logo"
            src={variant === "dark" ? Logo : LogoWhite}
          />
        </Link>
      )}
    </>
  );
};

export default BisatLogo;
