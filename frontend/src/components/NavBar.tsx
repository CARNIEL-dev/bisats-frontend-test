import React, { useState } from "react";
import { PrimaryButton, WhiteTransparentButton } from "./buttons/Buttons";
import { APP_ROUTES } from "../constants/app_route";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo/blackTextLogo.png";

const NavBar = () => {
	const [toggleMenu, setToggleMenu] = useState(false);
	const navLinks = [
		{ title: "About us", href: "/about" },
		{ title: "Blog", href: "#" },
		{ title: "Contact", href: "#" },
		// { title: "Sign In", href: "/auth/login" },
	];
	const navigate = useNavigate();

	return (
		<div className="bg-[#fff] lg:bg-[transparent] w-full sticky top-0 z-50">
			<header className="flex items-center justify-between px-5 py-6 max-w-[1360px] mx-auto">
				<Link to="/" className="cursor-pointer">
					<img
						className="w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8"
						alt="Bisats Logo"
						src={Logo}
					/>
				</Link>

				<nav className="lg:flex items-center gap-10">
					{navLinks.map((link, index) => (
						<a
							key={index}
							href={link.href}
							className="font-[400] text-[14px] leading-[24px] text-[#515B6E] text-center whitespace-nowrap cursor-pointer"
						>
							{link.title}
						</a>
					))}
					<WhiteTransparentButton
						text={"Sign In"}
						loading={false}
						css="border-[1px] w-full border-[#F3F4F6] bg-[#F6F7F8] text-[#181300] px-[44px] py-[12px]"
						onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
					/>

					<PrimaryButton
						css="w-full px-[44px] py-[12px]"
						text={"Sign Up"}
						loading={false}
						onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}
					/>
				</nav>

				<div className="md:hidden">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						onClick={() => setToggleMenu(!toggleMenu)}
					>
						<path
							d="M3 7H21"
							stroke="#515B6E"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M3 12H21"
							stroke="#515B6E"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M3 17H21"
							stroke="#515B6E"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</div>
			</header>
			<div
				className={`bg-white w-full h-screen px-5 md:hidden flex flex-col fixed z-20 right-0 left-0 transition-all duration-300 ease-in-out transform
    ${
			toggleMenu
				? "translate-y-0 opacity-100"
				: "-translate-y-5 opacity-0 pointer-events-none"
		}`}
			>
				{navLinks.map((link, index) => (
					<a
						key={index}
						href={link.href}
						className="font-[400] my-3 w-full text-[14px] leading-[24px] text-[#515B6E] text-left whitespace-nowrap cursor-pointer"
					>
						{link.title}
					</a>
				))}
				<WhiteTransparentButton
					text={"Sign In"}
					loading={false}
					css="border-[1px] w-full lg:w-[133px] border-[#F3F4F6] bg-[#F6F7F8] mb-4 text-[#181300]"
					onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
				/>

				<PrimaryButton
					css="w-full"
					text={"Sign Up"}
					loading={false}
					onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}
				/>
			</div>
		</div>
	);
};

export default NavBar;
