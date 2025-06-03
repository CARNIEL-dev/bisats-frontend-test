import React, { useState, useEffect } from "react";
import Empty from "../../components/Empty";
import { getUser } from "../../helpers";
import Bisatsfetch from "../../redux/fetchWrapper";
import AdsTable, { IAd } from "../../components/Table/AdsTable";

export enum Fields {
	OrderType = "Order type",
	Date = "Date & Time",
	Reference = "Reference",
	Quantity = "Quantity",
	Amount = "Amount",
	Status = "Status",
}

const Ads: React.FC = () => {
	const [ads, setAds] = useState<Array<IAd>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserAds();
	}, []);

	const fetchUserAds = async () => {
		console.log("Fetching ads...");
		try {
			setLoading(true);
			setError(null);

			const user = getUser();
			if (!user || !user.userId) {
				console.error("User data not found or userId is missing");
				setError("User authentication issue. Please log in again.");
				setLoading(false);
				return;
			}

			const response = await Bisatsfetch(
				`/api/v1/user/${user.userId}/ads/get-user-ads?status=active`,
				{
					method: "GET",
				}
			);

			if (response) {
				if (response.message === "No ads found") {
					setAds([]);
				} else if (response.statusCode === 200 && response.data) {
					const adsData = response.data || [];

					const transformedAds: IAd[] = Array.isArray(adsData)
						? adsData.map((ad: any) => {
								const adDate = new Date(ad.createdAt || new Date());
								const formattedDate = adDate
									.toLocaleString("en-US", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										hour12: false,
									})
									.replace(",", "");

								return {
									type: ad.type || "Unknown",
									amount: ad.amountFilled || 0,
									price: ad.price || 0,
									asset: ad.asset || "Unknown",
									"Order type": ad.type
										? ad.type.charAt(0).toUpperCase() + ad.type.slice(1)
										: "Unknown",
									"Date & Time": formattedDate,
									Reference: ad.id || "N/A",
									Quantity: ad.amountFilled || 0,
									Amount: ad.price || 0,
									Status: ad.status
										? ad.status.charAt(0).toUpperCase() + ad.status.slice(1)
										: "Unknown",
								};
						  })
						: [];
					setAds(transformedAds.slice(0, 4));
				} else if (response.message !== "No ads found") {
					console.error("API returned error status:", response);
					setError(`Error: ${response?.message || "Failed to load ads"}`);
				}
			} else {
				setError("Failed to receive API response");
			}
		} catch (err) {
			console.error("Error fetching ads:", err);
			const errorMessage =
				err instanceof Error ? err.message : "An unknown error occurred";
			setError(`Failed to load ads data: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	const handleRetry = () => {
		fetchUserAds();
	};

	const handleAdClick = (ad: IAd) => {
		console.log("Ad clicked:", ad);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span className="ml-2">Loading ads...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-32">
				<div className="text-red-500 text-center mb-4">{error}</div>
				<button
					onClick={handleRetry}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					Retry
				</button>
			</div>
		);
	}

	if (!ads || ads.length === 0) {
		return <Empty />;
	}

	return (
		<div>
			<AdsTable ads={ads} onRowClick={handleAdClick} className="w-full" />
		</div>
	);
};

export default Ads;
