import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SUB: SLEEP/DELAY
const delay = async (time: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Promise resolved after ${time} milliseconds`);
    }, time * 1000);
  });
};

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

// HDR: Split text in the middle
type BreakLongTextType = {
  str: string;
  visibleChars?: number;
  ellipsis?: string;
};

const splitTextInMiddle = ({
  str,
  visibleChars = 10,
  ellipsis = "...",
}: BreakLongTextType): string => {
  if (str.length <= visibleChars * 2) {
    return str;
  }
  const firstPart = str.slice(0, visibleChars);
  const secondPart = str.slice(-visibleChars);

  return `${firstPart}${ellipsis}${secondPart}`;
};

// HDR: Format email
type FormatEmailParams = {
  email: string;
  maxChar?: number;
  ellipsis?: string;
};

function formatEmail({
  email,
  maxChar = 6,
  ellipsis = "***",
}: FormatEmailParams): string | null {
  const [local, domain] = email.split("@");

  if (!local || !domain) {
    return null;
  }

  const visible = local.slice(0, maxChar);
  return `${visible}${ellipsis}@${domain}`;
}

// HDR: Wallet currency Balance
// ...existing code...

type CurrencyBalanceParams =
  | {
      item: Omit<AssetType, "logo" | "Asset">;
      isXNGN: boolean;
      defaultCurrency: string;
      type?: "balance";
    }
  | {
      item: Omit<AssetType, "logo" | "Asset">;
      isXNGN: boolean;
      defaultCurrency: string;
      type: "locked";
      lockedBalance: number;
    };

const getCurrencyBalance = (params: CurrencyBalanceParams): number => {
  const { item, isXNGN, defaultCurrency } = params;

  if (params.type === "locked") {
    const { lockedBalance } = params;
    if (defaultCurrency === "usd") {
      return isXNGN
        ? lockedBalance / item.NairaRate
        : lockedBalance * item.USDRate;
    } else {
      return isXNGN ? lockedBalance : lockedBalance * item.NairaRate;
    }
  } else {
    if (defaultCurrency === "usd") {
      return isXNGN
        ? item.Balance / item.NairaRate
        : item.Balance * item.USDRate;
    } else {
      return isXNGN ? item.Balance : item.Balance * item.NairaRate;
    }
  }
};

// ...existing code...

/**
 * Converts large numbers to compact/shortened format (e.g., 2000 → "2K")
 * @param value - The number to format
 * @returns Formatted string (e.g., "2K", "10M", "100B")
 */
const formatCompactNumber = (value: number): string => {
  if (value < 1000) return value.toString(); // No conversion for < 1K

  const units = ["K", "M", "B", "T"]; // Thousand, Million, Billion, Trillion
  const unitIndex = Math.floor(Math.log10(value) / 3) - 1; // Determine unit index
  const unit = units[unitIndex] || ""; // Fallback to empty string if beyond trillions
  const scaledValue = value / Math.pow(1000, unitIndex + 1); // Scale the number

  // Format to 1 decimal place if needed (e.g., 1.5K)
  return scaledValue % 1 === 0
    ? `${scaledValue}${unit}`
    : `${scaledValue.toFixed(1)}${unit}`;
};

const isProduction = true;
// const isProduction =
//   process.env.NODE_ENV === "production" ||
//   process.env.VERCEL_ENV === "production";

export {
  formatter,
  formatTime,
  splitTextInMiddle,
  formatEmail,
  getCurrencyBalance,
  delay,
  formatCompactNumber,
  isProduction,
};
