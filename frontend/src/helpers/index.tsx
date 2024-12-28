import { TUser } from "../types/user";

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

export const removeCache = (arg: string) => {
    localStorage.removeItem(arg);
    // sessionStorage.removeItem(arg);
};