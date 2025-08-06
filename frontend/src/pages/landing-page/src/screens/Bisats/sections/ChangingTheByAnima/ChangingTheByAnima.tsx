import { BuildingIcon, LockIcon, ShieldIcon, ZapIcon } from "lucide-react";

import LogoPulse from "@/assets/icons/bisats logo.png";
import Mobile_Features from "@/assets/landingPage/mobile_features.png";
import { Card, CardContent } from "@/components/ui/card";
import MaxWidth from "@/components/shared/MaxWith";
import { cn } from "@/utils";

// Feature card data for mapping
const featureCards = [
  {
    title: "Speedy Transactions",
    description:
      "Time is money, and we value yours. Our platform helps you trade faster while you enjoy seamless experience.",
    icon: (
      <ZapIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Fraud proof",
    description:
      "We know the pain in the crypto market. So we beat other platforms through our escrow protection and thorough verification processes. We ensure that every profile is genuine, validated, and secured for transaction.",
    icon: (
      <ShieldIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Regulatory Compliant",
    description:
      "We don’t just give you our words; we adhere strictly to legal policies and regulatory standard both locally and internationally.Bisats is that platform you use with confidence.",
    icon: (
      <BuildingIcon className="w-[137px] h-[137px] text-primaryprimary-5 opacity-50" />
    ),
  },
  {
    title: "Secure",
    description:
      "Protecting your assets is our top priority. With our advanced encryption and secured wallets, you experience zero market risk or losses.",
    icon: (
      <LockIcon className="w-[98px] h-[98px] text-primaryprimary-5 opacity-50" />
    ),
  },
];

export const ChangingTheByAnima = (): JSX.Element => {
  return (
    <MaxWidth className=" max-w-[78rem] 2xl:max-w-[90rem] md:mt-16 mt-8">
      <div className="">
        <h2 className="mb-8 lg:mb-16 text-[#2B313B] font-medium text-[28px] lg:text-[42px] text-center lg:text-start 2xl:text-center leading-[40px] lg:leading-[56px]">
          <span className="">
            Bettering the peer-to-peer experience-
            <br />
          </span>
          <span className=" text-[#C49600]">How Bisats Dominate Others </span>
        </h2>

        <div className="relative mx-auto max-w-[75rem] ">
          {/* Vector connecting lines */}
          <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
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
          <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-[172px] size-[100px]  lg:h-[172px] bg-primaryprimary-1 rounded-full flex items-center justify-center z-10">
            <div className=" bg-primaryprimary-3 rounded-full flex items-center justify-center">
              <div className=" bg-primaryprimary-5 rounded-full border border-solid border-[#fdf1cc] flex items-center justify-center">
                <img
                  className="animate-pulse"
                  alt="Logo transparency"
                  src={LogoPulse}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-2 justify-items-end gap-8 lg:gap-y-[142px]">
            {featureCards.map((card, index) => (
              <Card
                key={index}
                className={cn(
                  "lg:w-[356px] rounded-xl border border-[#f3f3f6] [background:linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(246,247,248,1)_100%)]",
                  index % 2 === 0 && "justify-self-start"
                )}
              >
                <CardContent className="flex flex-col gap-2 h-full relative">
                  <h3 className="font-semibold  text-[22px]">{card.title}</h3>
                  <p className="font-normal text-gray-600 text-[13px] leading-[24px]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MaxWidth>
  );
};
