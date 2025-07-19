import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button variant="secondary" onClick={() => navigate(-1)} className="w-fit">
      <ArrowLeft />
      Back
    </Button>
  );
};

export default BackButton;
