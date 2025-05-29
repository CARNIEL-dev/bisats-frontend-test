import React, { useState } from "react";
import { HeroSectionByIfeanyi } from "./Bisats/sections/HeroSectionByAnima";
import NavBar from "../../../../components/NavBar";
import { parseText, renderParsedText } from "../../../../utils/textParser";

const FAQs = (): JSX.Element => {
	const [activeQuestion, setActiveQuestion] = useState<number>(0);

	const renderAnswer = (answer: string, isMobile: boolean = false) => {
		const parsedContent = parseText(answer, {
			detectHeadings: true,
			detectCodeBlocks: true,
			detectQuotes: true,
			detectCommaLists: true,
			minCommaListItems: 2,
		});

		return renderParsedText(parsedContent, "", isMobile);
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

	const handleQuestionClick = (index: number) => {
		setActiveQuestion(index);
	};

	return (
		<div>
			<NavBar />
			<HeroSectionByIfeanyi
				title="FAQs"
				desc="Got Questions? We've Got Answers"
				image="/landingpage/FAQs-hero-image.png"
			/>

			<div className="w-full py-[64px] lg:py-[80px] px-[20px] bg-white lg:bg-[#F7F7F7]">
				<div className="max-w-[835px] w-full hidden lg:flex gap-[38px] mx-auto">
					<div className="w-1/2 space-y-[16px] bg-white p-[16px] rounded-[12px]">
						{faqData.map((faq, index) => (
							<button
								key={faq.id}
								onClick={() => handleQuestionClick(index)}
								className={`w-full max-w-[446px] text-[18px] rounded-[8px] p-[12px] text-left transition-all duration-200 ${
									activeQuestion === index
										? "bg-[#F5BB00] text-[#0A0E12] font-[600]"
										: "text-[#515B6E] font-[400] bg-[#F9F9FB]"
								}`}
							>
								{faq.question}
							</button>
						))}
					</div>

					<div className="w-1/2 p-[8px]">
						<h3 className="text-[34px] font-[500] text-[#2B313B] mb-[8px]">
							{faqData[activeQuestion].question}
						</h3>
						<div className="text-[#606C82] font-[400] text-[16px] leading-relaxed">
							{renderAnswer(faqData[activeQuestion].answer, false)}
						</div>
					</div>
				</div>

				{/* Mobile Layout */}
				<div className="lg:hidden space-y-[24px]">
					{faqData.map((faq, index) => (
						<div key={faq.id} className="space-y-[24px] w-full">
							<button
								onClick={() =>
									handleQuestionClick(activeQuestion === index ? -1 : index)
								}
								className={`w-full text-left rounded-[8px] p-[12px] transition-all duration-200 ${
									activeQuestion === index
										? "bg-[#F5BB00] text-[#0A0E12] font-[600] text-[18px]"
										: "bg-[#F9F9FB] text-[#515B6E] font-[400] text-[16px]"
								}`}
							>
								{faq.question}
							</button>

							{activeQuestion === index && (
								<div className="text-[#606C82] font-[400] leading-relaxed text-[16px]">
									{renderAnswer(faq.answer, true)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FAQs;
