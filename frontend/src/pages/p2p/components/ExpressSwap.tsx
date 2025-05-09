import { PrimaryButton } from "../../../components/buttons/Buttons";
import { assets, TokenData } from "../../../data";
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import { useState, useEffect, useMemo } from "react";
import SwapConfirmation from "../../../components/Modals/SwapConfirmation";
import { typeofSwam } from "./Swap";
import { useSelector } from "react-redux";
import { UserState } from "../../../redux/reducers/userSlice";
import Bisatsfetch from "../../../redux/fetchWrapper";
import { GetExpressAds, GetLivePrice } from "../../../redux/actions/walletActions";
import TokenSelect from "../../../components/Inputs/TokenSelect";
import SingleToken from "../../../components/Inputs/SingleToken";
import { PriceData } from "../../wallet/Assets";
import { convertAssetToNaira, convertNairaToAsset } from "../../../utils/conversions";
import { WalletState } from "../../../redux/reducers/walletSlice";
import { bisats_charges } from "../../../utils/transaction_limits";
import Toast from "../../../components/Toast";
import Header from "./Header";

export interface AdSchema {
	id: string;
	userId: string;
	type: string;
	orderType: "buy"|"sell"|string;
	asset: keyof typeof assets;
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
	data: AdSchema[];
}

const ExpressSwap = () => {
	const [active, setActive] = useState(0);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [expressAds, setExpressAds] = useState<AdSchema[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [networkFee, setNetworkFee] = useState<string | null>(null);
	const [transactionFee, setTransactionFee] = useState<string | null>(null);
	const [orderError, setOrderError] = useState<string | null>(null);
	const [adsParam, setAdsParam] = useState({
		asset: "",
		type: "buy",
		amount:"0"
	})
	const [tokenPrice,setTokenPrice]=useState<PriceData>()
	const user = useSelector((state: { user: UserState }) => state.user);
	const walletState: WalletState = useSelector((state: any) => state.wallet);
	
	
	const userId = user?.user?.userId || "";
	 useEffect(() => {
			const fetchPrices = async () => {
				const prices = await GetLivePrice();
				setTokenPrice(prices);
			};
	
			fetchPrices();
		}, []);
	useEffect(() => {
		const FetchAds = async () => {
			setLoading(true)
			
			const res = await GetExpressAds({ ...adsParam, userId: userId })
		
			if (res.length <= 0||!res) {
				setError("Could not find any express ad at this moment")
			} else {
				setError(null)
			}
			setLoading(false)

			setExpressAds(res)
		}

		if (adsParam?.amount && parseFloat(adsParam?.amount) > 0) {
			const debounceTimer = setTimeout(() => {
				FetchAds()
			}, 500); 

			return () => clearTimeout(debounceTimer);
		}
	},[adsParam, userId])

	
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// setAmount(e.target.value);
		setAdsParam({...adsParam,amount:e.target.value})
	};

	const calculateReceiveAmount = useMemo(() => {

		// if (!expressAds.length || !adsParam.amount || parseFloat(adsParam.amount) <= 0) return "";

		const inputAmount = parseFloat(adsParam.amount);
		const price = expressAds[0]?.price;
		

		if (adsParam?.type.toLowerCase() === "buy") {
			// Buy
			const amount = tokenPrice ? convertNairaToAsset(adsParam?.asset as keyof typeof assets, inputAmount, price, tokenPrice) : null 
			return amount !== null ? amount.toFixed(2) : "0.00";
		} else {
			// Sell
			const amount = tokenPrice ?convertAssetToNaira(adsParam?.asset as keyof typeof assets, inputAmount, price, tokenPrice): null 
			return amount !== null ? amount.toFixed(2) : "0.00";
		}

	},[adsParam, expressAds, tokenPrice])

	const calculateFee = () => {
		if (!adsParam?.amount || parseFloat(adsParam?.amount) <= 0) return "0";
		const feePercentage = bisats_charges.crypto_buy;
		return (parseFloat(adsParam?.amount) * feePercentage).toFixed(2);
	};

	const fetchNetworkFee = async () => {
		if (!expressAds.length || !adsParam?.amount) return null;

		try {
			const adsId = expressAds[0]?.id;
			const amountValue = parseFloat(adsParam?.amount);

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


			if (response.status) {
				setNetworkFee(response?.data?.networkFee);
				setTransactionFee(response?.data?.transactionFee);
				return response.data;
			} else {
				setError("Failed to fetch network fee: " + response.message);
				return response;
			}
		} catch (err) {
			console.error("Error fetching network fee:", err);
			setError("Failed to fetch network fee. Please try again.");
			return null;
		}
	};

	const placeOrder = async (feeData: any) => {
		if (!expressAds.length || !adsParam?.amount) return;

		try {
			const adsId = expressAds[0].id;
			const amountValue = parseFloat(adsParam?.amount);

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
		if (!expressAds.length || !adsParam?.amount) return;
		if (adsParam?.type === "buy") {
			if (Number(adsParam?.amount) > Number(walletState?.wallet?.xNGN)) {
				Toast.error("Your xNGN balance is not enough to carry out this transaction", "Insufficient Wallet Balance")	
				return
			}
		} else {
			if (Number(adsParam?.amount) > Number(walletState?.wallet?.[adsParam?.asset])) {
				Toast.error(`Your ${adsParam?.asset} balance is not enough to carry out this transaction`, "Insufficient Wallet Balance")
				return
			}
		}
		setConfirmLoading(true);
		setOrderError(null);

		try {
			const feeData = await fetchNetworkFee();
			if (!feeData.status) {
				setOrderError(feeData?.message);
				Toast.error(feeData?.message,"Failed")
				setConfirmLoading(false);
				setShowConfirmation(false)
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
				Toast.success(orderResult?.message, "Success");
			} else {
				Toast.error(orderResult?.message,"Failed");
			}
		} catch (err) {
			console.error(err)
			Toast.error("An eeror occured","Error");
			setOrderError("An unexpected error occurred. Please try again.");
		} finally {
			setConfirmLoading(false);
		}
	};


	const getCurrencyName = () =>
		adsParam.type === "buy" ? adsParam?.asset : "xNGN";

	return (
		<div>
			<Header text="P2P Express" subtext="Skip the stress of manually finding a merchant." />

			<div className="flex items-center my-1 w-full border-b-[1px] border-[#F3F4F6] justify-between my-5">
				<p
					onClick={() => setAdsParam({ ...adsParam, type: "buy",amount:"0",asset:"" })}
					className={`w-1/2 text-center cursor-pointer ${
						adsParam.type === "buy"
							? " text-[18px] border-b-[3px] py-1 px-3 border-[#49DE80] rounded-t-[2px] text-[#49DE80] font-[600]"
							: ""
					}`}
				>
					{" "}
					Buy
				</p>
				<p
					onClick={() => setAdsParam({ ...adsParam, type: "sell", amount: "0", asset: "" })}
					className={`w-1/2 text-center cursor-pointer ${
						adsParam.type==="sell"
							? " text-[18px] border-b-[3px] py-1 px-3 border-[#DC2625] rounded-t-[2px] text-[#DC2625] font-[600]"
							: ""
					}`}
				>
					{" "}
					Sell
				</p>
			</div>
			
			{
				adsParam.type === "buy" ?
					<div>
						<div className="relative">
							<PrimaryInput
								css={"w-full h-[64px]"}
								label={"Amount"}
								error={undefined}
								touched={undefined}
								value={adsParam?.amount}

								type="number"
								onChange={handleAmountChange}
							/>
							<div className="absolute right-3 top-10 w-2/5">
								<SingleToken prop={TokenData[0]}  />
							</div>
							<small className="text-[#606C82] text-[12px] font-[400]">
						Balance: {walletState?.wallet?.xNGN} {adsParam?.type === "buy" ? "xNGN" : "USDT"}
					</small>
						</div>
						<div className="relative my-10">
							<PrimaryInput
								css={"w-full h-[64px]"}
								label={"You'll receive at least"}
								error={undefined}
								touched={undefined}
								readOnly
								value={calculateReceiveAmount}
							/>
							<div className="absolute right-3 top-10 w-2/5">
								<TokenSelect title={"Select a token"} label={""} removexNGN={ true} error={undefined} touched={undefined} handleChange={(param) => { setAdsParam({ ...adsParam, asset: param }) }} />
							</div>
							{/* <small className="text-[#606C82] text-[12px] font-[400]">
								Balance: 20,000 {active === 0 ? "USDT" : "xNGN"}
							</small> */}

							{expressAds.length > 0 && adsParam?.amount && (
								<p className="text-[#515B6E] text-[14px] font-[400] my-5">
									<span>1 {adsParam?.asset}</span> ≈{" "}
									<span>
										{active === 0
											? expressAds[0]?.price.toFixed(5)
											: (1 / expressAds[0]?.price).toFixed(5)}{" "}
										{active === 0 ? "xNGN" : "USDT"}
									</span>
									{/* <span className="text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]">
										{" "}
										30 s
									</span> */}
								</p>
							)}

							{error && (
								<p className="text-[#FFCCCB] text-[12px] font-[400] mt-2">{error}</p>
							)}
						</div>
					</div> :

					<div>
						<div className="relative">
							<PrimaryInput
								css={"w-full h-[64px]"}
								label={"Amount"}
								error={undefined}
								touched={undefined}
								value={adsParam?.amount}
								onChange={handleAmountChange}
							/>
							<div className="absolute right-3 top-10 w-2/5">
								<TokenSelect title={"Select token to sell"} removexNGN={ true} label={""} error={undefined} touched={undefined} handleChange={(param) => { setAdsParam({ ...adsParam, asset: param }) }} />
							</div>
							{/* <small className="text-[#606C82] text-[12px] font-[400]">
						Balance: 20,000 {active === 0 ? "xNGN" : "USDT"}
					</small> */}
						</div>
						<div className="relative my-10">
							<PrimaryInput
								css={"w-full h-[64px]"}
								label={"You'll receive at least"}
								error={undefined}
								touched={undefined}
								readOnly
								value={calculateReceiveAmount}
							/>
							<div className="absolute right-3 top-10 w-2/5">
								<SingleToken prop={TokenData[0]} />
							</div>
							{/* <small className="text-[#606C82] text-[12px] font-[400]">
								Balance: 20,000 {active === 0 ? "USDT" : "xNGN"}
							</small> */}

							{expressAds.length > 0 && adsParam?.amount && (
								<p className="text-[#515B6E] text-[14px] font-[400] my-5">
									<span>1 {adsParam.asset}</span> ≈ {" "}
									<span>
										{adsParam?.type==="buy"
											? expressAds[0]?.price.toFixed(5)
											: (1 / expressAds[0]?.price).toFixed(5)}{" "}
										{active === 0 ? "xNGN" : "USDT"}
									</span>
									{/* <span className="text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]">
										{" "}
										30 s
									</span> */}
								</p>
							)}

							{error && (
								<p className="text-[#FFCCCB] text-[12px] font-[400] mt-2">{error}</p>
							)}
						</div>
					</div>}
			
			<PrimaryButton
				text={`${adsParam.type==="buy"? "Buy" : "Sell"} ${adsParam?.asset}`}
				loading={false}
				css="w-full"
				onClick={() => setShowConfirmation(true)}
				disabled={error||(adsParam?.amount)==="0"?true:false}
			/>

			{showConfirmation && (
				<SwapConfirmation
					close={() => setShowConfirmation(false)}
					type={adsParam?.type === "buy" ? typeofSwam.Buy : typeofSwam.Sell}
					amount={adsParam?.amount}
					receiveAmount={calculateReceiveAmount}
					fee={calculateFee()}
					token={adsParam?.type === "buy" ?"xNGN":adsParam?.asset}
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
