import React, { useState, useEffect } from "react";

// Define types for API response and market rates
interface CoinGeckoResponse {
	[key: string]: {
		usd: number;
		ngn: number;
		usd_24h_change?: number;
		ngn_24h_change?: number;
	};
}

interface MarketRateItem {
	logo: string;
	token: string;
	name: string;
	rate: string;
	change: number;
	id?: string;
}

const coinInfo: Record<string, { name: string; logo: string }> = {
	bitcoin: {
		name: "Bitcoin",
		logo: "/Icon/BTC.png",
	},
	ethereum: {
		name: "Ethereum",
		logo: "/Icon/ETH.png",
	},
	solana: {
		name: "Solana",
		logo: "/Icon/SOL.png",
	},
	tron: {
		name: "Tron",
		logo: "/Icon/TRX.png",
	},
	tether: {
		name: "Tether USD",
		logo: "/Icon/USDT.png",
	},
};

const defaultRates: MarketRateItem[] = [
	{
		logo: "/Icon/NGN.png",
		token: "xNGN",
		name: "Naira on Bisats",
		rate: "1",
		change: 0,
	},
	{
		logo: "/Icon/USDT.png",
		token: "USDT",
		id: "tether",
		name: "Tether USD",
		rate: "1580.40",
		change: 0,
	},
	{
		logo: "/Icon/BTC.png",
		token: "BTC",
		id: "bitcoin",
		name: "Bitcoin",
		rate: "150,461,503.76",
		change: 5,
	},
];

const MarketRate: React.FC = () => {
	const [marketRates, setMarketRates] =
		useState<MarketRateItem[]>(defaultRates);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMarketRates = async () => {
			try {
				setLoading(true);

				const coins = ["bitcoin", "ethereum", "solana", "tron", "tether"];

				const response = await fetch(
					`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(
						","
					)}&vs_currencies=usd,ngn&include_24h_change=true`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data: CoinGeckoResponse = await response.json();

				const updatedRates: MarketRateItem[] = [];

				updatedRates.push({
					logo: "/Icon/NGN.png",
					token: "xNGN",
					name: "Naira on Bisats",
					rate: "1",
					change: 0,
				});

				for (const coinId of coins) {
					if (coinId === "tether") {
						updatedRates.push({
							logo: coinInfo[coinId]?.logo || "",
							token: "USDT",
							name: coinInfo[coinId]?.name || coinId,
							rate:
								data[coinId]?.ngn.toLocaleString("en-US", {
									maximumFractionDigits: 2,
								}) || "N/A",
							change: Number(data[coinId]?.usd_24h_change?.toFixed(2)) || 0,
							id: coinId,
						});
					} else if (coinId === "bitcoin") {
						updatedRates.push({
							logo: coinInfo[coinId]?.logo || "",
							token: "BTC",
							name: coinInfo[coinId]?.name || coinId,
							rate:
								data[coinId]?.ngn.toLocaleString("en-US", {
									maximumFractionDigits: 2,
								}) || "N/A",
							change: Number(data[coinId]?.ngn_24h_change?.toFixed(2)) || 0,
							id: coinId,
						});
					}
				}

				setMarketRates(updatedRates);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching market rates:", err);
				setError("Failed to fetch market rates");
				setLoading(false);
			}
		};

		fetchMarketRates();

		const interval = setInterval(fetchMarketRates, 60000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className="border-[1px] w-full p-3 md:p-[16px]"
			style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
		>
			<div className="mb-[6px]">
				<p style={{ fontSize: "15px", fontWeight: "600", color: "#0A0E12" }}>
					Market Rates (per unit)
				</p>
			</div>
			<div>
				{loading ? (
					<div className="flex justify-center items-center h-32">
						<p>Loading rates...</p>
					</div>
				) : error ? (
					<div className="flex justify-center items-center h-32">
						<p className="text-red-500">{error}</p>
					</div>
				) : (
					marketRates.slice(0, 3).map((rate, index) => (
						<div
							key={index}
							className="py-[6px]"
							style={index === 0 ? {} : { borderTop: "1px solid #D6DAE1" }}
						>
							<div className="flex justify-between">
								<div className="flex">
									<img
										src={rate.logo || "/Icon/default-coin.png"}
										alt={`${rate.token} logo`}
										className="h-[24px] w-[24px] mr-[8px] mt-2"
									/>
									<div>
										<p
											style={{ color: "#515B6E", fontSize: "14px" }}
											className="font-semibold "
										>
											{rate.token}
										</p>
										<p style={{ color: "#606C82", fontSize: "12px" }}>
											{rate.name}
										</p>
									</div>
								</div>
								<div className="flex mt-3">
									<p
										style={{
											color: "#2B313B",
											fontWeight: "600",
										}}
										className="mr-[8px] text-[12px] sm:text-[14px]"
									>
										{rate.rate} NGN
									</p>
									<p
										style={{
											color:
												parseFloat(String(rate.change)) > 0
													? "#00A86B"
													: parseFloat(String(rate.change)) < 0
													? "#FF4D4F"
													: "#515B6E",
											fontSize: "12px",
										}}
									>
										{parseFloat(String(rate.change)) > 0 ? "+" : ""}
										{rate.change}%
									</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default MarketRate;
