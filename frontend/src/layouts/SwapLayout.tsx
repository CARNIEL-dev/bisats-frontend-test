import RateBanner from "@/components/RateBanner";
import MaxWidth from "@/components/shared/MaxWith";
import { Outlet } from "react-router-dom";

const SwapLayout = () => {
  return (
    <div className=" mb-10">
      <div className="bg-primary-light h-[48px] md:overflow-hidden overflow-scroll w-screen fixed inset-x-0 md:top-[5rem] top-[4rem] z-10 flex items-center ">
        <RateBanner />
      </div>

      <MaxWidth
        as="section"
        className="md:min-h-[75dvh] min-h-[95dvh] max-w-[35rem] md:mt-24  mt-16"
      >
        <Outlet />
      </MaxWidth>
    </div>
  );
};

export default SwapLayout;
