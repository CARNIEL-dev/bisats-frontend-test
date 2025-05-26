import CryptoFilter from "../../components/CryptoFilter";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import MarketPlaceContent from "./components/MarketPlaceTable";
import { useSelector } from "react-redux";
import Bisatsfetch from "../../redux/fetchWrapper";
import { GetSearchAds } from "../../redux/actions/walletActions";
import { UserState } from "../../redux/reducers/userSlice";
import { AdSchema } from "./components/ExpressSwap";
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import PreLoader from "../../layouts/PreLoader";

interface RootState {
	user: {
		user: {
			userId: string;
		} | null;
	};
}

interface PaginationState {
	limit: number;
	skip: number;
}

const MarketPlace = () => {
	const user = useSelector((state: { user: UserState }) => state.user);
	const userId = user?.user?.userId || "";
	const [searchAds, setSearchAds] = useState<AdSchema[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [adsParam, setAdsParam] = useState({
			asset: "USDT",
			type: "buy",
			amount:""
		})
	const [pagination, setPagination] = useState({
		limit: 10,
		skip: 0,
	});


		useEffect(() => {
			const FetchAds = async () => {
              setLoading(true)
				const res = await GetSearchAds({ ...adsParam, userId: userId }) ?? []
				if (res?.length <= 0 || !res) {
					setError("Could not find any express ad at this moment")
				} else {
					setError(null)
				}
				setLoading(false)

				setSearchAds(res)
			}
			// if (adsParam?.amount && parseFloat(adsParam?.amount) > 0) {
			// const debounceTimer = setTimeout(() => {
				FetchAds()
			// }, 500); 

		// 	return () => clearTimeout(debounceTimer);
		// }
		},[ adsParam, userId])

	const handleTokenChange = (tokenId: string): void => {
		setAdsParam({
			...adsParam,
			asset:tokenId
		})
		setPagination({
			limit: 10,
			skip: 0,
		});
	};

	return (
		<div className="w-full max-w-[1024px] lg:w-full mx-auto px-3">
			<div>
				<Header
					text="P2P Market"
					subtext="Fast, secure, and hassle-free. Complete your trades instantly—no waiting, no delays!"
				/>
			</div>

			<div className="flex items-center w-1/2 lg:w-1/4 justify-between my-5">
				<p
					onClick={() => setAdsParam({ ...adsParam, type: "buy" })}
					className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${
						adsParam?.type === "buy" &&
						"border-b-[4px] rounded-x-[2px] border-[#49DE80] text-[#17A34A]"
					}`}
				>
					Buy
				</p>
				<p
					onClick={() => setAdsParam({ ...adsParam, type: "sell" })}
					className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${
						adsParam?.type === "sell" &&
						"border-b-[4px] rounded-x-[2px] border-[#F87171] text-[#DC2625]"
					}`}
				>
					Sell
				</p>
			</div>

			<div className="flex flex-wrap lg:flex-nowrap items-end w-full lg:w-1/4">
				<CryptoFilter
					error={undefined}
					touched={undefined}
					handleChange={handleTokenChange}
					removexNGN={true}
					
				/>
				<PrimaryInput
					css={"h-[48px] lg:mx-2 w-full lg:w-fit "}
					placeholder="Amount in xNGN"
					label={""}
					error={undefined}
					touched={undefined}
					onChange={(e) => setAdsParam({ ...adsParam, amount: e.target.value })}
				/>

				<button
					className="border-[1px] border-[#D6DAE1] rounded-[6px] w-full mt-2 lg:w-[120px] px-4 flex justify-between items-center h-[48px] text-[#515B6E] text-[14px]"
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
					<MarketPlaceContent
						type={adsParam.type === "buy" ? "Buy" : "Sell"}
						ads={searchAds}
						pagination={pagination}
						setPagination={setPagination}
					/>
				)}
			</div>
		</div>
	);
};

export default MarketPlace;
