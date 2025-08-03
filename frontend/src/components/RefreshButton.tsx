import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Lock, RotateCw } from "lucide-react";

interface Props {
  isFetching: boolean;
  refetch: () => void;
  refreshTime?: number;
}

const RefreshButton = ({ isFetching, refetch, refreshTime }: Props) => {
  const [cooldown, setCooldown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Handler for the click
  const handleRefresh = useCallback(() => {
    refetch();

    // start 3-minute cooldown
    setCooldown(true);
    timerRef.current = setTimeout(() => {
      setCooldown(false);
    }, refreshTime || 20 * 1000); // 20 secs
  }, [refetch]);

  // Cleanup the timer if the component unmounts mid-cooldown
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // disabled if we're already fetching or in cooldown
  const disabled = isFetching || cooldown;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRefresh}
      disabled={disabled}
      className="bg-gray-100 hover:bg-gray-200"
    >
      {/*
        Priority for which icon to show:
        1) fetching  → spinning icon  
        2) cooldown → lock icon  
        3) default  → normal refresh icon
      */}
      {isFetching ? (
        <RotateCw className="animate-spin" />
      ) : cooldown ? (
        <Lock className="text-gray-400" />
      ) : (
        <RotateCw />
      )}
      <span className="sr-only">Refresh</span>
    </Button>
  );
};

export default RefreshButton;
