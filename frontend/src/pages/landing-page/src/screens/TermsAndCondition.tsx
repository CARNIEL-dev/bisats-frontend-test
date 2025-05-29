import React, { useState } from "react";
import {  HeroSectionAbout } from "./Bisats/sections/HeroSectionByAnima";
import NavBar from "../../../../components/NavBar";
import PlatformTerms from "./Bisats/sections/TermsAndConditions/PlatformTerms";
import MerchantTerms from "./Bisats/sections/TermsAndConditions/MerchantTerms";

const TermsAndCondition = (): JSX.Element => {
	const [activeTab, setActiveTab] = useState<"platform" | "merchant">(
		"platform"
	);

	return (
		<div>
			<div className="bg-[#0A0E12]">
				<div className="bg-[#0A0E12] w-full fixed z-[400] top-0 w-full ">
					<NavBar />
				</div>
				<HeroSectionAbout
				title="Terms and Conditions"
				desc="Please review the terms carefully before using our peer-to-peer services. By accessing or using the platform, you agree to be bound by these conditions"
				image="/landingpage/T&C-hero-image.png"
			/>

				</div>
			<div className="max-w-[835px] w-full mx-auto py-[64px] lg:py-[88px] px-[20px]">
				<div className="">
					<nav
						className="flex items-center justify-center w-full"
						aria-label="Tabs"
					>
						<button
							onClick={() => setActiveTab("platform")}
							className={`text-[18px] font-[600] w-1/2 text-center ${
								activeTab === "platform" ? "text-[#937000]" : "text-[#515B6E]"
							}`}
						>
							Platform T&C
							<div
								className={`rounded-t-full h-[4px] w-full mt-2 ${
									activeTab === "platform" ? "bg-[#F5BB00]" : "bg-[#FFFFFF]"
								}`}
							></div>
						</button>
						<button
							onClick={() => setActiveTab("merchant")}
							className={`text-[18px] font-[600] w-1/2 text-center ${
								activeTab === "merchant" ? "text-[#937000]" : "text-[#515B6E]"
							}`}
						>
							T&C for Merchants
							<div
								className={`rounded-t-full h-[4px] w-full mt-2 ${
									activeTab === "merchant" ? "bg-[#F5BB00]" : "bg-[#FFFFFF]"
								}`}
							></div>
						</button>
					</nav>
				</div>

				<div className="mt-6">
					{activeTab === "platform" && <PlatformTerms />}
					{activeTab === "merchant" && <MerchantTerms />}
				</div>
			</div>
		</div>
	);
};

export default TermsAndCondition;
