import ApkImage from "@/assets/andriod_apk.png";
import AppImage from "@/assets/apple_store.png";
import GooglePlay from "@/assets/google_play.png";

export const countries = [
  { key: "NG", country: "Nigeria" },
  { key: "US", country: "United States of America" },
  { key: "GB", country: "United Kingdom" },
  { key: "FR", country: "France" },
  { key: "CA", country: "Canada" },
  { key: "DE", country: "Germany" },
  { key: "JP", country: "Japan" },
  { key: "IN", country: "India" },
  { key: "BR", country: "Brazil" },
  { key: "ZA", country: "South Africa" },
  { key: "AU", country: "Australia" },
  { key: "CN", country: "China" },
  { key: "RU", country: "Russia" },
  { key: "ES", country: "Spain" },
  { key: "IT", country: "Italy" },
  { key: "MX", country: "Mexico" },
  { key: "KR", country: "South Korea" },
  { key: "SA", country: "Saudi Arabia" },
  { key: "AR", country: "Argentina" },
  { key: "EG", country: "Egypt" },
];

export const countryDataForPhone = [
  {
    code: "NG",
    dialCode: "234",
    name: "Nigeria",
    flag: "🇳🇬",
    maxNationalLength: 11,
  },
  {
    code: "GB",
    dialCode: "44",
    name: "United Kingdom",
    flag: "🇬🇧",
    maxNationalLength: 11,
  },
  {
    code: "GH",
    dialCode: "233",
    name: "Ghana",
    flag: "🇬🇭",
    maxNationalLength: 9,
  },
  {
    code: "KE",
    dialCode: "254",
    name: "Kenya",
    flag: "🇰🇪",
    maxNationalLength: 9,
  },
  {
    code: "US",
    dialCode: "1",
    name: "United States",
    flag: "🇺🇸",
    maxNationalLength: 10,
  },
  {
    code: "CA",
    dialCode: "1",
    name: "Canada",
    flag: "🇨🇦",
    maxNationalLength: 10,
  },
];

export const toke_100_ngn = {
  BTC: 0.55,
  USDT: 60000,
  SOL: 370,
  ETH: 20,
};

const faqData = [
  {
    id: 1,
    question: "How can I create an account?",
    answer: `Account Creation Process

Click "Sign Up" or "Create Account" and follow these steps:

Required Information:
• Full name
• Email address or phone number
• Password (use a strong, unique password)

Verification Process:
• You'll receive a verification code via SMS or email
• Enter this code to confirm your identity

Simply contact our support team to initiate a return, and we'll guide you through the entire process.`,
  },
  {
    id: 2,
    question: "What is KYC, and why is it required?",
    answer: `Know Your Customer (KYC) is a verification process required by financial regulations.

Why KYC is Important:
1. Compliance with international regulations
2. Prevention of money laundering
3. Protection against fraud
4. Enhanced account security

Required Documents:
Government-issued ID, proof of address, selfie verification

The process typically takes 24-48 hours to complete.`,
  },
  {
    id: 3,
    question: "How can I deposit or withdraw crypto?",
    answer: `Deposit Process:
1. Navigate to your wallet
2. Select the cryptocurrency
3. Copy your deposit address
4. Send funds from your external wallet

Withdrawal Process:
• Enter recipient address
• Specify amount
• Confirm transaction
• Wait for network confirmation

Important: Always double-check addresses before sending crypto. Transactions are irreversible.

Supported cryptocurrencies: Bitcoin, Ethereum, USDT, BNB, and 50+ others`,
  },
  {
    id: 4,
    question: "How do I deposit and withdraw in-app tokens?",
    answer: `In-app tokens can be managed through the following methods:

Deposit Options:
• Bank transfer (ACH, wire)
• Credit/debit card
• P2P trading
• Crypto conversion

Withdrawal Methods:
Bank account, PayPal, Skrill, local payment methods

Processing times: Deposits are instant, withdrawals take 1-3 business days

Fees:
Deposits: Free for bank transfers, 2.5% for cards
Withdrawals: $2.50 flat fee for bank transfers`,
  },
  {
    id: 5,
    question: "How do I secure my account?",
    answer: `Security Best Practices

Two-Factor Authentication (2FA):
1. Download an authenticator app
2. Scan the QR code in your security settings
3. Enter the verification code
4. Save your backup codes

Additional Security Measures:
• Use a unique, strong password
• Enable email notifications for logins
• Set up withdrawal whitelisting
• Regular security checkups

Never share your credentials or 2FA codes with anyone.

Biometric options: Fingerprint, Face ID (mobile app only)`,
  },
  {
    id: 6,
    question: "How do I trade my crypto on Bisat's P2P?",
    answer: `P2P Trading Guide

Creating a Trade Ad:
1. Go to P2P trading section
2. Click "Create Ad"
3. Set your price and payment methods
4. Add trading terms and conditions
5. Publish your ad

Making a Trade:
• Browse available offers
• Select preferred payment method
• Initiate trade with seller/buyer
• Follow escrow process
• Confirm payment completion

Supported payment methods: Bank transfer, PayPal, Wise, cash, mobile money

Safety Tips:
Trade only with verified users, use platform's escrow service, never share personal banking details outside the platform`,
  },
  {
    id: 7,
    question: "How to set up crypto ads on Bisats",
    answer: `Ad Creation Steps:

1. Choose Ad Type: Buy or Sell
2. Select Cryptocurrency: Bitcoin, Ethereum, USDT, etc.
3. Set Price: Fixed price or percentage margin
4. Payment Methods: Select preferred options
5. Trading Limits: Minimum and maximum amounts
6. Terms & Conditions: Add specific requirements

Ad Management:
• Monitor ad performance
• Update pricing dynamically
• Pause/resume ads as needed
• Respond to trade requests promptly

Pro tip: Competitive pricing and fast response times lead to higher trading volumes.

Example pricing formula:
Market Price + (2-5% margin) = Your selling price
Market Price - (1-3% margin) = Your buying price`,
  },
];

const MOBILE_APP_INFO = [
  {
    name: "Andriod",
    image: ApkImage,
    link: "#",
    disabled: false,
  },
  {
    name: "App Store",
    image: AppImage,
    link: "#",
    disabled: true,
  },
  {
    name: "Google Play",
    image: GooglePlay,
    link: "#",
    disabled: true,
  },
];

export { faqData, MOBILE_APP_INFO };
