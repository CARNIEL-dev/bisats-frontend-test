import React from "react";
import { ChangingTheByAnima } from "./sections/ChangingTheByAnima";
import { HeroSectionByAnima } from "./sections/HeroSectionByAnima";
import { HowItWorksByAnima } from "./sections/HowItWorksByAnima";
import { MobileAppByAnima } from "./sections/MobileAppByAnima";
import NavBar from "../../../../../components/NavBar";

export const Bisats = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col items-center w-full overflow-hidden ">
      <div className="w-full max-w-[1440px]">
        <div className="flex flex-col w-full">
          <div className="bg-[#fff] py-10 lg:pb-0">
            <div className="lg:bg-[#fff] w-full fixed z-[400] top-0 w-full ">
            <NavBar />
            </div>
           
            <div className=" pt-20">
              <HeroSectionByAnima />

</div>
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
