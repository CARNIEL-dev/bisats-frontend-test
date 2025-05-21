import { BuildingIcon, LockIcon, ShieldIcon, ZapIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import LogoPulse from "../../../../../../../assets/icons/bisats logo.png"


// Feature card data for mapping
const featureCards = [
  {
    title: "Speedy Transactions",
    description:"Time is money, and we value yours. Our platform helps you trade faster while you enjoy seamless experience.",
    icon: (
      <ZapIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Fraud proof",
    description:"We know the pain in the crypto market. So we beat other platforms through our escrow protection and thorough verification processes. We ensure that every profile is genuine, validated, and secured for transaction.",
    icon: (
      <ShieldIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Regulatory Compliant",
    description: "We don’t just give you our words; we adhere strictly to legal policies and regulatory standard both locally and internationally.Bisats is that platform you use with confidence.",
    icon: (
      <BuildingIcon className="w-[137px] h-[137px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Secure",
    description: "Protecting your assets is our top priority. With our advanced encryption and secured wallets, you experience zero market risk or losses.",
    icon: (
      <LockIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
];

export const ChangingTheByAnima = (): JSX.Element => {
  return (
    <section className="w-full py-20 bg-white w-[98%] mx-auto">
      <div className="container mx-auto">
        <h2 className="mb-16 font-['Geist',Helvetica] text-[42px] leading-[56px]">
          <span className="text-[#2B313B] font-semibold">Bettering the peer-to-peer experience-<br />
            </span>
          <span className="font-desktop-header3 font-semibold text-[#C49600]">
          How Bisats Dominate Others          </span>
         
        </h2>

        <div className="relative ">
          {/* Vector connecting lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              className="w-[121px] h-[293px] relative -left-[80px]"
              alt="Vector"
              src="/vector-1.svg"
            />
            <img
              className="w-[121px] h-[293px] relative left-[80px]"
              alt="Vector"
              src="/vector-2.svg"
            />
          </div>

          {/* Center logo */}
          <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[172px] h-[172px] bg-primaryprimary-1 rounded-full flex items-center justify-center z-10">
            <div className="w-[172px] h-[172px] bg-primaryprimary-3 rounded-full flex items-center justify-center">
              <div className=" bg-primaryprimary-5 rounded-full border border-solid border-[#fdf1cc] flex items-center justify-center">
                <img
                  className="w-[172px] h-[172px]"
                  alt="Logo transparency"
                  src={LogoPulse}
                />
              </div>
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-2 gap-x-[552px] gap-y-[142px] mx-auto  flex items-between">
            {featureCards.map((card, index) => (
              <Card
                key={index}
                className="w-[356px] h-[180px] rounded-xl border border-solid border-[#f3f3f6] [background:linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(246,247,248,1)_100%)]"
              >
                <CardContent className="p-4 flex flex-col gap-2 h-full relative">
                  {/* <div className="absolute top-[41px] right-4">{card.icon}</div> */}
                  <h3 className="font-desktop-header6 font-semibold text-primaryprimary-9 text-[22px] leading-[32px]">
                    {card.title}
                  </h3>
                  <p className="font-[400] text-greysgrey-9 text-[12.5px] leading-[24px]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
