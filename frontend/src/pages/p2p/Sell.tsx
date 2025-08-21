import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import PreLoader from "@/layouts/PreLoader";
import Swap from "@/pages/p2p/components/Swap";
import { useGetAdsDetail } from "@/redux/actions/walletActions";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Sell = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  const user: UserState = useSelector((state: any) => state.user);
  const userr = user.user;

  const { data, isLoading, isError, error } = useGetAdsDetail({
    userId: userr?.userId,
    adId: id,
    enabled: Boolean(id),
  });

  const adData = useMemo(() => {
    return data?.find((item) => item.id === id);
  }, [id, data]);

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
          <Swap type={"sell"} adDetail={adData} />
        )}
      </MaxWidth>
    </div>
  );
};

export default Sell;
