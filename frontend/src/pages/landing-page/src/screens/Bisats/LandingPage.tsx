import MaxWidth from "@/components/shared/MaxWith";
import { ChangingTheByAnima } from "./sections/ChangingTheByAnima";
import { HeroSectionByAnima } from "./sections/HeroSectionByAnima";
import { HowItWorksByAnima } from "./sections/HowItWorksByAnima";
import { MobileAppByAnima } from "./sections/MobileAppByAnima";

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <MaxWidth className="flex flex-col gap-10">
        <HeroSectionByAnima />
        <HowItWorksByAnima />
        <ChangingTheByAnima />
      </MaxWidth>
      <MobileAppByAnima />
    </>
  );
};
