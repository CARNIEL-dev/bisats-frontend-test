import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PrimaryButton } from "../../components/buttons/Buttons";
import KycManager from "../kyc/KYCManager";
import { APP_ROUTES } from "../../constants/app_route";
import { ACTIONS } from "../../utils/transaction_limits";
import { GetWallet } from "../../redux/actions/walletActions";

interface WalletData {
	id: string;
	userId: string;
	xNGN: number;
	SOL: number;
	BTC: number;
	USDT_ETH: number;
	USDT_TRX: number;
	USDT_SOL: number;
	ETH: number;
	TRX: number;
}

interface CryptoRates {
	bitcoin?: { usd: number; ngn: number };
	ethereum?: { usd: number; ngn: number };
	solana?: { usd: number; ngn: number };
	tron?: { usd: number; ngn: number };
	usd?: { usd: number; ngn: number };
}

interface WalletState {
	wallet: WalletData | null;
	loading: boolean;
	error: string | null;
}

interface RootState {
	wallet: WalletState;
}

const Balance: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showBalance, setShowBalance] = useState(true);
	const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
	const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
	const [cryptoRates, setCryptoRates] = useState<CryptoRates | null>(null);
	const [totalBalance, setTotalBalance] = useState<number | null>(null);

	const walletData = useSelector((state: RootState) => state.wallet.wallet);
	const walletLoading = useSelector((state: RootState) => state.wallet.loading);
	const walletError = useSelector((state: RootState) => state.wallet.error);

	// Fetch wallet data
	useEffect(() => {
		const fetchWalletData = async () => {
			try {
				await dispatch(GetWallet() as any);
			} catch (err) {
				console.error("Error fetching wallet:", err);
			}
		};

		fetchWalletData();
	}, [dispatch]);

	// Fetch crypto rates when wallet data is available
	useEffect(() => {
		const fetchCryptoRates = async () => {
			try {
				const response = await fetch(
					"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tron,usd&vs_currencies=usd,ngn"
				);

				if (response.ok) {
					const data = await response.json();
					setCryptoRates(data);
				}
			} catch (err) {
				console.error("Error fetching crypto rates:", err);
			}
		};

		if (walletData && !cryptoRates) {
			fetchCryptoRates();
		}
	}, [walletData, cryptoRates]);

	// Calculate total balance when rates are available
	useEffect(() => {
		if (walletData && cryptoRates) {
			calculateTotalBalance();
		}
	}, [walletData, cryptoRates, currency]);

	// Simple function to calculate the total balance
	const calculateTotalBalance = () => {
		if (!walletData || !cryptoRates) return;

		const currencyKey = currency.toLowerCase() as "usd" | "ngn";
		let total = 0;

		// Bitcoin
		if (walletData.BTC && cryptoRates.bitcoin) {
			total += walletData.BTC * cryptoRates.bitcoin[currencyKey];
		}

		// Ethereum
		if (walletData.ETH && cryptoRates.ethereum) {
			total += walletData.ETH * cryptoRates.ethereum[currencyKey];
		}

		// Solana
		if (walletData.SOL && cryptoRates.solana) {
			total += walletData.SOL * cryptoRates.solana[currencyKey];
		}

		// Tron
		if (walletData.TRX && cryptoRates.tron) {
			total += walletData.TRX * cryptoRates.tron[currencyKey];
		}

		// USDT (all types)
		const usdtTotal =
			(walletData.USDT_ETH || 0) +
			(walletData.USDT_TRX || 0) +
			(walletData.USDT_SOL || 0);

		if (usdtTotal > 0 && cryptoRates.usd) {
			total += usdtTotal * cryptoRates.usd[currencyKey];
		}

		// xNGN
		if (walletData.xNGN) {
			if (currency === "NGN") {
				total += walletData.xNGN;
			} else if (cryptoRates.usd && cryptoRates.usd.ngn) {
				// Convert NGN to USD
				total += walletData.xNGN / cryptoRates.usd.ngn;
			}
		}

		console.log(`Total balance in ${currency}:`, total);
		setTotalBalance(total);
	};

	const formatBalance = () => {
		if (totalBalance === null) return "0.00";

		return totalBalance.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const toggleBalanceVisibility = () => {
		setShowBalance(!showBalance);
	};

	const toggleCurrencyDropdown = () => {
		setShowCurrencyDropdown(!showCurrencyDropdown);
	};

	const changeCurrency = (newCurrency: "USD" | "NGN") => {
		setCurrency(newCurrency);
		setShowCurrencyDropdown(false);
	};

	const getCurrencySymbol = () => {
		return currency === "USD" ? "$" : "₦";
	};

	const isLoading = walletLoading || (!cryptoRates && !walletError);

	return (
		<div
			className="border-[1px] h-full w-full py-3 px-3 md:py-6 md:px-6"
			style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
		>
			<div className="m-[2px]">
				<p
					style={{ color: "#2B313B", fontSize: "15px" }}
					className="font-semibold"
				>
					Total Balance
					<img
						className="mx-[8px] inline h-[15px] w-[15px] cursor-pointer outline-none"
						src={showBalance ? "/Icon/eye.png" : "/Icon/eye.png"}
						alt={showBalance ? "hide balance" : "show balance"}
						tabIndex={0}
						onClick={toggleBalanceVisibility}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								toggleBalanceVisibility();
							}
						}}
					/>
				</p>
			</div>
			<div className="m-[2px]">
				<p style={{ color: "#0A0E12" }}>
					{isLoading ? (
						<span style={{ fontSize: "22px", fontWeight: 400 }}>
							Loading...
						</span>
					) : walletError ? (
						<span
							style={{ fontSize: "18px", fontWeight: 400, color: "#ff6b6b" }}
						>
							Error loading balance
						</span>
					) : (
						<>
							<span
										style={{ fontWeight: 600 }}
										className={`mr-[0.5px] text-[28px] md:text-[34px] ${!showBalance &&"blur"}`}
							>
								{getCurrencySymbol()}
								{formatBalance().split(".")[0]}
							</span>
							<span
								style={{ fontWeight: 600 }}
								className={`mr-[4px] text-[18px] md:text-[22px] ${!showBalance &&"blur"}`}
							>
								.{formatBalance().split(".")[1]}
							</span>
						</>
					) }
					<span
						className="cursor-pointer relative"
						tabIndex={0}
						onClick={toggleCurrencyDropdown}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								toggleCurrencyDropdown();
							}
						}}
					>
						<span style={{ fontSize: "16px", fontWeight: 400 }}>
							{" "}
							{currency}
						</span>
						<img
							className="inline h-[16px] w-[16px] cursor-pointer"
							src="/Icon/Arrow-down-Fill.png"
							alt="currency dropdown"
						/>
						{showCurrencyDropdown && (
							<div
								className="absolute text-[12px] top-full left-8 mt-1 bg-white border-[1px] border-gray-200 rounded shadow-lg z-10 px-2 pr-4 gap-y-2 py-1"
								style={{
									borderRadius: "12px",
									borderColor: "#D6DAE1",
								}}
							>
								<div
									className=" hover:bg-gray-100 cursor-pointer"
									onClick={() => changeCurrency("USD")}
								>
									USD
								</div>
								<div
									className=" hover:bg-gray-100 cursor-pointer"
									onClick={() => changeCurrency("NGN")}
								>
									NGN
								</div>
							</div>
						)}
					</span>
				</p>
			</div>
			<div>
				{/* <div>
					<p style={{ color: "#515B6E" }} className="mb-[25px]">
						<span style={{ fontSize: "12px", fontWeight: 600 }}>+$100.45</span>
						<span
							style={{ fontSize: "12px", fontWeight: 400 }}
							className="ml-[4px]"
						>
							0.11%
						</span>
					</p>
				</div> */}
			</div>
			<div>
				{/* <KycManager
					action={ACTIONS.DEPOSIT}
					func={() => navigate(APP_ROUTES.WALLET.DEPOSIT)}
				>
					{(validateAndExecute) => ( */}
						<PrimaryButton
							text={"Deposit"}
							loading={isLoading}
							css="w-full mt-10"
							onClick={() => navigate(APP_ROUTES.WALLET.DEPOSIT)}
						/>
					{/* )}
				</KycManager> */}
			</div>
		</div>
	);
};

export default Balance;
