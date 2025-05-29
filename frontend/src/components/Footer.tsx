import { FacebookIcon, TwitterIcon } from "lucide-react";
import React from "react";
import PrimaryInput from "./Inputs/PrimaryInput";
import { PrimaryButton } from "./buttons/Buttons";
import { useSelector } from "react-redux";
import { UserState } from "../redux/reducers/userSlice";


// Define footer navigation data for better maintainability
const footerData = {

    site: {
        title: "Pages",
        links: [
            { name: "Home", url: "#" },
            { name: "Terms and Conditions", url: "#" },

            { name: "T&C for Merchants", url: "#" },
            { name: "Policy", url: "#" },
            { name: "Blog", url: "#" },
            { name: "FAQs", url: "#" },


        ],
    },
    connect: {
        title: "CONNECT",
        links: [
            { name: "X (Twitter)", url: "#" },
            { name: "Instagram", url: "#" },
            { name: "Facebook", url: "#" },


        ],
    },
    contact: {
        title: "Contact",
        links: [{ name: "support@Bisats.org", url: "mailto:support@Bisats.org" }],
    },
};

const LoggedInLinks = [
    {
        title:"Support",
        link: "mailto:support@Bisats.org",
    },
      {
          title: "FAQs",
        link: "",
      },
        {
        title: "Terms of Service",
        link: "",
    }
]

export const Footer = (): JSX.Element => {
    const user = useSelector((state: { user: UserState }) => state.user);
    const isAuth=user?.isAuthenticated

    return (
        <>
            {
                isAuth ?
            
                    <footer className="w-full flex flex-wrap items-center justify-between border-t-[1px] border-[#D6DAE1] h-[56px] fixed bottom-0 bg-[#fff]">
                        <div className="flex px-5 items-center w-full lg:w-3/4 mx-auto  justify-between">
                            <div className="w-full lg:w-1/3 flex items-center justify-between">
                                {
                                    LoggedInLinks.map((link, idx) => <p key={idx} className="text-[#515B6E] text-[14px] leading-[24px] font-[400] cursor-pointer">{link?.title}</p>)
                                }
                            </div>
                            <div className="flex items-end justify-end w-2/3">
                                <div className="font-bold">
                                    <img src="/logo-dash.png" alt="Logo" className="w-[80px] cursor-pointer h-[20px] md:w-[100px] md:h-[24px]" />
                                </div>

                            </div>
                        </div>
                     
                
                    </footer> :
                    <footer className="w-full bg-[#0A0E12] px-5 py-10 lg:pt-28">
                        {/* Newsletter Section */}
                        <div className="flex flex-wrap lg:flex-col items-center gap-6 mb-32">
                            <div className="flex flex-col items-center text-center gap-2">
                                <h3 className="text-center font-desktop-header5 text-[28px] font-semibold text-white leading-[40px]">
                                    Join Our Newsletter
                                </h3>
                                <p className=" text-center font-desktop-body-3 text-[#D6DAE1] text-[16px] leading-[28px]">
                                    Get early notification to be part of our journey
                                </p>
                            </div>

                            <div className="flex flex-wrap items-start w-full lg:w-[50%] border h-[48px]">
                                <div className="relative w-full lg:w-[70%] h-full">
                                    <PrimaryInput
                                        placeholder="Email Address" css={"w-full border-[1px] border-[#F5BB00] h-full bg-[#2B313B33]"} label={""} error={undefined} touched={undefined} />
                                </div>
                                <div className="w-full lg:w-[30%] h-full">
                                    <PrimaryButton
                                        text={"Subscribe"} loading={false} css="w-full  mt-5 lg:mt-1.5 lg:ml-5" />
                                </div>
                    
                   
                            </div>
                        </div>

                        {/* Main Footer Content */}
                        <div className="flex flex-wrap justify-between lg:px-20 mb-16">
                            {/* Company Info */}
                            <div className="flex flex-col gap-4 max-w-[326px]">
                                <img className="w-[132.92px] h-8" alt="Logo" src="/logo.svg" />
                                <p className="text-[#ADB5C3] font-desktop-body-4 text-[14px] leading-6">
                                    Exchange your crypto assets in a fast, secure and fraudproof
                                    platform with our escrow system.
                                </p>
                                <div className="flex gap-6">
                                    <div className="w-8 h-8 rounded-[20px] bg-neutralswhite bg-opacity-20 flex items-center justify-center">
                                        <FacebookIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-8 h-8 rounded-[20px] bg-neutralswhite bg-opacity-20 flex items-center justify-center">
                                        <TwitterIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Columns */}
                            <div className="flex  flex-wrap gap-20">
                                {/* Site Links */}
                                <div className="flex flex-col gap-[21px]">
                                    <h4 className="font-desktop-header-7 text-[#fff] text-[18px] font-semibold leading-8">
                                        {footerData.site.title}
                                    </h4>
                                    {footerData.site.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className="font-desktop-body-3 text-[#ADB5C3] text-[16px] leading-7"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>

                                {/* Connect Links */}
                                <div className="flex flex-col gap-[21px]">
                                    <h4 className="font-desktop-header-7 text-white text-[18px] font-semibold leading-8">
                                        {footerData.connect.title}
                                    </h4>
                                    {footerData.connect.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className="font-desktop-body-3 text-[#ADB5C3] text-[16px] leading-7"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>

                                {/* Contact Links */}
                                <div className="flex flex-col gap-[21px]">
                                    <h4 className="font-desktop-header-7 text-white text-[18px] font-semibold leading-8">
                                        {footerData.contact.title}
                                    </h4>
                                    {footerData.contact.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className="font-desktop-body-3 text-[#ADB5C3] text-[16px] leading-7"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <hr className="border-t border-[#624a00]" />
                        <div className="flex items-center justify-center gap-2 py-3">
                            <img className="w-6 h-6" alt="Copyright" src="/icons8-copyright.svg" />
                            <p className="font-desktop-body-4 text-[#ADB5C3] text-[14px] text-center leading-6">
                                2025, Bisats. All Rights Reserved
                            </p>
                        </div>
                    </footer>}
        </>
    );
};
