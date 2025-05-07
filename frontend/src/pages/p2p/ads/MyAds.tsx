import { ToggleRight } from "lucide-react";
import { PrimaryButton } from "../../../components/buttons/Buttons";
import TableActionMenu from "../../../components/Modals/TableActionMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetAds } from "../../../redux/actions/adActions";
import { UserState } from "../../../redux/reducers/userSlice";
import Empty from "../../../components/Empty";

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

	return (
		<div className="w-full lg:w-2/3 mx-auto px-3">
			<div className="flex justify-between items-center p-4 bg-gray-100">
				<div className="flex flex-col">
					<h2
						className="font-semibold"
						style={{ color: "#0A0E12", fontSize: "34px" }}
					>
						My Ads
					</h2>
					<p style={{ color: "#0A0E12", fontSize: "14px", fontWeight: 400 }}>
						Create, view and manage your ads on Bisats here
					</p>
				</div>

				<PrimaryButton
					text="Create Ad"
					loading={false}
					onClick={() => navigate("/p2p/ad/create")}
				/>
			</div>

			{/* Active Ads Section */}
			<div>
				<div className="min-h-[288px] m-[15px] p-[24px]">
					<div className="mb-[12px]">
						<p style={{ fontSize: "15px" }}>
							<span
								style={{
									fontSize: "18px",
									fontWeight: "600",
									color: "#0A0E12",
								}}
								className="mr-[8px]"
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
										<td className="text-right px-4 py-2">{ad.amountFilled}</td>
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
					) : (
						<Empty />
					)}
				</div>
			</div>

			{/* Closed Ads Section */}
			<div>
				<div className="min-h-[288px] m-[15px] p-[24px]">
					<div className="mb-[12px]">
						<p style={{ fontSize: "15px" }}>
							<span
								style={{
									fontSize: "18px",
									fontWeight: "600",
									color: "#0A0E12",
								}}
								className="mr-[8px]"
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
										<td className="text-right px-4 py-2">{ad.amountFilled}</td>
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
					) : (
						<Empty />
					)}
				</div>
			</div>
		</div>
	);
};

export default MyAds;
