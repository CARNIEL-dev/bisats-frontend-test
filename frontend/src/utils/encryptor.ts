import CryptoJS from "crypto-js";

const passphrase = process.env.REACT_APP_PASSPHRASE!;

const encryptDataInfo = (data: any) => {
  // Generate random salt and iv using crypto-js
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive key using PBKDF2
  const derivedKey = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  });

  // Encrypt data
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  const body = {
    data: encrypted,
    iv: iv.toString(CryptoJS.enc.Base64),
    salt: salt.toString(CryptoJS.enc.Base64),
  };

  // Repeat for outer encryption if needed
  const outerIv = CryptoJS.lib.WordArray.random(16);
  const outerKey = CryptoJS.SHA256(passphrase);
  const outerEncrypted = CryptoJS.AES.encrypt(JSON.stringify(body), outerKey, {
    iv: outerIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  const finalBody = {
    payload: outerEncrypted,
    iv: outerIv.toString(CryptoJS.enc.Base64),
    timestamp: Date.now(),
  };

  const finalEncryptedData = btoa(JSON.stringify(finalBody));

  return finalEncryptedData;
};

const decryptDataInfo = (dataInfo: { data: string }) => {
  // First level decryption

  const { payload, iv } = JSON.parse(
    Buffer.from(dataInfo.data, "base64").toString("utf8")
  );

  if (!payload || !iv) throw new Error("Invalid payload");

  const outerIv = CryptoJS.enc.Base64.parse(iv);
  const outerKey = CryptoJS.SHA256(passphrase);
  const outerDecrypted = CryptoJS.AES.decrypt(payload, outerKey, {
    iv: outerIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decrypted = outerDecrypted.toString(CryptoJS.enc.Utf8);
  const firstEncryptedBody = JSON.parse(decrypted);

  // Inner decryption
  const { data, salt } = firstEncryptedBody;
  if (!passphrase) throw new Error("Missing PASSPHRASE env");

  const saltWordArray = CryptoJS.enc.Base64.parse(salt);
  const derivedKey = CryptoJS.PBKDF2(passphrase, saltWordArray, {
    keySize: 256 / 32,
    iterations: 10000,
  });

  const innerIv = CryptoJS.enc.Base64.parse(firstEncryptedBody.iv);
  const innerDecrypted = CryptoJS.AES.decrypt(data, derivedKey, {
    iv: innerIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decrypt = innerDecrypted.toString(CryptoJS.enc.Utf8);
  const finalEncryptedBody = JSON.parse(decrypt);

  return finalEncryptedBody;
};

export { encryptDataInfo, decryptDataInfo };
