import { PrimaryButton } from "../../../components/buttons/Buttons";
import { TokenData } from "../../../data";
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import { useState, useEffect } from "react";
import SwapConfirmation from "../../../components/Modals/SwapConfirmation";
import { typeofSwam } from "./Swap";
import { useSelector } from "react-redux";
import { UserState } from "../../../redux/reducers/userSlice";
import Bisatsfetch from "../../../redux/fetchWrapper";

interface ExpressAd {
	id: string;
	userId: string;
	type: string;
	asset: string;
	amount: number;
	amountAvailable: number;
	amountFilled: number;
	minimumLimit: number;
	maximumLimit: number;
	expiryDate: string;
	currency: string;
	priceType: string;
	price: number;
	priceMargin: number;
	priceUpperLimit: number;
	priceLowerLimit: number;
	status: string;
	createdAt: string;
	updatedAt: string;
}

interface NetworkFeeResponse {
	status: boolean;
	statusCode: number;
	message: string;
	data: {
		assetType: string;
		network: string;
		networkFee: string;
		networkFeeInUSD: string;
		transactionFee: string;
	};
}

interface OrderResponse {
	status: boolean;
	statusCode: number;
	message: string;
	data: any;
}

interface ApiResponse {
	status: boolean;
	statusCode: number;
	message: string;
	data: ExpressAd[];
}

const ExpressSwap = () => {
	const [active, setActive] = useState(0);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [expressAds, setExpressAds] = useState<ExpressAd[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [networkFee, setNetworkFee] = useState<string | null>(null);
	const [transactionFee, setTransactionFee] = useState<string | null>(null);
	const [orderError, setOrderError] = useState<string | null>(null);

	const user = useSelector((state: { user: UserState }) => state.user);
	const userId = user?.user?.userId || "";

	const fetchExpressAds = async () => {
		if (!amount || parseFloat(amount) <= 0) return;

		setLoading(true);
		setError(null);

		try {
			const asset = active === 0 ? "SOL_TEST" : "USDT";
			const type = active === 0 ? "buy" : "sell";

			const response = await Bisatsfetch(
				`/api/v1/user/${userId}/ads/express-ads?asset=${asset}&amount=${amount}&limit=1&skip=0`,
				{
					method: "GET",
				}
			);

			console.log(`Express Ads API Response for ${userId}:`, response);

			if (response.status) {
				setExpressAds(response.data || []);
			} else {
				setExpressAds([]);
				console.log("No express ads available at the moment.");
			}
		} catch (err) {
			console.error("Error fetching express ads:", err);
			setError("Failed to fetch express ads. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value);
	};

	const calculateReceiveAmount = () => {
		if (!expressAds.length || !amount || parseFloat(amount) <= 0) return "";

		const inputAmount = parseFloat(amount);
		const price = expressAds[0].price;

		if (active === 0) {
			// Buy
			return (inputAmount * price).toFixed(2);
		} else {
			// Sell
			return (inputAmount / price).toFixed(2);
		}
	};

	const calculateFee = () => {
		if (!amount || parseFloat(amount) <= 0) return "0";
		const feePercentage = 0.01;
		return (parseFloat(amount) * feePercentage).toFixed(2);
	};

	const fetchNetworkFee = async () => {
		if (!expressAds.length || !amount) return null;

		try {
			const adsId = expressAds[0].id;
			const amountValue = parseFloat(amount);

			const response = await Bisatsfetch(
				`/api/v1/user/${userId}/ads/${adsId}/networkFee`,
				{
					method: "POST",
					body: JSON.stringify({
						userId: userId,
						amount: amountValue,
					}),
				}
			);

			console.log("Network Fee API Response:", response);

			if (response.status) {
				setNetworkFee(response.data.networkFee);
				setTransactionFee(response.data.transactionFee);
				return response.data;
			} else {
				setError("Failed to fetch network fee: " + response.message);
				return null;
			}
		} catch (err) {
			console.error("Error fetching network fee:", err);
			setError("Failed to fetch network fee. Please try again.");
			return null;
		}
	};

	const placeOrder = async (feeData: any) => {
		if (!expressAds.length || !amount) return;

		try {
			const adsId = expressAds[0].id;
			const amountValue = parseFloat(amount);

			const response = await Bisatsfetch(
				`/api/v1/user/${userId}/ads/${adsId}/order`,
				{
					method: "POST",
					body: JSON.stringify({
						userId: userId,
						amount: amountValue,
						networkFee: feeData.networkFee,
						transactionFee: feeData.transactionFee,
					}),
				}
			);

			console.log("Place Order API Response:", response);

			if (response.status) {
				return { success: true, data: response.data };
			} else {
				setOrderError(response.message);
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error placing order:", err);
			setOrderError("Failed to place order. Please try again.");
			return { success: false, message: "Failed to place order." };
		}
	};

	const handleConfirmTransaction = async () => {
		if (!expressAds.length || !amount) return;

		setConfirmLoading(true);
		setOrderError(null);

		try {
			const feeData = await fetchNetworkFee();

			if (!feeData) {
				setOrderError("Failed to calculate network fee");
				setConfirmLoading(false);
				return;
			}

			const orderResult = await placeOrder(feeData);

			if (orderResult?.success) {
				setShowConfirmation(false);
				setAmount("");
				setExpressAds([]);
				setNetworkFee(null);
				setTransactionFee(null);

				// TODO: Show success notification
				console.log("Transaction completed successfully", orderResult?.data);
			} else {
				console.error("Transaction failed:", orderResult?.message);
			}
		} catch (err) {
			console.error("Error processing transaction:", err);
			setOrderError("An unexpected error occurred. Please try again.");
		} finally {
			setConfirmLoading(false);
		}
	};

	// Fetch ads when amount changes and has value
	useEffect(() => {
		if (amount && parseFloat(amount) > 0) {
			const debounceTimer = setTimeout(() => {
				fetchExpressAds();
			}, 500); // Debounce API call

			return () => clearTimeout(debounceTimer);
		}
	}, [amount, active]);

	const getTokenName = () =>
		active === 0 ? TokenData[1].tokenName : TokenData[0].tokenName;
	const getCurrencyName = () =>
		active === 0 ? TokenData[0].tokenName : TokenData[1].tokenName;

	return (
		<div>
			<h1 className="text-[28px] md:text-[34px] text-[#0A0E12] font-[600] leading-[40px] my-3">
				P2P Express
			</h1>

			<p className="text-[#515B6E] text-[14px] font-[400] my-2">
				Skip the stress of manually finding a merchant.
			</p>
			<div className="flex items-center my-1 w-full border-b-[1px] border-[#F3F4F6] justify-between my-5">
				<p
					onClick={() => setActive(0)}
					className={`w-1/2 text-center cursor-pointer ${
						active === 0
							? " text-[18px] border-b-[3px] py-1 px-3 border-[#49DE80] rounded-t-[2px] text-[#49DE80] font-[600]"
							: ""
					}`}
				>
					{" "}
					Buy
				</p>
				<p
					onClick={() => setActive(1)}
					className={`w-1/2 text-center cursor-pointer ${
						active === 1
							? " text-[18px] border-b-[3px] py-1 px-3 border-[#DC2625] rounded-t-[2px] text-[#DC2625] font-[600]"
							: ""
					}`}
				>
					{" "}
					Sell
				</p>
			</div>

			<div>
				<div className="relative">
					<PrimaryInput
						css={"w-full h-[64px]"}
						label={"Amount"}
						error={undefined}
						touched={undefined}
						value={amount}
						onChange={handleAmountChange}
					/>
					<div className="absolute right-3 top-10">
						<button
							className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
							type="button"
						>
							{active === 0 ? TokenData[0].tokenLogo : TokenData[1].tokenLogo}
							<div className="mx-3">
								{active === 0 ? TokenData[0].tokenName : TokenData[1].tokenName}
							</div>
						</button>
					</div>
					<small className="text-[#606C82] text-[12px] font-[400]">
						Balance: 20,000 {active === 0 ? "xNGN" : "USDT"}
					</small>
				</div>
				<div className="relative my-10">
					<PrimaryInput
						css={"w-full h-[64px]"}
						label={"You'll receive at least"}
						error={undefined}
						touched={undefined}
						readOnly
						value={calculateReceiveAmount()}
					/>
					<div className="absolute right-3 top-10">
						<button
							className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
							type="button"
						>
							{active === 0 ? TokenData[1].tokenLogo : TokenData[0].tokenLogo}
							<div className="mx-3">
								{active === 0 ? TokenData[1].tokenName : TokenData[0].tokenName}
							</div>
						</button>
					</div>
					<small className="text-[#606C82] text-[12px] font-[400]">
						Balance: 20,000 {active === 0 ? "USDT" : "xNGN"}
					</small>

					{expressAds.length > 0 && amount && (
						<p className="text-[#515B6E] text-[14px] font-[400] my-5">
							<span>1 {active === 0 ? "USDT" : "xNGN"}</span> ≈{" "}
							<span>
								{active === 0
									? expressAds[0].price.toFixed(5)
									: (1 / expressAds[0].price).toFixed(5)}{" "}
								{active === 0 ? "xNGN" : "USDT"}
							</span>
							<span className="text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]">
								{" "}
								30 s
							</span>
						</p>
					)}

					{error && (
						<p className="text-red-500 text-[12px] font-[400] mt-2">{error}</p>
					)}
				</div>
			</div>
			<PrimaryButton
				text={`${active === 0 ? "Buy" : "Sell"} ${getTokenName()}`}
				loading={loading}
				css="w-full"
				onClick={() => setShowConfirmation(true)}
				disabled={!expressAds.length || !amount}
			/>

			{showConfirmation && (
				<SwapConfirmation
					close={() => setShowConfirmation(false)}
					type={active === 0 ? typeofSwam.Buy : typeofSwam.Sell}
					amount={amount}
					receiveAmount={calculateReceiveAmount()}
					fee={calculateFee()}
					token={getTokenName()}
					currency={getCurrencyName()}
					loading={confirmLoading}
					onConfirm={handleConfirmTransaction}
					networkFee={networkFee}
					transactionFee={transactionFee}
					error={orderError}
				/>
			)}
		</div>
	);
};

export default ExpressSwap;
