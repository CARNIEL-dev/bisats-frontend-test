/** @format */

export const baseUrl = process.env.REACT_APP_BASEDOMAIN;

const fetchWrapper = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers, // Keep any existing headers
    Authorization: token ? `Bearer ${token}` : "",
  };

  const newOptions = {
    ...options,
    headers,
  };

  const response = await fetch(baseUrl + url, newOptions);

  // Handle the response (you can add error handling or other logic here)
  if (!response.ok) {
    // You can handle error response here (e.g., redirect to login on unauthorized)
    throw new Error("Request failed");
  }

  return response;
};

export default fetchWrapper;
