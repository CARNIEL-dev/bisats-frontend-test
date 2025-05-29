import React from "react";
import NavBar from "../../../../../components/NavBar";
import { HeroSectionAbout } from "./sections/HeroSectionByAnima";

const About = (): JSX.Element => {
	return (
		<div >
			<div className="bg-[#0A0E12]">
				<div className=" bg-[#0A0E12] w-full fixed z-[400] top-0 w-full ">
					<NavBar />
				</div>
				<HeroSectionAbout
					title="With a drive to innovate, we bring speed, security and safety to our users"
					image="/landingpage/About-hero-image.png"
				/>
			</div>


			<div className="py-[64px] lg:py-[88px] flex flex-col items-center justify-center px-[20px]">
				<h2 className="text-[28px] lg:text-[42px] font-[500] text-[#0A0E12] lg-[8px] lg:mb-[24px]">
					About Us
				</h2>
				<p className="text-[16px] lg:[18px] font-[400] text-[#515B6E] lg:text-center w-full max-w-[808px]">
					Bisats is the first peer-to-peer cryptocurrency platform in Nigeria
					trusted for its fast, secured and seamless vantage points in the
					Blockchain Ecosystem. Bisats rules other blockchain platforms using
					cutting-edge technologies and automation to provide financial
					solutions to the decade-long challenges of trading. 
				</p>
			</div>

			<div className="lg:py-[90px] px-[20px] flex flex-col lg:flex-row items-center justify-between lg:justify-center gap-[48px] lg:gap-[159px]">
				<div className="w-full lg:max-w-[603px]">
					<h2 className="text-[#0A0E12] font-[500] text-[32px] text-center lg:text-left mb-[16px]">
						We eliminate the middle man
					</h2>
					<p className="text-[18px] text-[#515B6E] font-[400]">
						With our innovation, we eliminate the middleman, filter
						insecurities, and help you prevent costly delays. Now you can hold,
						buy, and sell all your crypto assets with zero fees and instant
						execution. Our P2P trading platform allows you to trade securely,
						choose local currencies, and enjoy agreed-upon prices while
						minimizing the risk of slippage. 
					</p>
				</div>
				<div className="mb-[64px] lg:mb-0">
					<img src="/landingpage/About-us-image.png" alt="about-us-image" />
				</div>
			</div>
		</div>
	);
};

export default About;
