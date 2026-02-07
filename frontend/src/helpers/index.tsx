import { TDepositBreakDowns } from "@/types/wallet";
import CryptoJS from "crypto-js";
import { ChangeEvent, InputHTMLAttributes } from "react";

type NetworkInfo = {
  value: string; // e.g., "sepolia"
  label: string; // e.g., "sepolia"
  address: string; // wallet address for that network
};

type AssetGroup = {
  id: string; // e.g., "ETH"
  tokenName: string; // e.g., "ETH"
  networks: NetworkInfo[];
};

// HDR: ======== ENCRYPTION =========
const SECRET_KEY = process.env.REACT_APP_REDUX_SECRET || "te%st_Bisat%secret";

const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Decryption failed (empty result)");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return ""; // Fail gracefully
  }
};

// HDR: ======== TOKEN =========

export const setToken = (token: string) => {
  const data = encryptData(token);
  localStorage.setItem("token", data);
};

export const getToken = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("token")) return undefined;

  const token = localStorage.getItem("token");

  if (token) {
    return decryptData(token);
  }
};

// HDR: =================

export const setLivePrices = (livePrices: string) => {
  localStorage.setItem("bsts_live_prices", livePrices);
};

// HDR: ===== USER ID ======
export const setUserId = (id: string) => {
  const encryptedId = encryptData(id);
  localStorage.setItem("_uid", encryptedId);
};

export const getUserId = (): string | undefined => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("_uid")) return undefined;

  const user = localStorage.getItem("_uid");
  if (user) {
    return decryptData(user);
  }
};

// HDR: =========

export const setUser = (user: TUser) => {
  localStorage.setItem("_user", JSON.stringify(user));
};

export const getUser = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("_user")) return undefined;

  const user = localStorage.getItem("_user");
  if (user) {
    return JSON.parse(localStorage.getItem("_user") ?? "");
  }
};

export const setUserTokenData = (user: AssetGroup[]) => {
  const tokenData = encryptData(user);
  localStorage.setItem("_bst_user_tokens", tokenData);
};

export const getUserTokenData = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("_bst_user_tokens")) return undefined;

  const token_data = localStorage.getItem("_bst_user_tokens");
  if (token_data) {
    return decryptData(token_data);
  }
};

export const getLivePrice = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("bsts_live_prices")) return undefined;

  const liveprices = localStorage.getItem("bsts_live_prices");
  if (liveprices) {
    return JSON.parse(localStorage.getItem("bsts_live_prices") ?? "");
  }
};

export const setDepositTranscBreakDown = (breakDown: TDepositBreakDowns) => {
  const data = encryptData(breakDown);
  localStorage.setItem("_depositBreakDown", data);
};

export const getDepositBreakDown = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("_depositBreakDown")) return undefined;

  const depositBreakDown = localStorage.getItem("_depositBreakDown");
  if (depositBreakDown) {
    return decryptData(depositBreakDown);
  }
};

// HDR: ===== REFRESH TOKEN ===========
const setRefreshToken = (token: string) => {
  const data = encryptData(token);
  localStorage.setItem("refreshToken", data);
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return undefined;

  if (!localStorage.getItem("token")) return undefined;

  const token = localStorage.getItem("refreshToken");

  if (token) {
    return decryptData(token);
  }
};

// HDR ========== APP STATE ============

const setAppState = (state: any) => {
  try {
    const encrypted = encryptData(state);
    localStorage.setItem("bisatAppState", encrypted);
  } catch (error) {
    console.error("Could not save state", error);
  }
};

const getAppState = () => {
  try {
    const serializedState = localStorage.getItem("bisatAppState");
    if (serializedState === null) return undefined; // Return undefined for initial state
    return decryptData(serializedState);
  } catch (error) {
    console.error("Could not load state", error);
    return undefined;
  }
};

// HDR: =========================

export const removeCache = (arg: string) => {
  localStorage.removeItem(arg);
  // sessionStorage.removeItem(arg);
};

const resolveValue = (
  val: InputHTMLAttributes<HTMLInputElement>["value"],
): string => {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) {
    return val[0] ?? "";
  }

  return String(val);
};

const sanitizeNumberString = (value: string): string => {
  if (!value) return "";

  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const firstDot = cleaned.indexOf(".");
  const integerRaw =
    firstDot === -1 ? cleaned : cleaned.slice(0, firstDot).replace(/[.]/g, "");
  const decimalRaw =
    firstDot === -1 ? "" : cleaned.slice(firstDot + 1).replace(/[.]/g, "");

  let integerPart =
    integerRaw.length > 1 ? integerRaw.replace(/^0+(?=\d)/, "") : integerRaw;

  if (integerPart === "" && cleaned.startsWith("0") && decimalRaw.length > 0) {
    integerPart = "0";
  }

  if (firstDot === 0) {
    integerPart = "";
  }

  if (integerPart === "" && !decimalRaw && cleaned.startsWith("0")) {
    integerPart = "0";
  }

  let normalized = integerPart;

  if (decimalRaw.length > 0) {
    normalized = integerPart
      ? `${integerPart}.${decimalRaw}`
      : `.${decimalRaw}`;
  }

  if (firstDot !== -1 && cleaned.endsWith(".")) {
    normalized = integerPart ? `${integerPart}.` : ".";
  }

  return normalized;
};

const formatNumberDisplay = (value: string): string => {
  if (!value) return "";

  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  if (decimalPart !== undefined) {
    return decimalPart === ""
      ? `${formattedInteger}.`
      : `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
};

const buildSyntheticEvent = (
  event: ChangeEvent<HTMLInputElement>,
  nextValue: string,
): ChangeEvent<HTMLInputElement> => {
  const numericValue =
    nextValue === "" || nextValue === "." ? NaN : Number(nextValue);

  const originalTarget = event.target as HTMLInputElement;
  const originalCurrentTarget = event.currentTarget as HTMLInputElement;

  const target = {
    ...originalTarget,
    value: nextValue,
    valueAsNumber: numericValue,
    dataset: {
      ...originalTarget.dataset,
      rawValue: nextValue,
    },
  } as EventTarget & HTMLInputElement;
  Object.setPrototypeOf(target, Object.getPrototypeOf(originalTarget));

  const currentTarget = {
    ...originalCurrentTarget,
    value: nextValue,
    valueAsNumber: numericValue,
  } as EventTarget & HTMLInputElement;
  Object.setPrototypeOf(
    currentTarget,
    Object.getPrototypeOf(originalCurrentTarget),
  );

  const syntheticEvent = {
    ...event,
    target,
    currentTarget,
  };

  Object.setPrototypeOf(syntheticEvent, Object.getPrototypeOf(event));

  return syntheticEvent as ChangeEvent<HTMLInputElement>;
};

export {
  encryptData,
  decryptData,
  setRefreshToken,
  getRefreshToken,
  setAppState,
  getAppState,
  buildSyntheticEvent,
  sanitizeNumberString,
  formatNumberDisplay,
  resolveValue,
};
