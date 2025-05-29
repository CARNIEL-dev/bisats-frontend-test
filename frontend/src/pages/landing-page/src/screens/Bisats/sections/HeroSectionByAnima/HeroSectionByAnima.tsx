import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import NavBar from "../../../../../../../components/NavBar";
import PrimaryInput from "../../../../../../../components/Inputs/PrimaryInput";
import { TokenData } from "../../../../../../../data";
import { PrimaryButton, WhiteTransparentButton } from "../../../../../../../components/buttons/Buttons";
import coinss from "../../../../../../../assets/icons/coinss.png"

export const HeroSectionByAnima = (): JSX.Element => {
  
  // Cryptocurrency icons data
  const cryptoIcons = [
    {
      src: "",
      innerSrc: "/shape-3.svg",
      innerClass: "w-2 h-2.5 top-1.5 left-2",
    },
    { src: "/cryptocurrency.svg", class: "ml-[-5px]" },
    {
      src: "/shape-5.svg",
      class: "ml-[-5px]",
      hasInnerContent: true,
    },
    { src: "/tradable-assets-1.svg", class: "ml-[-5px]" },
    { src: "/tradable-assets.svg", class: "ml-[-5px]" },
  ];

  return (
    <section className="relative w-full h-[85vh]">
      <div className="relative">
        {/* Background gradient */}
        {/* Main content */}
        <div className="flex flex-wrap justify-between items-center py-20 px-5 lg:px-20 lg:py-2 relative z-10">
          {/* Left content */}
          <div className="flex flex-col text-center lg:text-left lg:w-[740px] items-start gap-4">
            <img src={coinss} alt="logo-cluster" className="h-[24px] mx-auto lg:mx-0" />
            <h1 className="text-[22px] leading-[32px] font-[600] lg:text-[64px] font-[500] text-[#0A0E12] lg:leading-[72px]">
            Trade, Rest, and <br/> Stay Happy 
            </h1>
            <p className="w-full lg:w-[541px] text-[14px] leading-[24px]  lg:text-[20px] lg:leading-[32px] font-[400] text-[#515B6E]">
              With Bisats, you can say goodbye to your struggles with crypto
              peer-to-peer exchanges
            </p>

            <div className="flex items-center w-4/6 ">
              <PrimaryButton text={"Create an Account"} loading={false} css="w-1/2 mr-3" />
              <WhiteTransparentButton text={"Sign In"} loading={false} css="border-[1px] w-1/2 border-[#F3F4F6] bg-[#F6F7F8] text-[#181300]" />
              
           </div>
          </div>

          {/* Exchange card */}
          <div className="w-full mt-10 lg:mt-0 lg:w-[539px] p-3 lg:p-6 pb-2 h-fit lg:h-[614px] rounded-xl ">
            <img alt='hero-phone-image' src="landingpage/HeroPhone.png" />
          </div>
        </div>
      </div>
    </section>
  );
};
