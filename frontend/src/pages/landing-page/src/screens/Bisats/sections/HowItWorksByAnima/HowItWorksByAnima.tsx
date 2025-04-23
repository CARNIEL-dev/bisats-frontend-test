import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import DepositIcon from "../../../../../../../assets/icons/deposit 1.png"
import Alter from "../../../../../../../assets/icons/alter 1.png"
import Withdraw from "../../../../../../../assets/icons/withdraw 1.png"


export const HowItWorksByAnima = (): JSX.Element => {
  // Data for the steps cards
  const steps = [
    {
      id: 1,
      title: "Make a deposit",
      description: "Fund your wallets with cash or crypto",
      iconAlt: "Deposit",
      iconSrc: DepositIcon, // Assuming the original had an image here
    },
    {
      id: 2,
      title: "Exchange your asset",
      description: "Make a p2p swap on Bisats, fast and easy",
      iconAlt: "Alter",
      iconSrc: Alter, // Assuming the original had an image here
    },
    {
      id: 3,
      title: "Make a withdrawal",
      description: "Make Withdrawals to your bank or cypto wallet.",
      iconAlt: "Withdraw",
      iconSrc: Withdraw, // Assuming the original had an image here
    },
  ];

  return (
    <section className="w-full py-20 px-5 lg:py-28 bg-[#fcfcfc]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-1 mb-12">
          <h2 className="text-[28px] lg:text-[42px] text-center leading-[56px]">
            <span className="text-[#0a0e12] font-semibold">How </span>
            <span className="font-semibold text-[#f5bb00]">Bisats</span>
            <span className="text-[#0a0e12] font-semibold"> Works</span>
          </h2>
          <p className="font-normal text-greysgrey-8 text-base text-center leading-6">
            Use Bisats in 3 easy steps
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-[60px]">
          {steps.map((step) => (
            <Card
              key={step.id}
              className="w-full lg:w-[356px] h-[150px] rounded-xl border border-solid border-[#f3f3f6] [background:linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(246,247,248,1)_100%)] relative overflow-hidden"
            >
              <CardContent className="flex flex-col h-full items-start  lg:gap-2 p-4">
                <div className="absolute top-[71px] right-[16px] opacity-10 font-desktop-header2 text-accent-dark-blue text-[54px] leading-[64px]">
                  {step.id}
                </div>

                <img
                  className="w-12 h-12 object-cover"
                  alt={step.iconAlt}
                  src={step.iconSrc}
                />

                <h3 className="font-desktop-header6 text-greysgrey-10 text-[22px] leading-[32px] font-semibold">
                  {step.title}
                </h3>

                <p className="font-desktop-body-4 text-greysgrey-8 text-[14px] leading-[24px]">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
