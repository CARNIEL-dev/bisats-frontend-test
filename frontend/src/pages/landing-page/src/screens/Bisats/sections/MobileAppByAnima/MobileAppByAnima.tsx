import Phone from "@/assets/phone-mobile.svg";
import phoneBg from "@/assets/illustrations/mobile-phone-bg.jpg";
import { cn } from "@/utils";
import { MOBILE_APP_INFO } from "@/utils/data";
import { motion } from "motion/react";
import { useRef } from "react";

export const MobileAppByAnima = (): JSX.Element => {
  const scrollRef = useRef(null);

  return (
    <section className="relative w-full pt-20 pb-16 mt-16 text-white  bg-[#0A0E12] bg-mobile-app">
      <div className="container grid md:grid-cols-2 gap-x-4 gap-y-10 items-center  w-[90%] justify-between mx-auto">
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h3 className="font-medium text-2xl md:text-4xl">
            Bisats Mobile App
          </h3>
          <p className="md:w-11/12 leading-7 text-gray-400">
            The Bisats Mobile App is coming soon to Google Play and the Apple
            App Store! Our mission is to deliver an unmatched peer-to-peer
            experience, putting our users at the heart of everything we do.
          </p>
          <div className="flex md:flex-row flex-col items-center gap-4 ">
            {MOBILE_APP_INFO.map((app) => (
              <a
                key={app.name}
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "rounded-md overflow-hidden hover:scale-105 transition-all duration-300",
                  app.disabled && "pointer-events-none"
                )}
              >
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-[230px] md:w-[130px] h-16 md:h-10  object-cover"
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div
            ref={scrollRef}
            className="md:w-10/12 w-[70dvw] mx-auto md:h-[40rem] h-[25rem] relative rounded-3xl  isolate"
            style={{
              overflowY: "hidden",
            }}
          >
            <img
              src={phoneBg}
              alt="PhoneBg"
              className="w-full h-full object-cover absolute inset-0 -z-10 rounded-3xl"
            />
            <motion.img
              initial={{
                y: 200,
                opacity: 0,
                zIndex: 10,
              }}
              whileInView={{
                y: 0,
                opacity: 1,
                zIndex: 10,
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
              viewport={{ root: scrollRef, amount: 0.3 }}
              src={Phone}
              alt="Phone"
              className="w-full h-full object-cover z-10 relative  object-top block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
