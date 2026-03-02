import React from "react";
import { ChangingTheByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/ChangingTheByAnima";
import { HeroSectionByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/HeroSectionByAnima";
import { HowItWorksByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/HowItWorksByAnima";
// import MockApp from "@/components/shared/MockApp";
// import { MobileAppByAnima } from "@/pages/landing-page/src/screens/Bisats/sections/MobileAppByAnima";

export const LandingPage = (): React.ReactElement => {
  return (
    <>
      <div className="flex flex-col gap-x-10 gap-y-2 my-8 md:mt-0">
        <HeroSectionByAnima />
        <HowItWorksByAnima />
        <ChangingTheByAnima />
        {/* <MockApp /> */}
      </div>
      {/* <MobileAppByAnima /> */}
    </>
  );
};
