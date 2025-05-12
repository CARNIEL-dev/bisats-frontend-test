import { ToggleRight } from "lucide-react";
import { PrimaryButton } from "../../components/buttons/Buttons";
import TableActionMenu from "../../components/Modals/TableActionMenu";
import { useEffect, useState } from "react";
import { getUser } from "../../helpers";
import Bisatsfetch from "../../redux/fetchWrapper";
import { useSelector } from "react-redux";
import { BACKEND_URLS } from "../../utils/backendUrls";
import Header from "./components/Header";

interface Ad {
	id: string;
	type: string;
	asset: string;
	price: number;
	quantity?: number;
	amountFilled?: number;
	status: string;
	createdAt?: string;
	closedAt?: string;
}

interface RootState {
	user: {
		user: {
			userId: string;
		} | null;
	};
}

// Format price with commas
interface FormatPriceParams {
	price: number | undefined;
}

const MyAds = () => {
	const [userAds, setUserAds] = useState<Ad[]>([]);
	const user = useSelector((state: RootState) => state.user.user);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch user's ads on component mount
	useEffect(() => {
		if (user?.userId) {
			fetchUserAds();
		}
	}, [user?.userId]);

	// Function to fetch user ads
	const fetchUserAds = async () => {
		setLoading(true);
		setError(null);

		try {
			// Construct the correct API URL with userId parameter
			const endpoint = `/api/v1/user/${user?.userId}/ads/get-user-ads`;

			// Log the endpoint for debugging
			console.log("Fetching ads using endpoint:", endpoint);

			const response = await Bisatsfetch(endpoint, {
				method: "GET",
			});

			console.log("User Ads API Response:", response);

			if (response.status) {
				setUserAds(response.data || []);
			} else {
				setUserAds([]);
				if (response.message) {
					setError(response.message);
				}
			}
		} catch (err) {
			console.error("Error fetching user ads:", err);
			setError("Failed to fetch ads. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Filter active and closed ads
	const activeAds = userAds.filter((ad) => ad.status === "active");
	const closedAds = userAds.filter((ad) => ad.status !== "active");

	const formatPrice = ({ price }: FormatPriceParams): string => {
		return price?.toLocaleString() || "0";
	};

	// Format date function for better display
	const formatDate = (dateString?: string): string => {
		if (!dateString) return "N/A";
		try {
			return new Date(dateString).toLocaleDateString();
		} catch (e) {
			return "N/A";
		}
	};

	return (
		<div className="w-full max-w-[1200px] mx-auto px-[16px]">
			<div className="flex flex-col bg-gray-100">
				<Header
					text="My Ads"
					subtext="Create, view and manage your ads on Bisats here"
				/>
				<PrimaryButton text="Create Ad" loading={false} />
			</div>

			{loading ? (
				<div className="text-center py-8">Loading your ads...</div>
			) : error ? (
				<div className="text-center py-8 text-red-500">{error}</div>
			) : (
				<>
					<div>
						<div className="h-auto m-[15px] p-[24px]">
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
							<table
								className="table-auto w-full"
								style={{ color: "#515B6E", fontSize: "14px" }}
							>
								<thead className="text-justify">
									<tr style={{ backgroundColor: "#F9F9FB" }}>
										<th className="text-left px-4 py-4">Type</th>
										<th className="text-left px-4 py-4">Asset</th>
										<th className="text-left px-4 py-4">Price</th>
										<th className="text-left px-4 py-4">Quantity</th>
										<th className="text-right px-4 py-3">Amount Filled</th>
										<th className="text-right px-4 py-3">Created</th>
										<th className="text-right px-4 py-3">Status</th>
										<th className="text-right px-4 py-3">Action</th>
									</tr>
								</thead>
								<tbody>
									{activeAds.length > 0 ? (
										activeAds.map((ad) => (
											<tr key={ad.id}>
												<td className="text-left px-4 py-2 font-semibold">
													<span
														style={{
															color:
																ad.type.toLowerCase() === "sell"
																	? "#DC2625"
																	: "#17A34A",
														}}
													>
														{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
													</span>
												</td>
												<td className="text-left px-4 py-2 font-semibold">
													{ad.asset}
												</td>
												<td className="text-left px-4 py-2">
													{formatPrice({ price: ad.price })}
												</td>
												<td className="text-left px-4 py-2">
													{ad.quantity || "N/A"}
												</td>
												<td className="text-right px-4 py-2">
													{ad.amountFilled || 0}
												</td>
												<td className="text-right px-4 py-3">
													{formatDate(ad.createdAt)}
												</td>
												<td className="text-right space-x-2">
													<span>Active</span>
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
										))
									) : (
										<tr>
											<td colSpan={8} className="text-center py-4">
												No active ads found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
					<div>
						<div className="h-auto m-[15px] p-[24px]">
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
							<table
								className="table-auto w-full"
								style={{ color: "#515B6E", fontSize: "14px" }}
							>
								<thead className="text-justify">
									<tr style={{ backgroundColor: "#F9F9FB" }}>
										<th className="text-left px-4 py-4">Type</th>
										<th className="text-left px-4 py-4">Asset</th>
										<th className="text-left px-4 py-4">Price</th>
										<th className="text-left px-4 py-4">Quantity</th>
										<th className="text-right px-4 py-3">Created</th>
										<th className="text-right px-4 py-3">Closed</th>
										<th className="text-right px-4 py-3">Action</th>
									</tr>
								</thead>
								<tbody>
									{closedAds.length > 0 ? (
										closedAds.map((ad) => (
											<tr key={ad.id}>
												<td className="text-left px-4 py-2 font-semibold">
													<span
														style={{
															color:
																ad.type.toLowerCase() === "sell"
																	? "#DC2625"
																	: "#17A34A",
														}}
													>
														{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
													</span>
												</td>
												<td className="text-left px-4 py-2 font-semibold">
													{ad.asset}
												</td>
												<td className="text-left px-4 py-2">
													{formatPrice({ price: ad.price })}
												</td>
												<td className="text-left px-4 py-2">
													{ad.quantity || "N/A"}
												</td>
												<td className="text-right px-4 py-2">
													{formatDate(ad.createdAt)}
												</td>
												<td className="text-right px-4 py-3">
													{formatDate(ad.closedAt)}
												</td>
												<td className="text-right px-4 py-3 relative">
													<TableActionMenu />
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={7} className="text-center py-4">
												No closed ads found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default MyAds;
