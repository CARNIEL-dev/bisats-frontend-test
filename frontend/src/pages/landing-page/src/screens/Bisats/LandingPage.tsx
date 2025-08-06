import MaxWidth from "@/components/shared/MaxWith";
import { ChangingTheByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/ChangingTheByAnima";
import { HeroSectionByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/HeroSectionByAnima";
import { HowItWorksByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/HowItWorksByAnima";
import { MobileAppByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/MobileAppByAnima";

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <div className="flex flex-col gap-10 mt-8 md:mt-0">
        <HeroSectionByAnima />
        <HowItWorksByAnima />
        <ChangingTheByAnima />
      </div>
      <MobileAppByAnima />
    </>
  );
};
