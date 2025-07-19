import React from "react";
import { PrimaryButton } from "../buttons/Buttons";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/app_route";
import { formatCrypto, formatNumber } from "../../utils/numberFormat";

interface TableProps {
	// fields: Array<any>;
	data: Array<any>;
	type: string;
}

const MobileP2PMP: React.FC<TableProps> = ({ data, type }) => {
	return (
		<div className="w-full ">
			{data?.map((row, rowIndex) => (
				<div
					style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }}
					className="p-2 w-full"
				>
					<div className="flex items-start justify-between py-4">
						<div className="space-x-2">
							<div className="flex items-center space-x-2">
								<div
									className={`rounded-full w-[32px] h-[32px] flex items-center justify-center font-semibold text-[14px] ${
										row.orderType === "buy"
											? "text-[#17A34A] bg-[#F5FEF8]"
											: "bg-[#FEF2F2] text-[#B91C1B]"
									}`}
								>
									{row.user.userName?.charAt(0)?.toUpperCase() || "?"}
								</div>
								<span className="text-[14px] font-semibold text-[#515B6E]">
									{row.user.userName}
								</span>
							</div>
							<div className="flex flex-col items-start mt-2 ">
								<span className="text-[#515B6E] text-[12px] font-semibold">
									Unit Price
								</span>
								<span className="text-[#515B6E] text-[12px] font-normal">
									{row?.orderType === "buy"
										? row?.amountAvailable
										: formatCrypto(
											Number(row?.amountAvailable) / Number(row?.price)
										  )}{" "}
									{row?.asset}
								</span>
							</div>
							<div className="flex flex-col items-start mt-2 ">
								<span className="text-[#515B6E] text-[12px] font-semibold">
									Available/Limits
								</span>
								<span className="text-[#515B6E] text-[12px] font-normal">
									{formatNumber(row?.minimumLimit)} -{" "}
									{formatNumber(row?.maximumLimit)} xNGN
								</span>
							</div>
						</div>

						<div className="flex flex-col items-end justify-between">
							<span className="text-[#515B6E] text-[14px] font-semibold text-end mb-3">
								₦ {formatNumber(row?.price)}
							</span>
							<Link
								to={
									row?.orderType === "buy"
										? APP_ROUTES.P2P.BUY
										: APP_ROUTES.P2P.SELL
								}
								state={{ adDetail: row }}
							>
								<PrimaryButton
									text={type}
									loading={false}
									css="text-[14px] px-[30px] py-px font-semibold"
								/>
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
export default MobileP2PMP;
