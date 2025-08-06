import Logo from "@/assets/logo/blackTextLogo.png";
import { cn } from "@/utils";
import { Link } from "react-router-dom";
const BisatLogo = ({
  className,
  reload = true,
}: {
  className?: string;
  reload?: boolean;
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
            src={Logo}
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
            src={Logo}
          />
        </Link>
      )}
    </>
  );
};

export default BisatLogo;
