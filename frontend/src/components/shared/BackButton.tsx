import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  onClick,
  className,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="secondary"
      onClick={onClick ? onClick : () => navigate(-1)}
      className={cn("w-fit", className)}
      type="button"
    >
      <ArrowLeft />
      Back
    </Button>
  );
};

export default BackButton;
