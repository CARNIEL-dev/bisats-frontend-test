import { TUser } from "../types/user";
import { TDepositBreakDowns } from "../types/wallet";

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
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