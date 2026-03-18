import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  onClick,
  className,
  text,
  variant = "primary",
}: {
  className?: string;
  onClick?: () => void;
  text?: string;
  variant?: "primary" | "secondary";
}) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="secondary"
      onClick={onClick ? onClick : () => navigate(-1)}
      className={cn("w-fit", className)}
      type="button"
    >
      {variant === "primary" ? <ArrowLeft /> : <ChevronLeft />}
      {text || "Back"}
    </Button>
  );
};

export default BackButton;
