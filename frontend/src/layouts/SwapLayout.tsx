import KycBanner from "@/components/KycBanner";
import RateBanner from "@/components/RateBanner";
import MaxWidth from "@/components/shared/MaxWith";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const SwapLayout = () => {
  const userState: UserState = useSelector((state: any) => state.user);

  const isKycVerified = [
    userState?.kyc?.identificationVerified,
    userState?.kyc?.personalInformationVerified,
    userState.user?.phoneNumberVerified,
  ].every(Boolean);

  return (
    <div className=" mb-10">
      <div className="bg-primary-light h-[48px] md:overflow-hidden overflow-scroll w-screen fixed inset-x-0 md:top-[5rem] top-[4rem] z-10 flex items-center ">
        <RateBanner />
      </div>

      {!isKycVerified ? (
        <MaxWidth className="mt-16 md:mt-24 md:min-h-[75dvh] min-h-[95dvh] max-w-[60rem]">
          <KycBanner />
        </MaxWidth>
      ) : (
        <MaxWidth
          as="section"
          className="md:min-h-[75dvh] min-h-[95dvh] max-w-[35rem] md:mt-24  mt-16"
        >
          <Outlet />
        </MaxWidth>
      )}
    </div>
  );
};

export default SwapLayout;
