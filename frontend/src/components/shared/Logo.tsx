import Logo from "@/assets/logo/blackTextLogo.png";
import LogoWhite from "@/assets/logo/Logo.png";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/utils";
import { Link } from "react-router-dom";
const BisatLogo = ({
  className,
  reload = true,
  variant,
  link,
}: {
  className?: string;
  reload?: boolean;
  variant?: "light" | "dark";
  link?: string;
}) => {
  const { resolvedTheme } = useTheme();

  // If variant is explicitly provided, use it.
  // Otherwise, use resolvedTheme (or theme if resolvedTheme isn't available)
  const currentVariant =
    variant || (resolvedTheme === "dark" ? "light" : "dark");
  // Note: resolvedTheme is "dark" -> use LogoWhite (which corresponds to our "light" variant logic in terms of image)
  // Wait, let's look at the original code: src={variant === "dark" ? Logo : LogoWhite}
  // So "dark" variant is Logo (black text), "light" variant is LogoWhite (white text).
  // In Dark Mode (theme="dark"), we want LogoWhite (white text).

  const logoSrc = currentVariant === "dark" ? Logo : LogoWhite;

  const content = (
    <img
      className={cn(
        "w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8",
        className,
      )}
      alt="Bisats Logo"
      src={logoSrc}
    />
  );

  if (reload) {
    return (
      <a href={link || "/"} className="cursor-pointer">
        {content}
      </a>
    );
  }

  return (
    <Link to={link || "/"} className="cursor-pointer">
      {content}
    </Link>
  );
};

export default BisatLogo;
