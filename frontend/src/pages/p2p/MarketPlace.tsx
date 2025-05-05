import CryptoFilter from "../../components/CryptoFilter";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import MarketPlaceContent from "./components/MarketPlaceTable";
import { useSelector } from "react-redux";
import Bisatsfetch from "../../redux/fetchWrapper";

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
	const [active, setActive] = useState(0);
	const [selectedToken, setSelectedToken] = useState("usdt");
	const user = useSelector((state: RootState) => state.user.user);
	const [loading, setLoading] = useState(false);
	const [ads, setAds] = useState([]);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		limit: 10,
		skip: 0,
	});

	const fetchAds = async () => {
		setLoading(true);
		setError(null);
		try {
			const type = active === 0 ? "buy" : "sell";
			const response = await Bisatsfetch(
				`/api/v1/user/${
					user?.userId
				}/ads/search-ads?asset=${selectedToken.toUpperCase()}_TEST5&type=${type}&limit=${
					pagination.limit
				}&skip=${pagination.skip}`,
				{ method: "GET" }
			);
			console.log(`API Response for ${selectedToken}:`, user?.userId, response);

			if (response.status) {
				setAds(response.data);
			} else {
				setAds([]);
			}
		} catch (err) {
			console.error("Error fetching ads:", err);
			setError("Failed to load data. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?.userId) {
			console.log("Fetching ads for user:", user?.userId);
			fetchAds();
		}
	}, [active, selectedToken, pagination.skip, pagination.limit, user?.userId]);

	const handleTokenChange = (tokenId: string): void => {
		setSelectedToken(tokenId);
		setPagination({
			limit: 10,
			skip: 0,
		});
	};

	return (
		<div className="w-full lg:w-2/3 mx-auto px-3">
			<div>
				<Header
					text="P2P Market"
					subtext="Fast, secure, and hassle-free. Complete your trades instantly—no waiting, no delays!"
				/>
			</div>

			<div className="flex items-center w-1/2 lg:w-1/4 justify-between my-5">
				<p
					onClick={() => setActive(0)}
					className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${
						active === 0 &&
						"border-b-[4px] rounded-x-[2px] border-[#49DE80] text-[#17A34A]"
					}`}
				>
					Buy
				</p>
				<p
					onClick={() => setActive(1)}
					className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${
						active === 1 &&
						"border-b-[4px] rounded-x-[2px] border-[#F87171] text-[#DC2625]"
					}`}
				>
					Sell
				</p>
			</div>

			<div className="flex items-center w-3/5 lg:w-1/4">
				<CryptoFilter
					error={undefined}
					touched={undefined}
					handleChange={handleTokenChange}
				/>

				<button className="border-[1px] border-[#D6DAE1] rounded-[6px] w-[120px] px-4 flex justify-between items-center h-[48px] text-[#515B6E] text-[14px]">
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

			<div className="my-10">
				<p style={{ fontSize: "15px" }} className="mb-2 md:mb-3">
					<span
						style={{ fontWeight: "600", color: "#0A0E12" }}
						className="mr-[8px] text-[14px] lg:text-[18px]"
					>
						Open Ads
					</span>
				</p>

				<MarketPlaceContent
					type={active === 0 ? "Buy" : "Sell"}
					ads={ads}
					pagination={pagination}
					setPagination={setPagination}
				/>
			</div>
		</div>
	);
};

export default MarketPlace;
