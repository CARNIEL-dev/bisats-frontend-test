import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SUB: FORMAT CURRENCY AND VALUE
const formatter = ({
  decimal = 2,
  style = "decimal",
  currency = undefined,
}: {
  decimal?: number;
  style?: string;
  currency?: string | undefined;
}) => {
  return new Intl.NumberFormat(undefined, {
    //@ts-ignore
    style: style,
    currency: currency,
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
    useGrouping: true,
  });
};

// HDR: Format time
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export { formatter, formatTime };
