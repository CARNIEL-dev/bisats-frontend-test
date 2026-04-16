/** @format */

import {
  getRefreshToken,
  getToken,
} from "@/helpers";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { refreshAccessToken } from "./actions/userActions";
import { createRequestAuthHeaders } from "@/utils/authHeader";

// Within-tab coordination: only one refresh at a time per tab
let refreshPromise: Promise<void> | null = null;

// Tracks whether the session has expired (refresh token invalid).
// Once true, all subsequent requests short-circuit with the expired response
// until the user explicitly logs out via the SessionExpiredModal.
let sessionExpired = false;

const SESSION_EXPIRED_RESPONSE = {
  status: false,
  message: "Session expired",
  data: null,
};

/**
 * Signals that the session has expired by dispatching the event for the
 * SessionExpiredModal to show. Does NOT throw or call logoutUser —
 * the actual logout only happens when the user clicks "Sign In Again".
 */
const signalSessionExpired = () => {
  sessionExpired = true;
  refreshPromise = null;
  window.dispatchEvent(new Event("session-expired"));
};

/** Called externally (e.g. after successful login) to reset the expired flag */
export const resetSessionExpiredFlag = () => {
  sessionExpired = false;
};

/**
 * Performs a token refresh with two layers of protection:
 * 1. navigator.locks — cross-tab: only one tab refreshes at a time
 * 2. refreshPromise — within-tab: concurrent 401s share one refresh
 *
 * @param staleToken - The access token that triggered the 401.
 *   Used to detect if another tab already refreshed before us.
 */
const performTokenRefresh = async (staleToken: string | null): Promise<void> => {
  const doRefresh = async () => {
    // Check if another tab already refreshed the token while we waited for the lock
    const currentToken = getToken();
    if (currentToken && currentToken !== staleToken) {
      return; // Token was already refreshed by another tab
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      signalSessionExpired();
      return;
    }

    await refreshAccessToken({ refreshToken });
  };

  // Layer 1: Cross-tab coordination via Web Locks API
  if (navigator.locks) {
    await navigator.locks.request("bisats-token-refresh", doRefresh);
  } else {
    // Fallback for browsers without Web Locks — still safe for single-tab
    await doRefresh();
  }
};

const Bisatsfetch = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  // If session is already expired, short-circuit — don't make network requests.
  // The SessionExpiredModal is visible and waiting for the user to act.
  if (sessionExpired) {
    return SESSION_EXPIRED_RESPONSE;
  }

  // Request interceptor: Add Authorization header
  const token = getToken();
  const method = options.method || "GET";

  // Generate HMAC headers
  const authHeaders = createRequestAuthHeaders(method, url);

  // Check if content type is multipart/form-data
  const contentType =
    options.headers &&
    (options.headers as Record<string, string>)["Content-Type"];

  const body = options.body;

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
      // If this 401 is from the refresh endpoint itself, the refresh token
      // is invalid/expired — signal session expired to show the modal
      if (url.includes("refresh-token")) {
        signalSessionExpired();
        return SESSION_EXPIRED_RESPONSE;
      }

      try {
        // Layer 2: Within-tab coordination — reuse in-flight refresh
        if (!refreshPromise) {
          refreshPromise = performTokenRefresh(token).finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
      } catch {
        // Transient failure (network error, timeout, etc.) — do NOT mark session
        // as expired. The refresh token may still be valid. Let the request fail
        // gracefully; TanStack Query will retry, and the next attempt will try
        // refreshing again.
        return SESSION_EXPIRED_RESPONSE;
      }

      // If session was marked expired during the refresh, don't retry
      if (sessionExpired) {
        return SESSION_EXPIRED_RESPONSE;
      }

      // Retry original request with fresh token from storage
      const freshToken = getToken();
      const retryAuthHeaders = createRequestAuthHeaders(method, url);
      const retryHeaders = {
        ...headers,
        ...retryAuthHeaders,
        Authorization: `Bearer ${freshToken}`,
      };
      const retryConfig: RequestInit = {
        ...config,
        headers: retryHeaders,
      };

      const retryResponse = await fetch(
        `${BACKEND_URLS.BASE_URL}${url}`,
        retryConfig,
      );
      return await retryResponse.json();
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export default Bisatsfetch;
