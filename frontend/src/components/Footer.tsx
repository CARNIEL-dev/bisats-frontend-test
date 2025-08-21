import { footerData, LoggedInLinks } from "@/data/navlinks";
import { cn } from "@/utils";
import { FacebookIcon, TwitterIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import BisatLogo from "@/components/shared/Logo";
import MaxWidth from "./shared/MaxWith";

// Define footer navigation data for better maintainability

export const Footer = (): JSX.Element => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const isAuth = user?.isAuthenticated;

  return (
    <>
      {isAuth ? (
        <footer className="w-full flex flex-wrap items-center justify-between border-t border-[#D6DAE1] h-[56px]  bg-white">
          <div className="flex px-5 items-center w-full lg:w-3/4 mx-auto  justify-between">
            <div className="w-full lg:w-1/3 flex items-center justify-between">
              {LoggedInLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link?.link}
                  className="text-[#515B6E] text-[14px] leading-[24px] font-normal cursor-pointer"
                >
                  {link?.title}
                </a>
              ))}
            </div>
            <div className="flex items-end justify-end w-2/3 md:w-auto scale-75">
              <BisatLogo />
            </div>
          </div>
        </footer>
      ) : (
        <div className="w-full bg-[#0A0E12] px-5 py-10 lg:pt-28">
          <MaxWidth className="max-w-[120rem]">
            {/* SUB: Newsletter Section */}
            <div className="flex flex-wrap md:flex-col items-center gap-6 mb-32">
              <div className="flex flex-col items-center text-center gap-2">
                <h3 className="text-center font-desktop-header5 text-[28px] font-semibold text-white leading-[40px]">
                  Join Our Newsletter
                </h3>
                <p className=" text-center font-desktop-body-3 text-[#D6DAE1] text-[16px] leading-[28px]">
                  Get early notification to be part of our journey
                </p>
              </div>

              <div className="flex items-center w-full md:w-[50%]  gap-4 lg:flex-row flex-col lg:h-[48px]">
                <Input
                  placeholder="Email Address"
                  className={cn(
                    "w-full lg:h-full h-[50px] border border-primary text-slate-600"
                  )}
                />
                <Button className={cn("px-5 py-3 w-full lg:w-[30%] h-full")}>
                  Subscribe
                </Button>
              </div>
            </div>

            {/* SUB: Main Footer Content */}
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
                  <h4 className="font-desktop-header-7 text-white text-[18px] font-semibold leading-8">
                    {footerData.site.title}
                  </h4>
                  {footerData.site.links.map((link, index) => (
                    <NavLink
                      key={index}
                      to={link.url}
                      className="font-desktop-body-3 text-[#ADB5C3] text-[16px] leading-7"
                    >
                      {link.name}
                    </NavLink>
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

            {/* SUB: Copyright Section */}
            <hr className="border-t border-[#624a00]" />
            <div className="flex items-center justify-center gap-2 py-3">
              <img
                className="w-6 h-6"
                alt="Copyright"
                src="/icons8-copyright.svg"
              />
              <p className="font-desktop-body-4 text-[#ADB5C3] text-[14px] text-center leading-6">
                2025, Bisats. All Rights Reserved
              </p>
            </div>
          </MaxWidth>
        </div>
      )}
    </>
  );
};
