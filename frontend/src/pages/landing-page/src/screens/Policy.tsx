import { HeroSectionAbout } from "./Bisats/sections/HeroSectionByAnima";

const Policy = (): JSX.Element => {
  return (
    <div>
      <HeroSectionAbout
        title="Our Policy"
        desc="Please review the terms carefully before using our peer-to-peer services. By accessing or using the platform, you agree to be bound by these conditions"
        image="/landingpage/Policy-hero-image.png"
      />

      <div className="py-[64px] lg:py-[88px] flex flex-col justify-center w-full max-w-[835px] mx-auto px-[20px]">
        <h2 className="text-[34px] font-medium text-[#2B313B] mb-[24px]">
          Our Policy
        </h2>

        <p className="text-[20px] font-normal text-[#515B6E] mb-[20px]">
          At Bisats, we are committed to fostering a secure and compliant
          peer-to-peer cryptocurrency trading environment in Nigeria and beyond.
          Our operations adhere strictly to Know Your Customer (KYC)
          regulations, ensuring that all users undergo thorough identity
          verification to maintain the integrity of our platform. This process
          safeguards the interests of both buyers and sellers, promoting
          transparency and trust.
        </p>
        <p className="text-[20px] font-normal text-[#515B6E] mb-[20px]">
          Our escrow policy protects all digital assets during transactions,
          acting as a secure intermediary that ensures funds are only released
          when both parties fulfill their obligations. This mechanism
          significantly minimizes the risk of fraud and enhances user
          confidence.
        </p>
        <p className="text-[20px] font-normal text-[#515B6E] mb-[20px]">
          In the event of disputes, Bisats implements a structured resolution
          process. Offenders who violate our standards may face temporary or
          permanent suspension from the platform, depending on the severity of
          the infraction. Legal punitive measures may also be pursued against
          individuals engaging in fraudulent activities or non-compliance with
          our policies.
        </p>
        <p className="text-[20px] font-normal text-[#515B6E] ">
          We prioritize the safety of our users and their assets, and we are
          dedicated to upholding the highest regulatory standards. By choosing
          Bisats, you are engaging with a platform that values security,
          compliance, and the seamless trading experience you deserve.
        </p>
      </div>
    </div>
  );
};

export default Policy;
