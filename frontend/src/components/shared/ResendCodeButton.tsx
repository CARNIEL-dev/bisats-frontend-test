//? React
import { useEffect, useRef, useState } from "react";

//? Lib
import { cn, formatTime } from "@/utils";

//? UI
import { Button } from "@/components/ui/Button";
import { Loader2, Timer } from "lucide-react";

type CountdownButtonProps = {
  defaultTime?: number;
  onClick: () => Promise<boolean>;
  text: string;
};

const ResendCodeButton = ({
  defaultTime = 60,
  text,
  onClick,
}: CountdownButtonProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setTimeLeft(defaultTime);
    setIsCounting(true);
  };

  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsCounting(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isCounting]);

  const handleClick = async () => {
    setIsLoading(true);
    const success = await onClick();
    setIsLoading(false);

    if (success) {
      startCountdown();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Timer className={cn("text-green-500 size-5")} />
        <p className="text-sm text-secondary-foreground">
          {formatTime(timeLeft)}
        </p>
      </div>
      <Button
        className={cn(
          "text-[#C49600] hover:text-[#C4960090] font-semibold hover:bg-transparent"
        )}
        onClick={handleClick}
        disabled={isCounting || isLoading}
        variant="ghost"
        type="button"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span className="ml-1 animate-pulse">Sending...</span>
          </>
        ) : (
          <span className="text-sm 2xl:text-base">{text}</span>
        )}
      </Button>
    </div>
  );
};

export default ResendCodeButton;
