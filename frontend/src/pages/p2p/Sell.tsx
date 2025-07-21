import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import { useLocation } from "react-router-dom";
import Swap from "@/pages/p2p/components/Swap";

const Sell = () => {
  const location = useLocation();
  const adDetail = location.state?.adDetail;
  return (
    <div className="space-y-4">
      <BackButton />
      <MaxWidth className="max-w-[35rem]">
        <Swap type={"sell"} adDetail={adDetail} />
      </MaxWidth>
    </div>
  );
};

export default Sell;
