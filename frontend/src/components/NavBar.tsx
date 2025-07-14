import React, { useState } from "react";
import { PrimaryButton, WhiteTransparentButton } from "./buttons/Buttons";
import { APP_ROUTES } from "../constants/app_route";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo/blackTextLogo.png";
import { UserState } from "../redux/reducers/userSlice";
import { useSelector } from "react-redux";
import Header from "./Header";

const NavBar = () => {
         const user: UserState = useSelector((state: any) => state.user);
    
	const [toggleMenu, setToggleMenu] = useState(false);
	const navLinks = [
		{ title: "About us", href: "/about" },
		{ title: "Blog", href: "#" },
		{ title: "Contact", href: "#" },
		// { title: "Sign In", href: "/auth/login" },
	];
	const navigate = useNavigate();

    return (
        <>
            {user?.isAuthenticated ? <Header currentPage={""} /> :

                <div className="bg-[#fff] lg:bg-[transparent] w-full sticky top-0 z-50">
                    <header className="flex items-center justify-between px-5 py-6 max-w-[1360px] mx-auto">
                        <Link to="/" className="cursor-pointer">
                            <img
                                className="w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8"
                                alt="Bisats Logo"
                                src={Logo}
                            />
                        </Link>

                        <nav className="hidden lg:flex items-center gap-10">
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
                        className={`bg-white w-full h-screen px-5 md:hidden flex flex-col fixed z-20 right-0 top-0 left-0 transition-all duration-300 ease-in-out transform
    ${toggleMenu
                                ? "translate-y-0 opacity-100"
                                : "-translate-y-5 opacity-0 pointer-events-none"
                            }`}
                    >
                        <header className="flex items-center justify-between  py-6 w-full lg:max-w-[1360px] mx-auto">
                            <Link to="/" className="cursor-pointer">
                                <img
                                    className="w-[100px] lg:w-[132.92px] h-[24px] object-fit lg:h-8"
                                    alt="Bisats Logo"
                                    src={Logo}
                                />
                            </Link>

                            <nav className="hidden lg:flex items-center gap-10">
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

                                {toggleMenu ?
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        onClick={() => setToggleMenu(!toggleMenu)}

                                    >
                                    <rect width="20" height="20" rx="10" fill="#F3F4F6" />
                                    <path d="M10.0025 8.82208L13.538 5.28653C13.8635 4.96109 14.3911 4.96109 14.7165 5.28653C15.042 5.61196 15.042 6.13959 14.7165 6.46502L11.181 10.0006L14.7165 13.5361C15.042 13.8615 15.042 14.3891 14.7165 14.7146C14.3911 15.04 13.8635 15.04 13.538 14.7146L10.0025 11.1791L6.46698 14.7146C6.14154 15.04 5.61391 15.04 5.28848 14.7146C4.96304 14.3892 4.96304 13.8615 5.28848 13.5361L8.82404 10.0006L5.28847 6.46503C4.96304 6.13959 4.96304 5.61196 5.28847 5.28652C5.61391 4.96108 6.14154 4.96108 6.46698 5.28652L10.0025 8.82208Z" fill="#707D96" />
                                </svg>
                                    :
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
                                    </svg>}
                            </div>
                        </header>
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
                </div>}
        </>

	);
};

export default NavBar;
