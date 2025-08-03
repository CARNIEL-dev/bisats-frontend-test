import { Card, CardContent } from "@/components/ui/card";
import DepositIcon from "@/assets/icons/deposit 1.png";
import Alter from "@/assets/icons/alter 1.png";
import Withdraw from "@/assets/icons/withdraw 1.png";
import MaxWidth from "@/components/shared/MaxWith";

export const HowItWorksByAnima = (): JSX.Element => {
  // Data for the steps cards
  const steps = [
    {
      id: 1,
      title: "Make a deposit",
      image: "/landingpage/deposit.png",
      description: "Fund your wallets with cash or crypto",
      iconAlt: "Deposit",
      iconSrc: DepositIcon, // Assuming the original had an image here
    },
    {
      id: 2,
      title: "Exchange your asset",
      description: "Make a p2p swap on Bisats, fast and easy",
      iconAlt: "Alter",
      image: "/landingpage/exchange.png",
      iconSrc: Alter, // Assuming the original had an image here
    },
    {
      id: 3,
      title: "Make a withdrawal",
      description: "Make Withdrawals to your bank or cypto wallet.",
      iconAlt: "Withdraw",
      image: "/landingpage/withdrawal.png",
      iconSrc: Withdraw, // Assuming the original had an image here
    },
  ];

  return (
    <MaxWidth as="section" className=" 2xl:max-w-[100rem] bg-[#FDFDFC]">
      <div className="">
        <div className="flex flex-col items-center gap-1 mb-12">
          <h2 className="text-[28px] text-[#0A0E12] lg:text-[42px] text-center leading-[40px] lg:leading-[56px] lg:w-3/5">
            At Bisats, you start and end every transactions with peace of mind.
          </h2>
          <p className="font-normal text-[#606C82] text-[16px] text-center leading-[28px]">
            Transact in 3 Simple Steps:
          </p>
        </div>

        <div className="flex mx-auto max-w-[70rem] 2xl:max-w-[80rem] flex-wrap justify-between gap-6">
          {steps.map((step) => (
            <Card
              key={step.id}
              className="w-full md:w-[280px] lg:w-[356px] h-[464px] lg:h-[504px] rounded-xl border [background:linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(246,247,248,1)_100%)] relative overflow-hidden md:last:mx-auto lg:last:mx-0"
            >
              <CardContent className="flex flex-col h-full items-start  lg:gap-2 p-4">
                <img
                  className="w-full h-[300px] mb-3"
                  src={step.image}
                  alt={step.iconAlt}
                />
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
    </MaxWidth>
  );
};
