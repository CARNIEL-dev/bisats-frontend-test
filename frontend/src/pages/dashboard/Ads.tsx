import React, { useState, useEffect } from "react";
import Table from "../../components/Table/Table";
import Empty from "../../components/Empty";
import { getUser } from "../../helpers";
import Bisatsfetch from "../../redux/fetchWrapper";

export enum Fields {
	OrderType = "Order Type",
	Asset = "Asset",
	Price = "Price",
	Amount = "Amount",
}

export interface Ad {
	"Order Type": string;
	Asset: string;
	Price: number;
	Amount: number;
	id?: string;
	status?: string;
}

const Ads: React.FC = () => {
	const fields: Fields[] = [
		Fields.OrderType,
		Fields.Asset,
		Fields.Price,
		Fields.Amount,
	];
	const [openAds, setOpenAds] = useState<Array<Ad>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const dummyAds: Ad[] = [
		{
			"Order Type": "Buy",
			Asset: "BTC",
			Price: 52450.75,
			Amount: 0.15,
			id: "ad-123456",
			status: "active",
		},
		{
			"Order Type": "Sell",
			Asset: "ETH",
			Price: 3210.25,
			Amount: 2.5,
			id: "ad-234567",
			status: "active",
		},
		{
			"Order Type": "Buy",
			Asset: "USDT",
			Price: 1.01,
			Amount: 5000,
			id: "ad-345678",
			status: "active",
		},
	];

	useEffect(() => {
		fetchUserAds();
	}, []);

	const fetchUserAds = async () => {
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
				`/api/v1/user/${user.userId}/ads/get-user-ads`,
				{ method: "GET" }
			);

			if (response) {
				if (response.statusCode === 200) {
					const adsData = response.data || [];

					const transformedAds: Ad[] = Array.isArray(adsData)
						? adsData.map((ad: any) => ({
								"Order Type": ad.type
									? ad.type.charAt(0).toUpperCase() + ad.type.slice(1)
									: "Unknown",
								Asset: ad.asset
									? ad.asset.replace(/_TEST\d*|_TEST|_KDZ\d*$/i, "")
									: "Unknown",
								Price: ad.price || 0,
								Amount: ad.amount || 0,
								id: ad.id,
								status: ad.status,
						  }))
						: [];

					setOpenAds(transformedAds);
				} else {
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

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				Loading ads...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-32">
				<div className="text-red-500 text-center mb-4">{error}</div>
				<button
					onClick={handleRetry}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div>
			{/* <Table fields={fields} data={dummyAds} /> */}

			{openAds.length === 0 ? (
				<Empty />
			) : (
				<Table fields={fields} data={openAds} />
			)}
		</div>
	);
};

export default Ads;
