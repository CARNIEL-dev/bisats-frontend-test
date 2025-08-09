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
const getCurrencyBalance = ({
  item,
  isXNGN,
  defaultCurrency,
}: {
  item: Omit<AssetType, "logo" | "Asset">;
  isXNGN: boolean;
  defaultCurrency: string;
}): number => {
  if (defaultCurrency === "usd") {
    return isXNGN ? item.Balance / item.NairaRate : item.Balance * item.USDRate;
  } else {
    return isXNGN ? item.Balance : item.Balance * item.NairaRate;
  }
};

export {
  formatter,
  formatTime,
  splitTextInMiddle,
  formatEmail,
  getCurrencyBalance,
  delay,
};
