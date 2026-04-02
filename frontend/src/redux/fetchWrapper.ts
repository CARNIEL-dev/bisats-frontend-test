/** @format */

import {
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "@/helpers";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { refreshAccessToken } from "./actions/userActions";
import { createRequestAuthHeaders } from "@/utils/authHeader";
let isRefreshing = false;

const forceLogout = () => {
  isRefreshing = false;
  window.dispatchEvent(new Event("session-expired"));
};

const Bisatsfetch = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  // Request interceptor: Add Authorization header
  const token = getToken();
  const method = options.method || "GET";

  // Generate HMAC headers
  const authHeaders = createRequestAuthHeaders(method, url);

  // Check if content type is multipart/form-data
  const contentType =
    options.headers &&
    (options.headers as Record<string, string>)["Content-Type"];

  let body = options.body;

  const headers = {
    Accept: "application/json",
    "Content-Type": contentType || "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...authHeaders,
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    body,
  };

  try {
    // Make the initial request
    const response = await fetch(`${BACKEND_URLS.BASE_URL}${url}`, config);
    const resData = await response.json();

    // Response interceptor: Handle 401 (Unauthorized) and refresh token
    if (
      response.status === 401 &&
      resData.message?.toLowerCase()?.startsWith("unauthorized")
    ) {
      // If we're already refreshing, this 401 is from the refresh call itself
      // — the refresh token is invalid/expired. Force logout to break the loop.
      if (isRefreshing) {
        forceLogout();
        return resData;
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        forceLogout();
        return resData;
      }

      try {
        isRefreshing = true;
        const tokenObj = (await refreshAccessToken({
          refreshToken,
        })) as TUser;

        if (!tokenObj?.token || !tokenObj?.refreshToken) {
          forceLogout();
          return resData;
        }

        setToken(tokenObj.token);
        setRefreshToken(tokenObj.refreshToken);

        const retryAuthHeaders = createRequestAuthHeaders(method, url);
        const retryHeaders = {
          ...headers,
          ...retryAuthHeaders,
          Authorization: `Bearer ${tokenObj.token}`,
        };
        const retryConfig: RequestInit = {
          ...config,
          headers: retryHeaders,
        };

        const retryResponse = await fetch(
          `${BACKEND_URLS.BASE_URL}${url}`,
          retryConfig,
        );
        const retryDataResponse = await retryResponse.json();

        return retryDataResponse;
      } catch (err) {
        forceLogout();
        return resData;
      } finally {
        isRefreshing = false;
      }
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export default Bisatsfetch;
