import Header from "../../components/Header";
import Balance from "./Balance";
import Assets from "./Assets";
import Transactions from "./Transaction";

const Wallet = () => {
	return (
		<div>
			<Header currentPage="Wallet" />
			<div className="flex sm:justify-center mt-[30px]">
				<div className="w-full sm:w-[65%]">
					<div className="flex m-[15px]">
						<Balance />
					</div>
					<div
						className="sm:border-[1px] sm:m-[16px] sm:p-6 p-4"
						style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
					>
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
									Your assets
								</span>
								<button
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
						<Assets />
					</div>
					<div
						className="sm:border-[1px] m-[16px] sm:p-[24px]"
						style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
					>
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
									Transaction History
								</span>
								<button
									style={{
										color: "#C49600",
										fontSize: "14px",
										fontWeight: "600",
									}}
								>
									view all
								</button>
							</p>
							<Transactions />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Wallet;
