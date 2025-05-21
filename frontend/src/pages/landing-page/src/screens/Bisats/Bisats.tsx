import React from "react";
import { ChangingTheByAnima } from "./sections/ChangingTheByAnima";
import { ChangingThePpByAnima } from "./sections/ChangingThePpByAnima";
import { HeroSectionByAnima } from "./sections/HeroSectionByAnima";
import { HowItWorksByAnima } from "./sections/HowItWorksByAnima";
import { MobileAppByAnima } from "./sections/MobileAppByAnima";
import NavBar from "../../../../../components/NavBar";
import { Footer } from "../../../../../components/Footer";

export const Bisats = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[1440px]">
        <div className="flex flex-col w-full">
          <div className="bg-[#fff]">
            <NavBar />
            <HeroSectionByAnima />
          </div>
          <HowItWorksByAnima />
          <ChangingTheByAnima />
          {/* <ChangingThePpByAnima /> */}
          <MobileAppByAnima />
          {/* <Footer/> */}
        </div>
      </div>
    </div>
  );
};
