import React from "react";

interface TableProps<T = any> {
	data: T[];
	headers: string[];
	renderCell: (item: T, column: string, index?: number) => React.ReactNode;
	onRowClick?: (item: T) => void;
	boldColumns?: number[];
	className?: string;
	customRowHeight?: string;
	hideOnMobile?: boolean;
	renderMobileCard?: (item: T, index: number) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({
	data,
	headers,
	renderCell,
	onRowClick,
	boldColumns = [],
	className = "",
	customRowHeight = "h-14",
	hideOnMobile = false,
	renderMobileCard,
}) => {
	const desktopTableClasses = hideOnMobile ? "block" : "hidden lg:block";
	const mobileClasses = renderMobileCard ? "lg:hidden" : "block lg:hidden";

	// If no data, return early - let the parent component handle empty states
	if (!data || data.length === 0) {
		return <div className={`w-full ${className}`}></div>;
	}

	return (
		<div className={`w-full ${className}`}>
			{/* Desktop Table */}
			<div className={desktopTableClasses}>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-[#F3F4F6]">
								{headers.map((header, index) => (
									<th
										key={header}
										className="text-left py-3 px-4 text-[#515B6E] text-[12px] md:text-[14px] font-semibold"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((item, rowIndex) => (
								<tr
									key={rowIndex}
									className={`${customRowHeight} border-b border-[#F3F4F6] hover:bg-gray-50 transition-colors ${
										onRowClick ? "cursor-pointer" : ""
									}`}
									onClick={() => onRowClick && onRowClick(item)}
								>
									{headers.map((header, colIndex) => (
										<td
											key={`${rowIndex}-${colIndex}`}
											className={`px-4 py-2 text-[14px] ${
												boldColumns.includes(colIndex)
													? "font-semibold text-[#0A0E12]"
													: "font-normal text-[#515B6E]"
											}`}
										>
											{renderCell(item, header, rowIndex)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Mobile Cards */}
			{renderMobileCard && (
				<div className={`${mobileClasses} w-full space-y-4`}>
					{data.map((item, index) => renderMobileCard(item, index))}
				</div>
			)}

			{/* Fallback Mobile Table (if no custom mobile card provided) */}
			{!renderMobileCard && !hideOnMobile && (
				<div className="block lg:hidden overflow-x-auto">
					<table className="w-full border-collapse min-w-[600px]">
						<thead>
							<tr className="border-b border-[#F3F4F6]">
								{headers.map((header, index) => (
									<th
										key={header}
										className="text-left py-3 px-4 text-[#515B6E] text-[12px] font-semibold uppercase tracking-wider"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((item, rowIndex) => (
								<tr
									key={rowIndex}
									className={`${customRowHeight} border-b border-[#F3F4F6] hover:bg-gray-50 transition-colors ${
										onRowClick ? "cursor-pointer" : ""
									}`}
									onClick={() => onRowClick && onRowClick(item)}
								>
									{headers.map((header, colIndex) => (
										<td
											key={`${rowIndex}-${colIndex}`}
											className={`px-4 py-2 text-[14px] ${
												boldColumns.includes(colIndex)
													? "font-semibold text-[#0A0E12]"
													: "font-normal text-[#515B6E]"
											}`}
										>
											{renderCell(item, header, rowIndex)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Table;
