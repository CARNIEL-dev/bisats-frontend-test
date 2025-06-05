import React from "react";
import Table from "./Table";
import { ArrowDown, ArrowUp } from "lucide-react";
import Empty from "../Empty";

export interface IOrder {
	"Order type": string;
	"Date & Time": string;
	Reference: string;
	Quantity: number;
	Amount: number;
	Status: string;
}

interface OrderTableProps {
	orders: IOrder[];
	onRowClick?: (order: IOrder) => void;
	className?: string;
}

const OrderTable: React.FC<OrderTableProps> = ({
	orders,
	onRowClick,
	className = "",
}) => {
	const headers: (keyof IOrder)[] = [
		"Order type",
		"Date & Time",
		"Reference",
		"Quantity",
		"Amount",
		"Status",
	];

	console.log("Rendering OrderTable with orders:", orders);

	const boldColumns = [0, 4];

	const formatDateTime = (dateTimeString: string) => {
		const date = new Date(dateTimeString);

		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = String(date.getFullYear()).slice(-2);
		const formattedDate = `${month}.${day}.${year}`;

		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const formattedTime = `${hours}.${minutes}`;

		return { formattedDate, formattedTime };
	};

	const renderStatusIndicator = (status: string) => {
		const statusConfig = {
			Completed: {
				textColor: "text-[#17A34A]",
				dotBgColor: "bg-[#DCFCE7]",
				dotColor: "bg-[#17A34A]",
			},
			Pending: {
				textColor: "text-[#D97708]",
				dotBgColor: "bg-[#FEF3C7]",
				dotColor: "bg-[#D97708]",
			},
			Canceled: {
				textColor: "text-[#B91C1B]",
				dotBgColor: "bg-[#FEE2E1]",
				dotColor: "bg-[#B91C1B]",
			},
		};

		const config = statusConfig[status as keyof typeof statusConfig];

		if (!config) {
			return (
				<div className="flex items-center space-x-2">
					<div className="w-2 h-2 rounded-full bg-gray-400"></div>
					<span className="text-[12px] font-[600] text-gray-600">{status}</span>
				</div>
			);
		}

		return (
			<div className="flex items-center space-x-2">
				<div
					className={`w-[12px] h-[12px] rounded-[3px] ${config.dotBgColor} flex items-center justify-center`}
				>
					<div
						className={`w-[4px] h-[4px] rounded-full ${config.dotColor}`}
					></div>
				</div>
				<span className={`${config.textColor} text-[12px] font-[600]`}>
					{status}
				</span>
			</div>
		);
	};

	const renderCell = (order: IOrder, column: string) => {
		switch (column) {
			case "Order type": {
				const orderTypeConfig = {
					Buy: {
						bgColor: "bg-[#F5FEF8]",
						iconColor: "text-[#22C55D]",
						icon: ArrowUp,
					},
					Sell: {
						bgColor: "bg-[#FEF2F2]",
						iconColor: "text-[#EF4444]",
						icon: ArrowDown,
					},
				};

				const config =
					orderTypeConfig[order["Order type"] as keyof typeof orderTypeConfig];

				if (!config) {
					return (
						<span className="text-[14px] text-[#515B6E] font-[600]">
							{order["Order type"]}
						</span>
					);
				}

				const IconComponent = config.icon;

				return (
					<div className="flex items-center space-x-2">
						<div
							className={`flex items-center justify-center ${config.bgColor} h-[28px] w-[28px] rounded-full`}
						>
							<IconComponent className={config.iconColor} />
						</div>
						<span className="text-[14px] text-[#515B6E] font-[600]">
							{order["Order type"]}
						</span>
					</div>
				);
			}
			case "Date & Time": {
				const { formattedDate, formattedTime } = formatDateTime(
					order["Date & Time"]
				);

				return (
					<div className="flex items-center space-x-[4px]">
						<span className="text-[#515B6E] font-[400] text-[14px]">
							{formattedDate}
						</span>
						<div className="bg-[#D6DAE1] h-[4px] w-[4px] rounded-full"></div>
						<span className="text-[#515B6E] font-[400] text-[14px]">
							{formattedTime}
						</span>
					</div>
				);
			}
			case "Reference":
				return (
					<span className="text-[#515B6E] font-[400] text-[14px]">
						{order.Reference}
					</span>
				);
			case "Quantity":
				return (
					<span className="text-[#515B6E] font-[600] text-[14px]">
						{order.Quantity.toLocaleString()}
					</span>
				);
			case "Amount":
				return (
					<span className="text-[#515B6E] font-[600] text-[14px]">
						{order.Amount.toLocaleString()} NGN
					</span>
				);
			case "Status":
				return renderStatusIndicator(order.Status);
			default:
				return null;
		}
	};

	const renderMobileCard = (order: IOrder) => {
		const { formattedDate, formattedTime } = formatDateTime(
			order["Date & Time"]
		);

		return (
			<div
				className="bg-[#F9F9FB] border border-[#F9F9FB] p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
				onClick={() => onRowClick && onRowClick(order)}
			>
				<div className="flex justify-between items-center">
					<div className="space-y-2">
						<p className="font-[600] text-[12px] text-[#515B6E]">Order type</p>
						<div className="flex items-center space-x-2">
							<div
								className={`${
									order["Order type"] === "Buy"
										? "bg-[#F5FEF8]"
										: "bg-[#FEF2F2]"
								} h-[24px] w-[24px] rounded-full flex items-center justify-center`}
							>
								{order["Order type"] === "Buy" ? (
									<ArrowUp className="text-[#22C55D]" />
								) : (
									<ArrowDown className="text-[#EF4444]" />
								)}
							</div>
							<span className="text-[14px] text-[#515B6E] font-[600]">
								{order["Order type"]}
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<p className="font-[600] text-[12px] text-[#515B6E] text-right">
							Date & Time
						</p>
						<div className="flex items-center space-x-[4px] justify-end">
							<span className="text-[#515B6E] font-[400] text-[14px] text-right">
								{formattedDate}
							</span>
							<div className="bg-[#D6DAE1] h-[4px] w-[4px] rounded-full"></div>
							<span className="text-[#515B6E] font-[400] text-[14px] text-right">
								{formattedTime}
							</span>
						</div>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<div className="space-y-2">
						<p className="font-[600] text-[12px] text-[#515B6E]">Qty</p>
						<span className="font-[600] text-[14px] text-[#2B313B]">
							{order.Quantity.toLocaleString()}
						</span>
					</div>
					<div className="space-y-2">
						<p className="font-[600] text-[12px] text-[#515B6E] text-right">
							Status
						</p>
						<div className="flex justify-end">
							{renderStatusIndicator(order.Status)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	if (orders.length === 0) {
		return (
			<div className={`w-full ${className}`}>
				<Empty />
			</div>
		);
	}

	return (
		<div className={`w-full ${className}`}>
			<Table
				data={orders}
				headers={headers}
				renderCell={renderCell}
				onRowClick={onRowClick}
				boldColumns={boldColumns}
				customRowHeight="h-12"
				renderMobileCard={renderMobileCard}
			/>
		</div>
	);
};

export default OrderTable;
