
import { PrimaryButton, WhiteTransparentButton } from "../../../../../../../components/buttons/Buttons";
import coinss from "../../../../../../../assets/icons/coinss.png"
import HeroImage from "../../../../../../../assets/landingPage/heroPhone copy.png"
import { APP_ROUTES } from "../../../../../../../constants/app_route";
import {  useNavigate } from "react-router-dom";

export const HeroSectionByAnima = (): JSX.Element => {
  const navigate=useNavigate()

  return (
    <section className="relative w-full lg:h-[85vh] 2xl:h-fit  lg:py-0">
      <div className="relative">
        {/* Background gradient */}
        {/* Main content */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center py-10 px-5 lg:px-20 lg:py-2 relative z-10">
          {/* Left content */}
          <div className="flex flex-col justify-center text-center  w-full lg:text-left lg:w-[740px] items-start gap-4 pt-14">
            <img src={coinss} alt="logo-cluster" className="h-[24px] mx-auto lg:mx-0" />
            <h1 className="text-[42px] leading-[56px] w-full  lg:text-[64px] font-[500] text-[#0A0E12]  lg:leading-[72px]">
            Trade, Rest, and <br/> Stay Happy 
            </h1>
            <p className="w-full lg:w-[541px] text-[16px] leading-[28px] py-3 lg:text-[20px] lg:leading-[32px] font-[400] text-[#515B6E]">
              With Bisats, you can say goodbye to your struggles with crypto
              peer-to-peer exchanges
            </p>

            <div className="flex flex-wrap lg:flex-nowrap items-center w-full  lg:w-4/6 ">
              
              <PrimaryButton text={"Create an Account"} loading={false} css="w-full  mb-3 lg:mb-0 lg:w-1/2 lg:mr-3" onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)} />
              <WhiteTransparentButton text={"Sign In"} loading={false} css="border-[1px] w-full lg:w-1/2 border-[#F3F4F6] bg-[#F6F7F8] text-[#181300]" onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)} />
              
           </div>
          </div>

          {/* Exchange card */}
          <div className="w-full mt-5 lg:mt-0 lg:w-[539px] p-2 lg:p-6 pb-2 h-[404px] lg:h-[614px] rounded-xl ">
            <img alt='hero-phone-image' src={HeroImage} />

          </div>
        </div>
      </div>
    </section>
  );
};
