import { ToggleRight } from "lucide-react";
import { PrimaryButton } from "../../../components/buttons/Buttons";
import TableActionMenu from "../../../components/Modals/TableActionMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetAds } from "../../../redux/actions/adActions";
import { UserState } from "../../../redux/reducers/userSlice";
import Empty from "../../../components/Empty";
import Header from "../components/Header";

export interface IAd {
	id?: string;
	type: string;
	priceType: string;
	currency?: string;
	priceMargin: number;
	asset: string;
	amount?: number;
	amountFilled: number;
	price: number;
	status: string;
	createdAt?: string;
	closedAt?: string;
}

const MyAds = () => {
	const navigate = useNavigate();
	const [ads, setAds] = useState<Array<IAd>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const userState: UserState = useSelector((state: any) => state.user);
	const user = userState.user;
	const userId = user?.userId;

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setLoading(true);

				const response = await GetAds({ userId });
				console.log("Ads response:", response);

				if (response && response.status && response.data) {
					console.log("Ads fetched successfully:", response.data);
					if (Array.isArray(response.data) && response.data.length > 0) {
						setAds(response.data);
					} else {
						console.log("Data array is empty");
						setAds([]);
					}
				} else if (response && response.data) {
					if (Array.isArray(response.data) && response.data.length > 0) {
						console.log("Using data array from response:", response.data);
						setAds(response.data);
					} else {
						console.log("No valid data in response");
						setAds([]);
					}
				} else {
					console.log("No ads found or invalid response format");
					setAds([]);
				}
			} catch (error) {
				console.error("Error fetching ads:", error);
				setAds([]);
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, [userId]);

	// Split ads into active and inactive based on status
	const activeAds = ads.filter(
		(ad) =>
			ad.status.toLowerCase() === "active" || ad.status.toLowerCase() === "open"
	);

	const closedAds = ads.filter(
		(ad) =>
			ad.status.toLowerCase() !== "active" && ad.status.toLowerCase() !== "open"
	);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US").format(price);
	};

	// Mobile row renderer component for both tables
	const MobileAdRow = ({ ad, index }: { ad: IAd; index: number }) => {
		return (
			<div
				className={`flex flex-col p-4 mb-6 ${
					index % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"
				}`}
			>
				{/* First row - Type and Asset */}
				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Type</span>
						<span
							className="font-semibold"
							style={
								ad.type.toLowerCase() === "sell"
									? { color: "#DC2625" }
									: { color: "#17A34A" }
							}
						>
							{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
						</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Asset</span>
						<span className="font-semibold">{ad.asset}</span>
					</div>
				</div>

				{/* Second row - Price and Price Type */}
				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Price</span>
						<span>{formatPrice(ad.price)}</span>d
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							Price Type
						</span>
						<span className="capitalize">{ad.priceType}</span>
					</div>
				</div>

				{/* Third row - Amount Filled and Status */}
				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							Amount Filled
						</span>
						<span>{ad.amountFilled}</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Status</span>
						<div className="flex items-center">
							<span className="capitalize">{ad.status}</span>
							{ad.status.toLowerCase() === "active" && (
								<ToggleRight
									className="ml-1 inline cursor-pointer"
									fill="#22C55D"
									color="#22C55D"
									strokeWidth={1}
								>
									<circle cx="17" cy="12" r="5" fill="white" />
								</ToggleRight>
							)}
						</div>
					</div>
				</div>

				{/* Fourth row - Action */}
				<div className="flex flex-col justify-bewteen items-end">
					<span style={{ color: "#515B6E", fontSize: "14px" }} className="mr-2">
						Action
					</span>
					<TableActionMenu />
				</div>
			</div>
		);
	};

	return (
		<div className="w-full lg:w-2/3 mx-auto px-3">
			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center space-y-2 bg-gray-100 mb-6 sm:mb-12">
				<Header
					text="My Ads"
					subtext="Create, view and manage your ads on Bisats here"
				/>

				<div>
					<PrimaryButton
						text="Create Ad"
						loading={false}
						onClick={() => navigate("/p2p/ad/create")}
					/>
				</div>
			</div>

			{/* Active Ads Section */}
			<div>
				<div className="min-h-[288px] w-full">
					<div className="mb-[12px]">
						<p style={{ fontSize: "15px" }}>
							<span
								style={{
									fontSize: "18px",
									fontWeight: "600",
									color: "#0A0E12",
								}}
							>
								Active ads
							</span>
						</p>
					</div>

					{loading ? (
						<div className="flex justify-center items-center h-40">
							<p>Loading ads...</p>
						</div>
					) : activeAds.length > 0 ? (
						<>
							{/* Desktop version of the table - hidden on mobile */}
							<div className="hidden md:block">
								<table
									className="table-auto w-full"
									style={{ color: "#515B6E", fontSize: "14px" }}
								>
									<thead className="text-justify">
										<tr style={{ backgroundColor: "#F9F9FB" }}>
											<th className="text-left px-4 py-4">Type</th>
											<th className="text-left px-4 py-4">Asset</th>
											<th className="text-left px-4 py-4">Price</th>
											<th className="text-left px-4 py-4">Price Type</th>
											<th className="text-right px-4 py-3">Amount Filled</th>
											<th className="text-right px-4 py-3">Status</th>
											<th className="text-right px-4 py-3">Action</th>
										</tr>
									</thead>
									<tbody>
										{activeAds.map((ad, index) => (
											<tr key={ad.id || index}>
												<td className="text-left px-4 py-2 font-semibold">
													<span
														style={
															ad.type.toLowerCase() === "sell"
																? { color: "#DC2625" }
																: { color: "#17A34A" }
														}
													>
														{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
													</span>
												</td>
												<td className="text-left px-4 py-2 font-semibold">
													{ad.asset}
												</td>
												<td className="text-left px-4 py-2">
													{formatPrice(ad.price)}
												</td>
												<td className="text-left px-4 py-2">
													{ad.priceType.charAt(0).toUpperCase() +
														ad.priceType.slice(1)}
												</td>
												<td className="text-right px-4 py-2">
													{ad.amountFilled}
												</td>
												<td className="text-right space-x-2">
													<span className="capitalize">{ad.status}</span>
													<ToggleRight
														className="inline cursor-pointer"
														fill="#22C55D"
														color="#22C55D"
														strokeWidth={1}
													>
														<circle cx="17" cy="12" r="5" fill="white" />
													</ToggleRight>
												</td>
												<td className="text-right px-4 py-3 relative">
													<TableActionMenu />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Mobile version - shown only on mobile */}
							<div className="md:hidden">
								<div className="rounded overflow-hidden">
									{activeAds.map((ad, index) => (
										<MobileAdRow key={ad.id || index} ad={ad} index={index} />
									))}
								</div>
							</div>
						</>
					) : (
						<Empty />
					)}
				</div>
			</div>

			{/* Closed Ads Section */}
			<div>
				<div className="min-h-[288px]">
					<div className="mb-[12px]">
						<p style={{ fontSize: "15px" }}>
							<span
								style={{
									fontSize: "18px",
									fontWeight: "600",
									color: "#0A0E12",
								}}
							>
								Closed ads
							</span>
						</p>
					</div>

					{loading ? (
						<div className="flex justify-center items-center h-40">
							<p>Loading ads...</p>
						</div>
					) : closedAds.length > 0 ? (
						<>
							{/* Desktop version of the table - hidden on mobile */}
							<div className="hidden md:block">
								<table
									className="table-auto w-full"
									style={{ color: "#515B6E", fontSize: "14px" }}
								>
									<thead className="text-justify">
										<tr style={{ backgroundColor: "#F9F9FB" }}>
											<th className="text-left px-4 py-4">Type</th>
											<th className="text-left px-4 py-4">Asset</th>
											<th className="text-left px-4 py-4">Price</th>
											<th className="text-left px-4 py-4">Price Type</th>
											<th className="text-right px-4 py-3">Amount Filled</th>
											<th className="text-right px-4 py-3">Status</th>
											<th className="text-right px-4 py-3">Action</th>
										</tr>
									</thead>
									<tbody>
										{closedAds.map((ad, index) => (
											<tr key={ad.id || index}>
												<td className="text-left px-4 py-2 font-semibold">
													<span
														style={
															ad.type.toLowerCase() === "sell"
																? { color: "#DC2625" }
																: { color: "#17A34A" }
														}
													>
														{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
													</span>
												</td>
												<td className="text-left px-4 py-2 font-semibold">
													{ad.asset}
												</td>
												<td className="text-left px-4 py-2">
													{formatPrice(ad.price)}
												</td>
												<td className="text-left px-4 py-2">
													{ad.priceType.charAt(0).toUpperCase() +
														ad.priceType.slice(1)}
												</td>
												<td className="text-right px-4 py-2">
													{ad.amountFilled}
												</td>
												<td className="text-right px-4 py-3 capitalize">
													{ad.status}
												</td>
												<td className="text-right px-4 py-3 relative">
													<TableActionMenu />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Mobile version - shown only on mobile */}
							<div className="md:hidden">
								<div className="rounded overflow-hidden">
									{closedAds.map((ad, index) => (
										<MobileAdRow key={ad.id || index} ad={ad} index={index} />
									))}
								</div>
							</div>
						</>
					) : (
						<Empty />
					)}
				</div>
			</div>
		</div>
	);
};

export default MyAds;
