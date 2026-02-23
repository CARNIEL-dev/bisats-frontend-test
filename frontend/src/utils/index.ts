import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Resizer from "react-image-file-resizer";
import { BACKEND_URLS } from "@/utils/backendUrls";

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

// const isProduction = true;
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production";

const getPercentage = ({
  total,
  filled,
}: {
  total: number;
  filled: number;
}): number => {
  if (!total || !filled) return 0;
  const percent = ((filled / total) * 100).toFixed(2);
  return Number(percent);
};

const getSafeValue = (value: number | undefined | null): number => {
  return value ?? 0;
};

function getUpgradeButtonState(
  user?: TUser | { [key: string]: any },
  limits?: unknown,
) {
  const { level, isNA } = formatAccountLevel(user?.accountLevel);

  const appliedLevel1 = !!user?.hasAppliedToBeInLevelOne;
  const hasLevel = !isNA; // has a valid level if not N/A
  const isLevel1 = level === 1;
  const isLevel2 = level === 2;
  const appliedMerchant = !!user?.hasAppliedToBecomeAMerchant;
  const appliedSuperMerchant = !!user?.hasAppliedToBecomeASuperMerchant;
  const bvnOk = !!user?.kyc?.bvnVerified;

  const disabled =
    (appliedLevel1 && !hasLevel) ||
    (appliedMerchant && isLevel1) ||
    (appliedSuperMerchant && isLevel2);

  let label = "Upgrade";
  if (appliedLevel1 && !hasLevel) {
    label = "Pending verification";
  } else if (appliedMerchant && isLevel1) {
    label = "Pending Merchant Approval";
  } else if (appliedSuperMerchant && isLevel2) {
    label = "Pending Super Merchant Approval";
  } else if (!hasLevel || !limits) {
    label = "Verify";
  } else if (!appliedMerchant && bvnOk && isLevel1) {
    label = "Become a Merchant";
  } else if (appliedMerchant && bvnOk && isLevel2) {
    label = "Become a Super Merchant";
  }

  return { disabled, label };
}

const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200,
      1800,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      // "base64"
    );
  });

const getClientIp = async (): Promise<string | null> => {
  try {
    const res = await fetch(BACKEND_URLS.IP_ADDRESS_API);
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("Failed to get IP:", err);
    return null;
  }
};

const formatAccountLevel = (
  accountLevel?: string | number | null,
): {
  display: string;
  level: number | null;
  isNA: boolean;
} => {
  if (accountLevel === undefined || accountLevel === null) {
    return { display: "N/A", level: null, isNA: true };
  }

  // Normalize to a number
  let levelNumber: number;

  if (typeof accountLevel === "number") {
    levelNumber = accountLevel;
  } else if (typeof accountLevel === "string") {
    // handles "level_1", "level_0", "1", "0"
    const match = accountLevel.match(/(\d+)/);
    levelNumber = match ? parseInt(match[1], 10) : -1;
  } else {
    return { display: "N/A", level: null, isNA: true };
  }

  if (levelNumber <= 0) {
    return { display: "N/A", level: levelNumber, isNA: true };
  }

  return {
    display: `Level ${levelNumber}`,
    level: levelNumber,
    isNA: false,
  };
};

export {
  formatter,
  formatTime,
  splitTextInMiddle,
  formatEmail,
  getCurrencyBalance,
  delay,
  formatCompactNumber,
  isProduction,
  getPercentage,
  getSafeValue,
  getUpgradeButtonState,
  resizeFile,
  getClientIp,
  formatAccountLevel,
};
