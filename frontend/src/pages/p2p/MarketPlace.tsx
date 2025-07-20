import CryptoFilter from "../../components/CryptoFilter";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import MarketPlaceContent from "./components/MarketPlaceTable";
import { useSelector } from "react-redux";
import { GetSearchAds } from "../../redux/actions/walletActions";
import { UserState } from "../../redux/reducers/userSlice";
import { AdSchema } from "./components/ExpressSwap";
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import PreLoader from "../../layouts/PreLoader";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCcw, RotateCw } from "lucide-react";
import TokenSelection from "@/components/shared/TokenSelection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

interface RootState {
  user: {
    user: {
      userId: string;
    } | null;
  };
}

interface PaginationState {
  page: number;
  limit: number;
  skip: number;
}

type AdsParams = {
  asset: string;
  type: string;
  amount: string;
};

const fetchAds = async ({
  queryKey,
}: {
  queryKey: [string, AdsParams, PaginationState, string];
}) => {
  const [, adsParam, pagination, userId] = queryKey;
  const { limit, skip } = pagination;

  const res = await GetSearchAds({
    ...adsParam,
    userId,
    limit: `${limit}`,
    skip: `${skip}`,
  });

  console.log("res", res);

  if (res.statusCode !== 200) {
    // Throwing makes React Query treat this as an error
    throw new Error("Could not find any express ad at this moment");
  }

  return res.data;
};

const MarketPlace = () => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const userId = user?.user?.userId || "";

  const [adsParam, setAdsParam] = useState<AdsParams>({
    asset: "USDT",
    type: "buy",
    amount: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    skip: 0,
  });

  const {
    data: searchAds,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    AdSchema[],
    Error,
    AdSchema[],
    [string, AdsParams, PaginationState, string]
  >({
    queryKey: ["searchAds", adsParam, pagination, userId],
    queryFn: fetchAds,
    retry: false,
    refetchOnMount: false,
    staleTime: Infinity,

    // enabled: Boolean(adsParam.amount),
  });

  const handleTokenChange = (tokenId: string): void => {
    setAdsParam({
      ...adsParam,
      asset: tokenId,
    });
    setPagination({
      limit: 10,
      skip: 0,
      page: 1,
    });
  };

  console.log("searchAds", searchAds);

  return (
    <div className="space-y-8">
      <Header
        text="P2P Market"
        subtext="Fast, secure, and hassle-free. Complete your trades instantly—no waiting, no delays!"
      />

      <Tabs
        defaultValue="buy"
        className="gap-6"
        onValueChange={(value) => setAdsParam({ ...adsParam, type: value })}
      >
        <div className="border-b">
          <TabsList className="p-0 bg-transparent px-2 md:gap-4 justify-around w-full md:w-fit">
            <TabsTrigger
              className={cn(
                "!w-fit data-[state=active]:text-[#17A34A] data-[state=active]:border-b-4 rounded-none data-[state=active]:border-b-[#49DE80] !shadow-none !bg-transparent font-semibold md:px-4 px-10 flex-none text-gray-500 text-base border-0"
              )}
              value="buy"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "!w-fit data-[state=active]:text-[#DC2625] data-[state=active]:border-b-4 rounded-none data-[state=active]:border-b-[#EF4444] !shadow-none !bg-transparent font-semibold text-base md:px-4 px-10 flex-none text-gray-500 border-0"
              )}
              value="sell"
            >
              Sell
            </TabsTrigger>
          </TabsList>
        </div>

        {!isError && (
          <div className="grid grid-cols-[1fr_3fr] md:grid-cols-[1fr_3fr_3rem] gap-2 md:w-1/2 items-center">
            <TokenSelection
              title={adsParam.asset}
              error={undefined}
              touched={undefined}
              handleChange={handleTokenChange}
              removexNGN
              showBalance={false}
              disabled={isFetching}
            />
            <Input
              type="number"
              placeholder="Amount in xNGN"
              className="h-full"
            />
            <div>
              <Button
                variant={"ghost"}
                type="button"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RotateCw className={cn(isFetching && "animate-spin")} />
              </Button>
            </div>
          </div>
        )}

        {isFetching ? (
          <PreLoader />
        ) : isError ? (
          <div className="flex items-center justify-center text-red-500 gap-2">
            <AlertCircle />
            <p className=" capitalize">{error.message}</p>
          </div>
        ) : (
          <>
            <TabsContent value="buy">
              <p>buy</p>
            </TabsContent>
            <TabsContent value="sell">
              <p>sell</p>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default MarketPlace;

/* 
	

			<div className="flex flex-wrap lg:flex-nowrap items-end w-full lg:w-1/4">
			

				<button
					className="border border-[#D6DAE1] rounded-[6px] w-full mt-2 lg:w-[120px] px-4 flex justify-between items-center h-[48px] text-[#515B6E] text-[14px]"
					onClick={() => setAdsParam({ ...adsParam })}
				>
					Filter
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.05078 1.57422H13.9508C14.7758 1.57422 15.4508 2.24922 15.4508 3.07422V4.72422C15.4508 5.32422 15.0758 6.07422 14.7008 6.44922L11.4758 9.29922C11.0258 9.67422 10.7258 10.4242 10.7258 11.0242V14.2492C10.7258 14.6992 10.4258 15.2992 10.0508 15.5242L9.00078 16.1992C8.02578 16.7992 6.67578 16.1242 6.67578 14.9242V10.9492C6.67578 10.4242 6.37578 9.74922 6.07578 9.37422L3.22578 6.37422C2.85078 5.99922 2.55078 5.32422 2.55078 4.87422V3.14922C2.55078 2.24922 3.22578 1.57422 4.05078 1.57422Z"
							stroke="#707D96"
							strokeWidth="1.5"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M8.1975 1.57422L4.5 7.49922"
							stroke="#707D96"
							strokeWidth="1.5"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>

			<div className="my-10 w-full">
				<p style={{ fontSize: "15px" }} className="mb-2 md:mb-3">
					<span
						style={{ fontWeight: "600", color: "#0A0E12" }}
						className="mr-[8px] text-[14px] lg:text-[18px]"
					>
						Open Ads
					</span>
				</p>

				{loading ? (
					<PreLoader />
				) : (
						<>
							<MarketPlaceContent
								type={adsParam.type === "buy" ? "Buy" : "Sell"}
								ads={searchAds}
								pagination={pagination}
								setPagination={setPagination}
							/>
						</>
					
				)}
			</div>
*/
