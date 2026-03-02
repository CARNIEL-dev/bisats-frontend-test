import { FacebookIcon, TwitterIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
// import { Separator } from "../../../../components/ui/separator";

// Define footer navigation data for better maintainability
const footerData = {
  site: {
    title: "SITE",
    links: [
      { name: "Home", url: "#" },
      { name: "Terms and Conditions", url: "/terms&condition" },

      { name: "T&C for Merchants", url: "#" },

      { name: "Policy", url: "/policy" },

      { name: "Blog", url: "#" },

      { name: "FAQs", url: "/faqs" },
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
    links: [{ name: "support@bisats.com", url: "mailto:hello@Bisats.org" }],
  },
};

export const FooterByAnima = (): React.ReactElement => {
  return (
    <footer className="w-full bg-accent-black py-20">
      {/* Newsletter Section */}
      <div className="flex flex-col items-center gap-6 mb-32">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-desktop-header5 text-[28px] font-semibold text-white leading-10">
            Join Our Newsletter
          </h3>
          <p className="font-desktop-body-3 text-greysgrey-2 text-[16px] leading-7">
            Get early notification to be part of our journey
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Input
              className="w-[431px] h-12 bg-[#2b303a33] rounded-[7px] border-[#624a00] text-greysgrey-6 px-5 py-3.5"
              placeholder="Email Address"
            />
          </div>
          <Button className="w-[203px] h-12 bg-primaryprimary-5 text-accent-black rounded-md shadow-shadow-black-shadows-black-e1 font-desktop-button text-[14px] font-semibold">
            Subscribe
          </Button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="flex justify-between px-20 mb-16">
        {/* Company Info */}
        <div className="flex flex-col gap-4 max-w-[326px]">
          <img className="w-[132.92px] h-8" alt="Logo" src="/logo.svg" />
          <p className="text-greysgrey-4 font-desktop-body-4 text-[14px] leading-6">
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
        <div className="flex gap-20">
          {/* Site Links */}
          <div className="flex flex-col gap-[21px]">
            <h4 className="font-desktop-header-7 text-neutralswhite text-[18px] font-semibold leading-8">
              {footerData.site.title}
            </h4>
            {footerData.site.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="font-desktop-body-3 text-greysgrey-4 text-[16px] leading-7"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Connect Links */}
          <div className="flex flex-col gap-[21px]">
            <h4 className="font-desktop-header-7 text-neutralswhite text-[18px] font-semibold leading-8">
              {footerData.connect.title}
            </h4>
            {footerData.connect.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="font-desktop-body-3 text-greysgrey-4 text-[16px] leading-7"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Contact Links */}
          <div className="flex flex-col gap-[21px]">
            <h4 className="font-desktop-header-7 text-neutralswhite text-[18px] font-semibold leading-8">
              {footerData.contact.title}
            </h4>
            {footerData.contact.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="font-desktop-body-3 text-greysgrey-4 text-[16px] leading-7"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      {/* <Separator className="border-t border-[#624a00]" /> */}
      <div className="border-t border-[#624a00]" />
      <div className="flex items-center justify-center gap-2 py-5">
        <img className="w-6 h-6" alt="Copyright" src="/icons8-copyright.svg" />
        <p className="font-desktop-body-4 text-greysgrey-6 text-[14px] text-center leading-6">
          2025, Bisats. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};
