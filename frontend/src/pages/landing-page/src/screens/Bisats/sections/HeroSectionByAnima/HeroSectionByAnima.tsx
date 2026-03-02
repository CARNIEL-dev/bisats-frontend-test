import coinss from "@/assets/icons/coinss.png";
import HeroNotificationBadge from "@/components/shared/HeroNotificationBadge";
import MaxWidth from "@/components/shared/MaxWith";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";

import { cn } from "@/utils";
import { Link } from "react-router-dom";

import phoneDesktop from "@/assets/phone-desktop.svg";
import phoneMobile from "@/assets/phone-mobile.png";

import { Verified } from "lucide-react";

import bisatLogo from "@/assets/logo/logo-icon-btc.svg";
import bisatLogo2 from "@/assets/logo/logo-icon.svg";
import {
  container,
  revealUpVariant,
  slideInLeft,
  slideInRight,
  slideUpVariant,
} from "@/components/animation";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
// const isAuthenticated = false; // Placeholder for authentication state
export const HeroSectionByAnima = (): React.ReactElement => {
  const user: UserState = useSelector((state: any) => state.user);
  const isAuthenticated = user.isAuthenticated;

  const isMobile = useIsMobile();

  return (
    <div className="w-full relative min-h-[85vh] md:min-h-fit overflow-x-hidden">
      <MaxWidth as="section" className=" max-w-[78rem] 2xl:max-w-[90rem] mb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit={"exit"}
          className="flex flex-col md:flex-row justify-between items-start"
        >
          {/* SUB: Left content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit={"exit"}
            className="flex flex-col mt-[8%] justify-center text-center  w-full md:text-left lg:w-[740px] items-start gap-4 flex-1 md:pt-14 pt-12"
          >
            <motion.img
              variants={slideInRight}
              src={coinss}
              alt="logo-cluster"
              className="h-[24px] mx-auto md:mx-0"
            />
            <motion.h1
              variants={slideInRight}
              className="text-3xl xs:text-[42px] sm:leading-[56px] w-full  lg:text-6xl font-semibold text-[#0A0E12]  lg:leading-[65px]"
            >
              Trade, Rest, and <br /> Stay Happy
            </motion.h1>
            <motion.p
              variants={revealUpVariant}
              className="w-full lg:w-[541px] text-[16px] leading-[28px] py-3 lg:text-lg lg:leading-[28px] font-light text-[#515B6E]"
            >
              With Bisats, you can say goodbye to your struggles with crypto
              peer-to-peer exchanges
            </motion.p>

            <motion.div
              variants={revealUpVariant}
              className="flex flex-wrap lg:flex-nowrap items-center w-full  lg:w-4/6 gap-4  "
            >
              {isAuthenticated ? (
                <a
                  href={APP_ROUTES.DASHBOARD}
                  className={cn(
                    buttonVariants(),
                    "px-8 lg:w-1/2 w-full md:w-fit  h-fit py-3 text-sm",
                  )}
                >
                  Go to Dashboard
                </a>
              ) : (
                <>
                  <Link
                    className={cn(
                      buttonVariants(),
                      "px-8 lg:w-1/2 w-full md:w-fit   h-fit py-3 text-sm",
                    )}
                    to={APP_ROUTES.AUTH.SIGNUP}
                  >
                    Create an Account
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "px-8 lg:w-1/2 w-full md:w-fit    h-fit py-3 text-sm",
                    )}
                    to={APP_ROUTES.AUTH.LOGIN}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* SUB: Right content */}
          <div className="w-full mt-6 lg:mt-0 flex-1  rounded-xl flex items-center justify-center ">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={"exit"}
              className="relative  lg:h-[700px] lg:w-[80%] md:w-[75%] "
            >
              <motion.img
                alt="hero-phone-image"
                src={isMobile ? phoneMobile : phoneDesktop}
                className="sm:w-auto  h-full mx-auto "
                loading="eager"
                variants={slideUpVariant}
              />

              <HeroNotificationBadge
                key={"Buy Order successful"}
                text={
                  <div className="text-sm font-medium text-gray-800">
                    <h3 className="flex items-center gap-0.5">
                      Buy Order successful
                      <Verified
                        fill="#17A34A"
                        stroke="white"
                        className="size-5"
                      />
                    </h3>
                  </div>
                }
                className="absolute top-[27%] lg:right-[-1.5rem] xs:right-[-6rem] right-[-3.5rem]"
                subText=" You have a purchased 500 USDT"
                logo={bisatLogo2}
                variant={slideInLeft}
              />
              <HeroNotificationBadge
                key={"Deposit successful"}
                text={
                  <h3 className="flex items-center gap-0.5">
                    Deposit successful
                    <Verified
                      fill="#17A34A"
                      stroke="white"
                      className="size-5"
                    />
                  </h3>
                }
                className="absolute md:bottom-[33%] bottom-[31%] lg:left-2 -left-20"
                subText="You have deposited 100,000 xNGN"
                logo={bisatLogo}
                variant={slideInRight}
              />
            </motion.div>
          </div>
        </motion.div>
      </MaxWidth>

      <img
        src="/landingpage/background-pattern-black.png"
        alt=""
        className="absolute inset-0 w-full h-[98%] -z-10 "
      />
    </div>
  );
};
