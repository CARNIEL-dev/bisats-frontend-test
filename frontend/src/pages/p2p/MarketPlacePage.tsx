import KycBanner from "@/components/KycBanner";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import SEO from "@/components/shared/SEO";
import TokenSelection from "@/components/shared/TokenSelection";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreLoader from "@/layouts/PreLoader";
import Header from "@/pages/p2p/components/Header";
import MarketPlaceTable from "@/pages/p2p/components/MarketPlaceTable";
import { GetSearchAds } from "@/redux/actions/walletActions";

import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { RotateCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

type PaginationState = { page: number; limit: number; skip: number };
type AdsParams = { asset: string; type: string };

// SUB: Fetch query
const fetchAds = async ({
  queryKey,
}: {
  queryKey: [string, AdsParams, PaginationState, string];
}) => {
  const [, adsParam, pagination, userId] = queryKey;
  const res = await GetSearchAds({
    ...adsParam,
    userId,
    limit: `${pagination.limit}`,
    skip: `${pagination.skip}`,
  });
  if (res.statusCode !== 200) {
    throw new Error("Could not find any express ad at this moment");
  }
  return res.data;
};

const MarketPlacePage = () => {
  //? get & set the query‐string
  const [searchParams, setSearchParams] = useSearchParams();

  const initialAdsParam: AdsParams = {
    asset: searchParams.get("asset") ?? "USDT",
    type: searchParams.get("type") ?? "buy",
  };
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") ?? "10", 10);

  //? Derive skip from page & limit
  const initialPagination: PaginationState = {
    page: initialPage,
    limit: initialLimit,
    skip: (initialPage - 1) * initialLimit,
  };

  // ? local state for the other filters
  const [adsParam, setAdsParam] = useState<AdsParams>(initialAdsParam);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);

  //SUB: Update local state
  useEffect(() => {
    setAdsParam(initialAdsParam);
  }, [searchParams]);

  //SUB: React Query
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const isKycVerified = [
    userState?.kyc?.personalInformationVerified,
    // userState.user?.phoneNumberVerified,
  ].every(Boolean);

  const {
    data: searchAds,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    any[],
    Error,
    AdsType[],
    [string, AdsParams, PaginationState, string]
  >({
    queryKey: ["searchAds", adsParam, pagination, userId],
    queryFn: fetchAds,
    retry: false,
    refetchOnMount: false,
    enabled: Boolean(userId && isKycVerified),
  });

  //SUB: Tab change Handlers
  const onTabChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", newType);
    setSearchParams(params, { replace: false });
    setPagination({ page: 1, limit: 10, skip: 0 });
  };

  const handleTokenChange = (tokenId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("asset", tokenId);
    setSearchParams(params, { replace: false });
    setAdsParam((p) => ({ ...p, asset: tokenId }));
    setPagination({ page: 1, limit: 10, skip: 0 });
  };

  //   SUB: Clear handler
  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.set("asset", "USDT");
    setSearchParams(params, { replace: false });
    setAdsParam(initialAdsParam);
    setPagination(initialPagination);
  };

  //?   Page navigation handler
  //   const goToPage = (newPage: number) =>
  //     setPagination({
  //       page: newPage,
  //       limit: pagination.limit,
  //       skip: (newPage - 1) * pagination.limit,
  //     });

  return (
    <>
      <div className="space-y-8">
        <Header
          text="P2P Market"
          subtext="Fast, secure, and hassle-free. Complete your trades instantly—no waiting, no delays!"
        />

        {!isKycVerified ? (
          <KycBanner />
        ) : userState?.user?.hasAppliedToBeInLevelOne &&
          !userState.user.accountLevel ? (
          <div className="flex flex-col items-center gap-2  border w-fit p-6 mx-auto rounded-md">
            <h4 className="font-semibold text-lg">
              Your Account is being reviewed
            </h4>
            <p className="text-gray-500 text-sm">
              Please wait for admin approval
            </p>
          </div>
        ) : (
          <Tabs
            defaultValue={adsParam.type}
            className="gap-4"
            onValueChange={onTabChange}
          >
            <div className="border-b">
              <TabsList className="p-0 bg-transparent px-2 md:gap-4 justify-around w-full md:w-fit">
                {["buy", "sell"].map((v) => (
                  <TabsTrigger
                    key={v}
                    value={v}
                    disabled={isFetching}
                    className={cn(
                      "!w-fit  data-[state=active]:border-b-4 rounded-none  !shadow-none !bg-transparent font-semibold md:px-4 px-10 flex-none text-gray-500 text-base border-0 capitalize",
                      v === "buy"
                        ? "data-[state=active]:text-[#17A34A] data-[state=active]:border-b-[#49DE80]"
                        : "data-[state=active]:text-[#DC2625] data-[state=active]:border-b-[#EF4444]"
                    )}
                  >
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {!isError && (
              <>
                <div className="grid grid-cols-[1fr_6rem] gap-2 md:w-[25%] ">
                  <TokenSelection
                    value={adsParam.asset}
                    error={undefined}
                    touched={undefined}
                    handleChange={handleTokenChange}
                    removexNGN
                    showBalance={false}
                    disabled={isFetching}
                  />

                  <div className="flex gap-1 items-center h-full">
                    <Button
                      variant="ghost"
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="bg-gray-100 hover:bg-gray-200 !h-full"
                    >
                      <RotateCw className={cn(isFetching && "animate-spin")} />
                      <span className="sr-only">Refresh</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleClear}
                      disabled={isFetching}
                      className="bg-gray-100 hover:bg-gray-200 !h-full"
                    >
                      <X />
                      <span className="sr-only">Clear</span>
                    </Button>
                  </div>
                </div>
                <p className="mb-2 md:mb-3 text-sm font-semibold lg:text-lg">
                  Open Ads - {adsParam.asset}
                </p>
              </>
            )}

            {isFetching ? (
              <PreLoader />
            ) : isError ? (
              <div className="mt-4">
                <ErrorDisplay message={error.message} />
              </div>
            ) : (
              <TabsContent value={adsParam.type}>
                <MarketPlaceTable
                  type={adsParam.type}
                  asset={adsParam.asset}
                  ads={searchAds || []}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
      <SEO title="P2P Marketplace " />
    </>
  );
};

export default MarketPlacePage;
