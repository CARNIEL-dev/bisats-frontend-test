/** @format */

import { getRefreshToken, getToken } from "@/helpers";
import { BACKEND_URLS } from "@/utils/backendUrls";
import { refreshAccessToken } from "./actions/userActions";

const Bisatsfetch = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  // Request interceptor: Add Authorization header
  const token = getToken();

  // Check if content type is multipart/form-data
  const contentType =
    options.headers &&
    (options.headers as Record<string, string>)["Content-Type"];

  let body = options.body;

  // if (!isMultipart && body) {
  //   try {
  //     // Expect body could be JSON-string or object: normalize to object for encryption
  //     const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
  //     const encryptedBody = encryptDataInfo(parsedBody);
  //     body = JSON.stringify({ data: encryptedBody });
  //   } catch (err) {
  //     console.warn("Body encryption failed, sending original body", err);
  //   }
  // }

  const headers = {
    Accept: "application/json",
    "Content-Type": contentType || "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    body,
  };

  try {
    // Make the initial request
    const response = {
      res: await fetch(`${BACKEND_URLS.BASE_URL}${url}`, config),
    };
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
            Authorization: `${token}`,
          };
          const retryConfig: RequestInit = {
            ...config,
            headers: retryHeaders,
          };

          const retryResponse = await fetch(
            `${BACKEND_URLS.BASE_URL}${originalRequest.url}`,
            retryConfig
          );
          const retryDataResponse = await retryResponse.json();

          // Decrypt retry response
          // const retryData = decryptDataInfo(retryDataResponse);

          return retryDataResponse;
        } catch (err) {
          // Handle refresh token failure
          throw new Error("Failed to refresh access token");
        }
      }
    }

    const responseData = await response.res.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export default Bisatsfetch;
