import { PrimaryButton } from "../../../components/buttons/Buttons";
import TableActionMenu from "../../../components/Modals/TableActionMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetAds } from "../../../redux/actions/adActions";
import { UserState } from "../../../redux/reducers/userSlice";
import Empty from "../../../components/Empty";
import Header from "../components/Header";
import KycManager from "../../kyc/KYCManager";
import { ACTIONS } from "../../../utils/transaction_limits";
import Bisatsfetch from "../../../redux/fetchWrapper";
import Switch from "../../../components/Switch";
import Toast from "../../../components/Toast";
import { formatCrypto, formatNumber } from "../../../utils/numberFormat";

export interface IAd {
	id?: string;
	type: string;
	priceType: string;
	currency?: string;
	priceMargin: number;
	asset: string;
	amount?: number;
	amountFilled: number;
	minimumLimit: string;
	maximumLimit: string;
	price: number;
	status: string;
	createdAt?: string;
	closedAt?: string;
}

const MyAds = () => {
	const navigate = useNavigate();
	const [ads, setAds] = useState<Array<IAd>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);

	const userState: UserState = useSelector((state: any) => state.user);
	const user = userState.user;
	const userId = user?.userId;

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setLoading(true);

				const response = await GetAds({ userId });

				if (response && response.status && response.data) {
					if (Array.isArray(response.data) && response.data.length > 0) {
						setAds(response.data);
					} else {
						setAds([]);
					}
				} else if (response && response.data) {
					if (Array.isArray(response.data) && response.data.length > 0) {
						setAds(response.data);
					} else {
						setAds([]);
					}
				} else {
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

	const updateAdStatus = async (adId: string, newStatus: string) => {
		setUpdatingAdId(adId);

		try {
			const endpoint = `/api/v1/user/${userId}/ads/${adId}/update-ads-status`;

			const response = await Bisatsfetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: newStatus,
				}),
			});

			if (response.status) {
				setAds((prevAds) =>
					prevAds.map((ad) =>
						ad.id === adId ? { ...ad, status: newStatus } : ad
					)
				);
			} else {
				Toast.error(response.message || "Failed to update ad status","Failed");
			}
		} catch (err) {
			console.error("Error updating ad status:", err);
			Toast.error("Failed to update ad status. Please try again.","Failed");
		} finally {
			setUpdatingAdId(null);
		}
	};

	const handleStatusToggle = (ad: IAd) => {
		if (!ad.id) {
			console.error("Ad ID is missing");
			return;
		}

		const newStatus =
			ad.status.toLowerCase() === "active" ? "disabled" : "active";
		updateAdStatus(ad.id, newStatus);
	};

	const handleCloseAd = (adId: string) => {
		updateAdStatus(adId, "closed");
	};

	const activeAds = ads.filter((ad) => {
		const status = ad.status.toLowerCase();
		return status === "active" || status === "disabled" || status === "open";
	});

	const closedAds = ads.filter((ad) => {
		const status = ad.status.toLowerCase();
		return (
			status === "closed" ||
			status === "completed" ||
			status === "cancelled" ||
			status === "expired"
		);
	});

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US").format(price);
	};

	const getStatusInfo = (status: string) => {
		const statusLower = status.toLowerCase();
		if (statusLower === "active" || statusLower === "open") {
			return { text: "Active", color: "#17A34A" };
		} else if (statusLower === "disabled") {
			return { text: "Inactive", color: "#F59E0B" };
		} else {
			return { text: status, color: "#DC2625" };
		}
	};

	const MobileAdRow = ({
		ad,
		index,
		showToggle = true,
	}: {
		ad: IAd;
		index: number;
		showToggle?: boolean;
	}) => {
		const isToggleable =
			showToggle &&
			(ad.status.toLowerCase() === "active" ||
				ad.status.toLowerCase() === "disabled" ||
				ad.status.toLowerCase() === "open");

		const statusInfo = getStatusInfo(ad.status);

		return (
			<div
				className={`flex flex-col p-4 mb-6 ${
					index % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"
				}`}
			>
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

				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Price</span>
						<span>{formatPrice(ad.price)}</span>
					</div>
					{/* <div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							Price Type
						</span>
						<span className="capitalize">{ad.priceType}</span>
					</div> */}
				</div>

				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							Amount Filled
						</span>
						<span>{ad.amountFilled}</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Status</span>
						<div className="flex items-center space-x-2">
							<span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
							{isToggleable && (
								<>
									{updatingAdId === ad.id ? (
										<div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
									) : (
										<Switch
											checked={ad.status.toLowerCase() === "active"}
											onCheckedChange={() => handleStatusToggle(ad)}
											disabled={updatingAdId === ad.id}
											className="data-[state=checked]:bg-green-600"
										/>
									)}
								</>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-between items-end">
					<span style={{ color: "#515B6E", fontSize: "14px" }} className="mr-2">
						Action
					</span>
					<TableActionMenu
						adDetail={ad}
						onCloseAd={handleCloseAd}
						isUpdating={updatingAdId === ad.id}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="w-full max-w-[1024px] mx-auto px-3">
			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center space-y-2 bg-gray-100 mb-6 sm:mb-12">
				<Header
					text="My Ads"
					subtext="Create, view and manage your ads on Bisats here"
				/>

				<div>
					<KycManager
						action={ACTIONS.DEPOSIT_NGN}
						func={() => navigate("/p2p/ad/create")}
					>
						{(validateAndExecute) => (
							<PrimaryButton
								text="Create Ad"
								loading={false}
								onClick={validateAndExecute}
							/>
						)}
					</KycManager>
				</div>
			</div>

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
											<th className="text-left px-4 py-4">Minimum Price</th>
											<th className="text-left px-4 py-4">Maximum Price</th>
											<th className="text-right px-4 py-3">Amount Filled</th>
											<th className="text-right px-4 py-3">Status</th>
											<th className="text-right px-4 py-3">Action</th>
										</tr>
									</thead>
									<tbody>
										{activeAds.map((ad, index) => {
											const isToggleable =
												ad.status.toLowerCase() === "active" ||
												ad.status.toLowerCase() === "disabled" ||
												ad.status.toLowerCase() === "open";

											const statusInfo = getStatusInfo(ad.status);

											return (
												<tr key={ad.id || index}>
													<td className="text-left px-4 py-2 font-semibold">
														<span
															style={
																ad.type.toLowerCase() === "sell"
																	? { color: "#DC2625" }
																	: { color: "#17A34A" }
															}
														>
															{ad.type.charAt(0).toUpperCase() +
																ad.type.slice(1)}
														</span>
													</td>
													<td className="text-left px-4 py-2 font-semibold">
														{ad.asset}
													</td>
													<td className="text-left px-4 py-2">
														xNGN {formatPrice(ad.price)}
													</td>
													<td className="text-left px-4 py-2">
														xNGN { formatNumber(ad?.minimumLimit)}
													</td>
													<td className="text-left px-4 py-2">
														xNGN {formatNumber(ad?.maximumLimit)}
													</td>
													<td className="text-right px-4 py-2">
														{ad.type.toLowerCase() === "sell"?`${ad?.asset} ${formatCrypto(Number(ad.amountFilled))}`:`xNGN ${formatNumber(ad?.amountFilled)}`}
													</td>
													<td className="text-right px-4 py-3">
														<div className="flex items-center justify-end space-x-3">
															<span style={{ color: statusInfo.color }}>
																{statusInfo.text}
															</span>
															{isToggleable && (
																<>
																	{updatingAdId === ad.id ? (
																		<div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
																	) : (
																		<Switch
																			checked={
																				ad.status.toLowerCase() === "active"
																			}
																			onCheckedChange={() =>
																				handleStatusToggle(ad)
																			}
																			disabled={updatingAdId === ad.id}
																			className="data-[state=checked]:bg-green-600"
																		/>
																	)}
																</>
															)}
														</div>
													</td>
													<td className="text-right px-4 py-3 relative">
														<TableActionMenu
															adDetail={ad}
															onCloseAd={handleCloseAd}
															isUpdating={updatingAdId === ad.id}
														/>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							<div className="md:hidden">
								<div className="rounded overflow-hidden">
									{activeAds.map((ad, index) => (
										<MobileAdRow
											key={ad.id || index}
											ad={ad}
											index={index}
											showToggle={true}
										/>
									))}
								</div>
							</div>
						</>
					) : (
						<Empty />
					)}
				</div>
			</div>

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
												<th className="text-left px-4 py-4">Minimum Limit</th>
												<th className="text-left px-4 py-4">Maximum Limit</th>

											<th className="text-right px-4 py-3">Amount Filled</th>
											<th className="text-right px-4 py-3">Status</th>
											<th className="text-right px-4 py-3">Action</th>
										</tr>
									</thead>
									<tbody>
										{closedAds.map((ad, index) => {
											const statusInfo = getStatusInfo(ad.status);

											return (
												<tr key={ad.id || index}>
													<td className="text-left px-4 py-2 font-semibold">
														<span
															style={
																ad.type.toLowerCase() === "sell"
																	? { color: "#DC2625" }
																	: { color: "#17A34A" }
															}
														>
															{ad.type.charAt(0).toUpperCase() +
																ad.type.slice(1)}
														</span>
													</td>
													<td className="text-left px-4 py-2 font-semibold">
														{ad.asset}
													</td>
													<td className="text-left px-4 py-2">
														{formatPrice(ad.price)}
													</td>
													<td className="text-left px-4 py-2">
														xNGN {formatNumber(ad?.minimumLimit)}
													</td>
													<td className="text-left px-4 py-2">
														xNGN {formatNumber(ad?.maximumLimit)}
													</td>
													<td className="text-left px-4 py-2">
														{ad.type.toLowerCase() === "sell" ? `${ad?.asset} ${formatCrypto(Number(ad.amountFilled) )}` : `xNGN ${formatNumber(ad?.amountFilled)}`}
													</td>
													<td
														className="text-right px-4 py-3 capitalize"
														style={{ color: statusInfo.color }}
													>
														{statusInfo.text}
													</td>
													<td className="text-right px-4 py-3 relative">
														<TableActionMenu
															adDetail={ad}
															onCloseAd={handleCloseAd}
															isUpdating={updatingAdId === ad.id}
														/>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							<div className="md:hidden">
								<div className="rounded overflow-hidden">
									{closedAds.map((ad, index) => (
										<MobileAdRow
											key={ad.id || index}
											ad={ad}
											index={index}
											showToggle={false}
										/>
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
