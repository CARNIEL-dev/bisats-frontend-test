import Phones from "@/assets/landingPage/mock.png";
import AppStores from "@/assets/mobil-stores.svg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const MobileAppByAnima = (): JSX.Element => {
  return (
    <section className="relative w-full pt-20 md:pb-16 mt-16  bg-[#0A0E12] bg-mobile-app">
      <div className="container flex  flex-col relative items-center  w-[90%] justify-between mx-auto">
        {/* <div className="flex md:hidden">
          <Card className="relative w-full md:w-[366px] h-[421px] bg-transparent border-0 shadow-none p-0">
            <CardContent className="p-0 relative h-full">
              <img
                className={` absolute top-0 left-0`}
                src={Phones}
                alt="Screen"
                loading="lazy"
              />
            </CardContent>
          </Card>
        </div> */}

        {/* Content Section */}
        <div className="flex flex-col  justify-center text-center w-full md:w-1/2 items-start gap-4 mb-8 md:mb-0">
          <Badge className="inline-flex mx-auto items-center justify-center px-3 py-2 rounded-[40px] border border-solid border-[#f5bb00] backdrop-blur-[3px] backdrop-brightness-100 [-webkit-backdrop-filter:blur(3px)_brightness(100%)] [background:linear-gradient(136deg,rgba(76,95,110,0.1)_0%,rgba(74,108,135,0.1)_100%)]">
            <span className="font-desktop-caption-1 font-(--desktop-caption-1-font-weight) text-white text-(length:--desktop-caption-1-font-size) text-center tracking-(--desktop-caption-1-letter-spacing) leading-(--desktop-caption-1-line-height) whitespace-nowrap [font-style:var(--desktop-caption-1-font-style)]">
              Coming Soon
            </span>
          </Badge>

          <h2 className="self-stretch text-white font-semibold text-[22px] lg:text-[34px] leading-[40px]">
            Bisats Mobile App
          </h2>

          <p className="self-stretch text-[#C2C7D2] font-desktop-body-3 font-(--desktop-body-3-font-weight) text-greysgrey-3 text-(length:--desktop-body-3-font-size) tracking-(--desktop-body-3-letter-spacing) leading-(--desktop-body-3-line-height) [font-style:var(--desktop-body-3-font-style)]">
            The Bisats Mobile App is coming soon to Google Play and the Apple
            App Store! <br />
            Our mission is to deliver an unmatched peer-to-peer experience,
            putting our users at the heart of everything we do.
          </p>

          <div className="flex items-center gap-6 mt-2 mx-auto">
            <img
              className="h-[30px] lg:h-[44px]"
              alt={"app/google-stores"}
              src={AppStores}
              loading="lazy"
            />
          </div>
        </div>

        {/* Phone Mockups Section */}

        <Card className="relative w-[250px] md:mt-10 mt-2  md:w-[366px]  md:h-[421px] bg-transparent  shadow-none border-0  ">
          <CardContent className="p-0">
            <img
              className={` object-cover`}
              src={Phones}
              alt="Screen"
              loading="lazy"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
