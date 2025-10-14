import Alter from "@/assets/icons/alter 1.png";
import DepositIcon from "@/assets/icons/deposit 1.png";
import Withdraw from "@/assets/icons/withdraw 1.png";
import MaxWidth from "@/components/shared/MaxWith";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

//? Mobile Images

export const HowItWorksByAnima = (): JSX.Element => {
  const isMobile = useIsMobile();
  const steps = [
    {
      id: 1,
      title: "Make a deposit",
      image: isMobile
        ? "/landingpage/mobile/deposit.webp"
        : "/landingpage/deposit.png",
      description: "Fund your wallets with cash or crypto",
      iconAlt: "Deposit",
      iconSrc: DepositIcon,
      mobileImage: "/landingpage/mobile/deposit.webp",
    },
    {
      id: 2,
      title: "Exchange your asset",
      description: "Make a p2p swap on Bisats, fast and easy",
      iconAlt: "Alter",
      image: isMobile
        ? "/landingpage/mobile/exchange.webp"
        : "/landingpage/exchange.png",
      iconSrc: Alter,
      mobileImage: "/landingpage/mobile/exchange.webp",
    },
    {
      id: 3,
      title: "Make a withdrawal",
      description: "Make Withdrawals to your bank or cypto wallet.",
      iconAlt: "Withdraw",
      image: isMobile
        ? "/landingpage/mobile/withdrawal.webp"
        : "/landingpage/withdrawal.png",
      iconSrc: Withdraw,
      mobileImage: "/landingpage/mobile/withdrawal.webp",
    },
  ];

  return (
    <MaxWidth as="section" className=" 2xl:max-w-[100rem] bg-[#FDFDFC]">
      <div className="">
        <div className="flex flex-col items-center gap-1 mb-12">
          <h2 className="text-[28px] font-medium text-[#0A0E12] lg:text-[42px] text-center leading-[40px] lg:leading-[56px] lg:w-3/5">
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
              className="w-full md:w-[280px] lg:w-[356px] h-[464px] lg:h-auto rounded-xl border [background:linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(246,247,248,1)_100%)] relative overflow-hidden md:last:mx-auto lg:last:mx-0 p-0 pb-2"
            >
              <CardContent className="flex flex-col h-full items-start  lg:gap-2 p-3">
                <img
                  className="w-full h-[300px] mb-3"
                  src={step.image}
                  alt={step.iconAlt}
                  loading="lazy"
                  srcSet={`
${step.mobileImage} 480w,
    ${step.image}       1024w
  `}
                  sizes="(max-width: 600px) 100vw, 1024px"
                />
                <img
                  className="w-10 h-10 object-cover"
                  alt={step.iconAlt}
                  src={step.iconSrc}
                  loading="lazy"
                />

                <h3 className="font-desktop-header6 text-greysgrey-10 text-[22px] leading-[32px] font-semibold">
                  {step.title}
                </h3>

                <p className=" text-[#606C82] text-[14px] leading-[24px]">
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
