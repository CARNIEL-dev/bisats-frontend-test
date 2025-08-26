import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils";
import { Loader2, Timer } from "lucide-react";

type AutoRefreshTimerProps = {
  defaultTime?: number;
  queryKey?: string[]; // TanStack Query key
};

const AutoRefreshTimer = ({
  defaultTime = 60,
  queryKey,
}: AutoRefreshTimerProps) => {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setTimeLeft(defaultTime);
  };

  // Handle refresh when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isRefreshing) {
      setIsRefreshing(true);
      if (queryKey) {
        queryClient
          .refetchQueries({ queryKey })
          .then(() => {
            startCountdown();
          })
          .finally(() => {
            setIsRefreshing(false);
          });
      } else {
        startCountdown();
        setIsRefreshing(false);
      }
    }
  }, [timeLeft, isRefreshing, queryClient, queryKey]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft > 0 && !isRefreshing) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isRefreshing]);

  return (
    <div
      className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-md", {
        "text-green-500 bg-green-500/10": timeLeft > 6,
        "text-yellow-500 bg-yellow-500/10 animate-pulse":
          timeLeft <= 6 && timeLeft > 2,
        "text-red-500 bg-red-500/10": timeLeft <= 2 || timeLeft === 0,
      })}
    >
      <Timer className={cn("size-4")} />

      <span className="text-sm font-medium">
        {timeLeft > 0 ? (
          `${timeLeft}s`
        ) : (
          <span className="flex items-center gap-1">
            <Loader2 className="size-3 animate-spin" />
          </span>
        )}
      </span>
    </div>
  );
};

export default AutoRefreshTimer;
