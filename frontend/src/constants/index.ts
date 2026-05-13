const DEFAULT_LIMIT = 100;

const OK_STATUS = [
  "approved",
  "active",
  "completed",
  "paid",
  "verified",
  "done",
  "success",
  "successful",
  "confirmed",
];

const PENDING_STATUS = [
  "pending",
  "awaiting",
  "awaiting_payment",
  "on_hold",
  "awaiting_approval",
];

const STORE_URL = {
  playstore: "https://play.google.com/store/apps/details?id=com.getBisats.app",
  appstore: "#",
};

export { DEFAULT_LIMIT, OK_STATUS, PENDING_STATUS, STORE_URL };
