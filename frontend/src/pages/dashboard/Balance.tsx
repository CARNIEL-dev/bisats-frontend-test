import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/buttons/Buttons";
import KycManager from "../kyc/KYCManager";
import { APP_ROUTES } from "../../constants/app_route";
import { ACTIONS } from "../../utils/transaction_limits";

const Balance: React.FC = () => {
	const navigate = useNavigate();
	const [showBalance, setShowBalance] = useState(true);
	const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
	const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

	const conversionRates = {
		USD: 1,
		NGN: 1500,
	};

	// Balance amounts
	const balanceUSD = 100000.05;
	const dailyGainUSD = 100.45;
	const percentageGain = 0.11;

	const formatBalance = () => {
		if (currency === "USD") {
			return balanceUSD.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		} else {
			const balanceNGN = balanceUSD * conversionRates.NGN;
			return balanceNGN.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
	};

	const formatDailyGain = () => {
		if (currency === "USD") {
			return `+$${dailyGainUSD.toFixed(2)}`;
		} else {
			const gainNGN = dailyGainUSD * conversionRates.NGN;
			return `+₦${gainNGN.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`;
		}
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

	return (
		<div
			className="border-[1px] h-[220px] w-[48.5%] py-[24px] px-[34px]"
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
					{showBalance ? (
						<>
							<span
								style={{ fontSize: "34px", fontWeight: 600 }}
								className="mr-[0.5px]"
							>
								{formatBalance().split(".")[0]}
							</span>
							<span
								style={{ fontSize: "22px", fontWeight: 600 }}
								className="mr-[4px]"
							>
								.{formatBalance().split(".")[1]}
							</span>
						</>
					) : (
						<span style={{ fontSize: "34px", fontWeight: 600 }}>***.**</span>
					)}
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
							{currency}
						</span>
						<img
							className="inline h-[16px] w-[16px]"
							src="/Icon/Arrow-down-Fill.png"
							alt="currency dropdown"
						/>
						{showCurrencyDropdown && (
							<div
								className="absolute top-full left-0 mt-1 bg-white border-[1px] border-gray-200 rounded shadow-lg z-10"
								style={{
									borderRadius: "12px",
									borderColor: "#D6DAE1",
									minWidth: "80px",
								}}
							>
								<div
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
									onClick={() => changeCurrency("USD")}
								>
									USD
								</div>
								<div
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
				<p style={{ color: "#515B6E" }} className="mb-[25px]">
					{showBalance ? (
						<>
							<span style={{ fontSize: "12px", fontWeight: 600 }}>
								{formatDailyGain()}
							</span>
							<span
								style={{ fontSize: "12px", fontWeight: 400 }}
								className="ml-[4px]"
							>
								{percentageGain}%
							</span>
						</>
					) : (
						<span style={{ fontSize: "12px", fontWeight: 600 }}>****</span>
					)}
				</p>
			</div>
			<div>
				<KycManager
					action={ACTIONS.DEPOSIT}
					func={() => navigate(APP_ROUTES.WALLET.DEPOSIT)}
				>
					{(validateAndExecute) => (
						<PrimaryButton
							text={"Deposit"}
							loading={false}
							css="w-full"
							onClick={validateAndExecute}
						/>
					)}
				</KycManager>
			</div>
		</div>
	);
};

export default Balance;
