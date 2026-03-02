import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Lock, RotateCw } from "lucide-react";
import { cn } from "@/utils";

interface Props {
  isFetching: boolean;
  refetch: () => void;
  refreshTime?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * A button that will refetch data when clicked.
 *
 * It accepts a couple of props:
 * - `isFetching`: a boolean indicating whether the data is currently being fetched
 * - `refetch`: a function to call when the button is clicked
 * - `refreshTime`: the number of milliseconds to wait before allowing another refresh (default: 20000)
 * - `disabled`: whether the button should be disabled (default: false)
 * - `className`: an optional class name to add to the button
 *
 * The button will be disabled if `isFetching` is true, or if the cooldown period
 * has not yet expired. When clicked, the button will call the `refetch` function
 * and start the cooldown period.
 *
 * The button will display a spinning icon while fetching, a lock icon while on
 * cooldown, and a normal refresh icon otherwise.
 */
const RefreshButton = ({
  isFetching,
  refetch,
  refreshTime,
  disabled: isDisabled,
  className,
}: Props) => {
  const [cooldown, setCooldown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handler for the click
  const handleRefresh = useCallback(() => {
    refetch();

    // start 3-minute cooldown
    setCooldown(true);
    timerRef.current = setTimeout(
      () => {
        setCooldown(false);
      },
      refreshTime || 20 * 1000,
    ); // 20 secs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  // Cleanup the timer if the component unmounts mid-cooldown
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // disabled if we're already fetching or in cooldown
  const disabled = isFetching || cooldown || isDisabled;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      disabled={disabled}
      className={cn("bg-gray-100 hover:bg-gray-200", className)}
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
