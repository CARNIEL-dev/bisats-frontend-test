import { TUser } from "../types/user";
import { TDepositBreakDowns } from "../types/wallet";

type NetworkInfo = {
    value: string;   // e.g., "sepolia"
    label: string;   // e.g., "sepolia"
    address: string; // wallet address for that network
};

type AssetGroup = {
    id: string;            // e.g., "ETH"
    tokenName: string;     // e.g., "ETH"
    networks: NetworkInfo[];
};
  
export const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const setLivePrices = (livePrices: string) => {
    localStorage.setItem("bsts_live_prices", livePrices);
};

export const setUserId = (id:string) => {
    localStorage.setItem("_uid", JSON.stringify(id));
};

export const getUserId = () => {
    if (typeof window === "undefined") return undefined;

    if (!localStorage.getItem("_uid")) return undefined;

    const user = localStorage.getItem("_uid");
    if (user) {
        return JSON.parse(localStorage.getItem("_uid") ?? "");
    }
};


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
    localStorage.setItem("_bst_user_tokens", JSON.stringify(user));
};

export const getUserTokenData = () => {
    if (typeof window === "undefined") return undefined;

    if (!localStorage.getItem("_bst_user_tokens")) return undefined;

    const token_data = localStorage.getItem("_bst_user_tokens");
    if (token_data) {
        return JSON.parse(localStorage.getItem("_bst_user_tokens") ?? "");
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


export const getToken = () => {
    if (typeof window === "undefined") return undefined;

    if (!localStorage.getItem("token")) return undefined;

    const token = localStorage.getItem("token");

    if (token) {
        return localStorage.getItem("token");
    }
};

export const setDepositTranscBreakDown = (breakDown: TDepositBreakDowns) => {
    localStorage.setItem("_depositBreakDown", JSON.stringify(breakDown));
};

export const getDepositBreakDown = () => {
    if (typeof window === "undefined") return undefined;

    if (!localStorage.getItem("_depositBreakDown")) return undefined;

    const depositBreakDown = localStorage.getItem("_depositBreakDown");
    if (depositBreakDown) {
        return JSON.parse(localStorage.getItem("_depositBreakDown") ?? "");
    }
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = () => {
    if (typeof window === "undefined") return undefined;

    if (!localStorage.getItem("token")) return undefined;

    const token = localStorage.getItem("refreshToken");

    if (token) {
        return localStorage.getItem("refreshToken");
    }
};

export const setAppState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (error) {
        console.error('Could not save state', error);
    }
};

export const getAppState = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) return undefined; // Return undefined for initial state
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Could not load state', error);
        return undefined;
    }
};

export const removeCache = (arg: string) => {
    localStorage.removeItem(arg);
    // sessionStorage.removeItem(arg);
};