/** @format */

import fetchWrapper from "../fetchWrapper";
import { UserActionTypes } from "../types";
export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await fetchWrapper("/login", {
      method: "POST",
      // body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const { token } = data;
    localStorage.setItem("_token", token);

    if (response.ok) {
      return { ok: true, data: data };
    } else {
      return { ok: false, data: data };
    }
  } catch (error) {
    return { ok: true, data: error };
  }
};

export const rehydrateUser = (dispatch: any) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (user && token) {
    dispatch({ type: UserActionTypes?.LOG_IN_SUCCESS, payload: user });
  }
};
