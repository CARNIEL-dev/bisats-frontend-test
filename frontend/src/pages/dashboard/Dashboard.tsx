import Header from "../../components/Header";
import Balance from "./Balance";
import MarketRate from "./MarketRate";
import Ads from "./Ads";
import Orders from "./Orders";
import { useEffect, useState } from "react";
import KycBanner from "../../components/KycBanner";
import { useSelector } from "react-redux";
import { UserState } from "../../redux/reducers/userSlice";
import SecurityVerification from "../../components/Modals/SecurityVerification";
import { GetWallet } from "../../redux/actions/walletActions";
import { APP_ROUTES } from "../../constants/app_route";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/Footer";

const Dashboard = () => {
	const [openKycModal, setKycModalOpen] = useState(false);
	const userState: UserState = useSelector((state: any) => state.user);
	const user = userState.user;
	const navigate = useNavigate();

	useEffect(() => {
		GetWallet();
	}, []);

	useEffect(() => {
		const kyscStatus = user?.kyc;
		if (
			!kyscStatus?.identificationVerified ||
			!kyscStatus?.personalInformationVerified ||
			!user?.phoneNumberVerified
		) {
			setKycModalOpen(true);
		}
		// GetKYCStatus({ userId: user?.userId })
	}, []);

	const handleViewAllAds = () => {
		navigate(APP_ROUTES.P2P.MY_ADS);
	};

	const handleViewAllOrders = () => {
		navigate(APP_ROUTES.P2P.ORDER_HISTORY);
	};

	return (
		<div>
			<Header currentPage="Dashboard" />
			<div className="w-full md:w-[70%] mx-auto lg:pt-5">
				<div>{openKycModal && <KycBanner />}</div>
				<div className="w-full flex justify-center mt-[30px]">
					<div className="w-full">
						<h2
							className="text-[22px] md:text-[34px] mx-[15px] font-semibold"
							style={{ color: "#0A0E12" }}
						>
							Hello, {user?.firstName}
						</h2>

						<div className="w-full overflow-x-auto md:overflow-visible">
							<div className="flex w-max sm:w-full m-4 gap-4 sm:justify-between">
								<div className="w-3/4 sm:w-1/2 flex-shrink-0">
									<Balance />
								</div>

								<div className="w-3/4 sm:w-1/2 flex-shrink-0">
									<MarketRate />
								</div>
							</div>
						</div>

						<div
							className="sm:border-[1px] m-[15px] sm:p-[24px]"
							style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
						>
							<div className="mb-[12px]">
								<p style={{ fontSize: "15px" }}>
									<span
										style={{
											fontWeight: "600",
											color: "#0A0E12",
										}}
										className="mr-[8px] text-[18px] sm:text-[16px]"
									>
										Open ads
									</span>
									<button
										onClick={handleViewAllAds}
										style={{
											color: "#C49600",
											fontSize: "14px",
											fontWeight: "600",
										}}
									>
										view all
									</button>
								</p>
							</div>
							<Ads />
						</div>
						<div
							className="sm:border-[1px] m-[15px] sm:p-[24px]"
							style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
						>
							<div className="mb-[12px]">
								<p>
									<span
										style={{
											fontWeight: "600",
											color: "#0A0E12",
										}}
										className="mr-[8px] text-[18px] sm:text-[16px]"
									>
										Order History
									</span>
									<button
										onClick={handleViewAllOrders}
										style={{
											color: "#C49600",
											fontSize: "14px",
											fontWeight: "600",
										}}
									>
										view all
									</button>
								</p>
							</div>
							<Orders />
						</div>
					</div>
				</div>
			</div>
			<Footer/>
		</div>
	);
};
export default Dashboard;
