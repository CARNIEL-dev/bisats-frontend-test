import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import NavBar from "../../../../../../../components/NavBar";
import PrimaryInput from "../../../../../../../components/Inputs/PrimaryInput";
import { TokenData } from "../../../../../../../data";
import { PrimaryButton } from "../../../../../../../components/buttons/Buttons";
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
    <section className="relative w-full bg-[#0A0E12] h-[100vh]">
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute w-full h-full top-0 left-0 bg-[#0A0E12] opacity-30" />
       
        {/* Main content */}
        <div className="flex flex-wrap justify-between py-20 px-5 lg:px-20 lg:py-48 relative z-10">
          {/* Left content */}
          <div className="flex flex-col text-center lg:text-left  lg:w-[740px] items-start gap-4">
            <h1 className="text-[22px] leading-[32px] font-[600] lg:text-[54px] font-[700] text-[#FFFFFF] lg:leading-[64px]">
              Seamlessly Convert Between Fiat and Crypto – <span className="text-[#F5BB00]">Fast, Simple, Secure</span>
            </h1>
            <p className="w-full lg:w-[541px] text-[14px] leading-[24px]  lg:text-[18px] lg:leading-[32px] font-desktop-body-2 text-[#ADB5C3]">
              With Bisats, you can say goodbye to your struggles with crypto
              peer-to-peer exchanges
            </p>
            <img src={coinss} alt="logo-cluster" className="h-[24px] mx-auto lg:mx-0"/>

           
          </div>

          {/* Exchange card */}
          <div className="w-full mt-10 lg:mt-0 lg:w-[453px] p-3 lg:p-6 pb-2 h-fit rounded-xl border-[1px] border-[#121A21] backdrop-blur-[3px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(3px)_brightness(100%)] [background:linear-gradient(136deg,rgba(18,26,33,0.05)_0%,rgba(74,108,135,0.05)_100%)] border">
            <div>
              <div className='relative'>
                <PrimaryInput css={'w-full h-[48px] lg:h-[64px] bg-[#10161E] border-[1px] border-[#23272F]'} label={'You’re selling'} error={undefined} touched={undefined} />
                <div className='absolute right-3 top-8 lg:top-10'>

                  <button

                    className={`text-[#515B6E] p-2.5 px-4 bg-[#10161E]  border border-[#23272F] h-[48px] rounded-[8px] rounded inline-flex items-center lg:w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                    type="button"
                  >
                    {/* <Typography.Text> */}
                    {TokenData[1].tokenLogo}

                    <div className="mx-3">

                      {TokenData[1].tokenName}
                    </div>
                    {/* </Typography.Text> */}
                  </button>
                  {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                </div>
              </div>
              <div className='relative my-5'>
                <PrimaryInput css={'w-full h-[48px] lg:h-[64px] bg-[#10161E] border-[1px] border-[#23272F]'} label={'You’ll receive'} error={undefined} touched={undefined} />
                <div className='absolute right-3 top-8 lg:top-10'>

                  <button

                    className={`text-[#515B6E] p-2.5 px-4 bg-[#10161E]  border border-[#23272F] h-[48px] rounded-[8px] rounded inline-flex items-center lg:w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                    type="button"
                  >
                    {/* <Typography.Text> */}
                    {TokenData[0].tokenLogo}

                    <div className="mx-3">

                      {TokenData[0].tokenName}
                    </div>
                    {/* </Typography.Text> */}


                  </button>
                  {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                </div>
                <p className='text-[#515B6E] text-[14px] font-[400] my-5'><span>1 USDT</span>  ≈ <span>1,661.66166 xNGN</span> <span className='text-[#17A34A] text-[12px] font-[600] bg-[#EFFEF41A]  border p-[0.6px] rounded border-[#EFFEF41A]'> 30 s</span></p>

                {/* <small className='text-[#606C82] text-[12px] font-[400]'>Balance: 20,000 xNGN</small> */}
                <PrimaryButton text={"Exchange"} loading={false} css="w-full "/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
