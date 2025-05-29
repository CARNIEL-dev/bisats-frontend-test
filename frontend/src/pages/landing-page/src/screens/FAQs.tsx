import React, { useState } from "react";
import { HeroSectionByIfeanyi } from "./Bisats/sections/HeroSectionByAnima";
import NavBar from "../../../../components/NavBar";

const FAQs = (): JSX.Element => {
	const [activeQuestion, setActiveQuestion] = useState<number>(0);

	const parseAnswer = (answer: string) => {
		const parts = answer.split(/(?=\s*[•*-]\s)|(?:\n\s*\n)/);

		return parts
			.map((part, index) => {
				const trimmedPart = part.trim();
				if (!trimmedPart) return null;

				const isBulletPoint = /^[•*-]\s/.test(trimmedPart);

				if (isBulletPoint) {
					const text = trimmedPart.replace(/^[•*-]\s/, "");
					return {
						type: "bullet",
						content: text,
						index,
					};
				} else {
					return {
						type: "paragraph",
						content: trimmedPart,
						index,
					};
				}
			})
			.filter(Boolean);
	};

	const renderAnswer = (answer: string, isMobile: boolean = false) => {
		const parsedContent = parseAnswer(answer);

		return parsedContent.map((item) => {
			if (!item) return null;

			if (item.type === "bullet") {
				return (
					<li
						key={item.index}
						className={`
							${isMobile ? "ml-3 mb-2 text-[14px]" : "ml-4 mb-2 text-[16px]"}
							text-[#606C82] font-[400] leading-relaxed
							list-disc list-inside
						`}
					>
						{item.content}
					</li>
				);
			} else if (item.type === "paragraph") {
				return (
					<p
						key={item.index}
						className={`
							${isMobile ? "mb-3 text-[14px]" : "mb-3 text-[16px]"}
							text-[#606C82] font-[400] leading-relaxed
						`}
					>
						{item.content}
					</p>
				);
			}

			return null;
		});
	};

	const faqData = [
		{
			id: 1,
			question: "How can I create an account?",
			answer: `Click “Sign Up” or “Create Account”
			Enter Your Basic Information:

• Full name
• Email address or phone number
• Password (use a strong, unique password)

Verify Your Email or Phone Number

•  You'll receive a verification code via SMS or email
•  Enter this code to confirm your identity.

Simply contact our support team to initiate a return, and we'll guide you through the entire process.`,
		},
		{
			id: 2,
			question: "What is KYC, and why is it required?",
			answer: `Shipping times vary based on your selected option:

• Standard shipping: 3-5 business days (Continental US)
• Express shipping: 1-2 business days
• Overnight shipping: Next business day delivery
• International shipping: 7-14 business days (varies by destination)

All domestic orders placed before 2 PM EST ship the same day. Weekend orders are processed on Monday.`,
		},
		{
			id: 3,
			question: "How can I deposit or withdraw crypto?",
			answer: `Yes, we ship worldwide to over 50 countries with the following details:

• Shipping costs vary by destination and package weight
• Delivery times typically range from 7-14 business days
• All packages include tracking and insurance
• Customs duties and taxes are the recipient's responsibility
• Some restrictions may apply to certain products or countries

Check our shipping calculator at checkout for exact rates to your location.`,
		},
		{
			id: 4,
			question: "How do I deposit and withdraw in-app tokens?",
			answer: `Tracking your order is easy with multiple options:

• Automatic email confirmation with tracking number upon shipment
• Real-time tracking updates via email and SMS
• Track directly on our website using your order number
• Mobile-friendly tracking page with detailed status updates
• Customer service assistance available for tracking issues

You'll receive notifications at every major milestone until delivery is confirmed.`,
		},
		{
			id: 5,
			question: "How do I secure my account?",
			answer: `We accept a wide variety of secure payment methods:

• All major credit cards (Visa, MasterCard, American Express, Discover)
• Digital wallets: PayPal, Apple Pay, Google Pay, Shop Pay
• Buy now, pay later options available at checkout
• Bank transfers for large orders (contact sales team)
• Gift cards and store credit

All transactions are protected with SSL encryption and fraud detection systems.`,
		},
		{
			id: 6,
			question: "How do I trade my crypto on Bisat’s P2P?",
			answer: `Order changes are possible within specific timeframes:

• Orders can be cancelled or modified within 1 hour of placement
• Changes not possible once items enter fulfillment process
• Automatic cancellation available for orders not yet processed
• Partial cancellations may be possible for multi-item orders
• Rush processing available for urgent modifications

Contact our customer service immediately if you need to make changes to your order.`,
		},
		{
			id: 7,
			question: "How to set a crypto ads on Bisats",
			answer: `Our dedicated support team is here to help:

• Live chat: Available 24/7 on our website
• Phone support: Monday-Friday, 9 AM to 6 PM EST
• Email support: Response within 24 hours
• Help center with comprehensive FAQs and guides
• Video tutorials for product setup and troubleshooting

We pride ourselves on providing exceptional customer service at every step of your journey.`,
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
