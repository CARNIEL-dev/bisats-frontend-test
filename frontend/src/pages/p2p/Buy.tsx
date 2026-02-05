import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import PreLoader from "@/layouts/PreLoader";
import P2PMarket from "@/pages/p2p/components/P2PMarket";
import { useGetAdsDetail } from "@/redux/actions/walletActions";

import { useSearchParams } from "react-router-dom";

const Buy = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  const {
    data: adData,
    isLoading,
    isError,
    error,
  } = useGetAdsDetail({
    adId: id,
    enabled: Boolean(id),
  });

  return (
    <div className="space-y-4">
      <BackButton />
      <MaxWidth className="max-w-[35rem] 2xl:max-w-[45rem]">
        {isLoading ? (
          <div className="h-[30rem] grid place-content-center">
            <PreLoader primary={false} />
          </div>
        ) : isError ? (
          <div className="h-[30rem] grid place-content-center">
            <ErrorDisplay
              message={error?.message || "Could not get ads"}
              isError={false}
              showIcon={false}
            />
          </div>
        ) : !adData?.id ? (
          <div className="h-[30rem] grid place-content-center">
            <ErrorDisplay
              message="Could not find this ad"
              isError={false}
              showIcon={false}
            />
          </div>
        ) : (
          <P2PMarket type={"buy"} adDetail={adData} />
        )}
      </MaxWidth>
    </div>
  );
};
export default Buy;
