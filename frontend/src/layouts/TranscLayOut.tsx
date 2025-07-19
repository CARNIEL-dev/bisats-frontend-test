import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import { Outlet } from "react-router-dom";
const TranscLayOut = () => {
  return (
    <MaxWidth
      as="section"
      className="md:min-h-[75dvh] min-h-[95dvh] max-w-[72rem]  mb-10 mt-8 md:space-y-12 space-y-6"
    >
      <BackButton />
      <MaxWidth className="max-w-[35rem]">
        <Outlet />
      </MaxWidth>
    </MaxWidth>
  );
};

export default TranscLayOut;
