import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const secret = process.env.REACT_APP_AUTH_HEADER_SECRET;
export const createRequestAuthHeaders = (method: string, path: string) => {
  const timestamp = Date.now().toString();
  const nonce = uuidv4();

  const pathOnly = path.split("?")[0];

  const message = `${timestamp}:${nonce}:${method.toUpperCase()}:${pathOnly}`;

  const signature = CryptoJS.HmacSHA256(message, secret || "").toString(
    CryptoJS.enc.Hex,
  );

  return {
    "X-Request-Timestamp": timestamp,
    "X-Request-Nonce": nonce,
    "X-Request-Signature": signature,
  };
};
