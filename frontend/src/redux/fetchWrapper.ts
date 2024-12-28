/** @format */

import { getToken, getRefreshToken } from "../helpers";
import { BACKEND_URLS } from "../utils/backendUrls";
import { TUser } from "../types/user";
import { refreshAccessToken } from "./actions/userActions";
import Toast from "../components/Toast";

const Bisatsfetch = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  // Request interceptor: Add Authorization header
  const token = getToken();

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    // Make the initial request
    const response = {
      res: await fetch(`${BACKEND_URLS.BASE_URL}${url}`, config),
    };

    // If response is okay, return it
    if (response.res.ok) {
      const res = await response.res.json(); // Use the raw JSON response
      return res; // Return the raw data
    } else {
      const res = await response.res.json(); // Use the raw JSON response

      // Toast.error(res.message, "");
    }

    // Response interceptor: Handle 403 (Forbidden) and refresh token
    if (response.res.status === 403) {
      const originalRequest = { url, config };

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const tokenObj = (await refreshAccessToken({
            refreshToken,
          })) as TUser;

          // Update tokens in storage
          const { token } = tokenObj;

          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
          const retryConfig: RequestInit = {
            ...config,
            headers: retryHeaders,
          };

          const retryResponse = await fetch(
            `${BACKEND_URLS.BASE_URL}${originalRequest.url}`,
            retryConfig
          );
          const retryData = {
            res: await retryResponse.json(),
          }; // Get the retry data

          return retryData.res;
        } catch (err) {
          // Handle refresh token failure
          throw new Error("Failed to refresh access token");
        }
      }
    }

    // If not handled above, throw the error response
    throw response;
  } catch (error) {
    // General error handling
    console.error("Request failed:", error);
    throw error;
  }
};

export default Bisatsfetch;
