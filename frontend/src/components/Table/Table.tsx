
import { formatNumber } from '../../utils/numberFormat';

interface TableProps {
	fields: Array<any>;
	data: Array<any>;
}

const Table: React.FC<TableProps> = ({ fields, data }) => {
    
	// Helper function to check field types regardless of case
	const isFieldType = (field: string, type: string): boolean => {
		return field.toLowerCase() === type.toLowerCase();
	};

	// Helper function to render field value with appropriate styling
    const renderFieldValue = (field: string, value: any, ) => {
		if (isFieldType(field, "Status")) {
			return (
				<span
					style={{
						color:
							value === "Pending"
								? "#D97708"
								: value === "Completed" || value === "active"
								? "#17A34A"
								: "#B91C1B",
					}}
				>
					{value}
				</span>
			);
		} else if (isFieldType(field, "Amount")) {
            return <span className="font-semibold">{value}</span>;
		} else if (isFieldType(field, "status")) {
			// Handle lowercase "status" field from ads data
			return (
				<span
					style={{
						color: value === "active" ? "#17A34A" : "#B91C1B",
					}}
				>
					{value}
				</span>
			);
		}
		return value;
	};

	// Standard table for sm screens and above
	const renderDesktopTable = () => (
		<table
			className="hidden lg:table table-auto w-full h-full"
			style={{ color: "#515B6E" }}
		>
			<thead className="text-justify">
				<tr>
					{fields.map((field, index) => (
						<th
							key={index}
							className={
								index + 1 > fields.length / 2
									? "text-right px-4 py-3 text-[14px]"
									: "text-left px-4 py-4 text-[14px]"
							}
							style={{ backgroundColor: "#F9F9FB" }}
						>
							{field}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, rowIndex) => (
					<tr
						key={rowIndex}
						style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }}
					>
						{fields.map((field, colIndex) => (
							<td
								key={colIndex}
								className={
									colIndex + 1 > fields.length / 2
										? "text-right font-semibold px-4 py-3 text-[14px]"
										: "text-left px-4 py-2 text-[14px]"
								}
                            >
								{field === "Amount" ?
									// renderFieldValue(field, row[field])
									row["Order Type"] === "Buy" ? `xNGN ${formatNumber(row["Amount"])}` : `${row?.Asset ?? "xNGN"} ${formatNumber(row["Amount"])}`

                                    // `${row?.Asset}${convertNairaToAsset(row?.Asset, row?.Amount, row?.Price)?.toFixed(2) }`
                                        // row["Order Type"] === "Buy" ? `xNGN ${row["Amount"]}` : `${row?.Asset}${convertNairaToAsset(row?.Asset, row?.Amount, row?.Price)}`
                                                                        
                                    :
									renderFieldValue(field, row[field])
								}

                                
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
    );
    

	// Mobile layout with stacked fields - organized in specific order
	const renderMobileTable = () => (
		<div className="lg:hidden w-full">
            {data.map((row, rowIndex) => (
                
				<div
					key={rowIndex}
					className="mb-4 p-3 rounded"
					style={
						rowIndex % 2 === 0
							? { backgroundColor: "#FFFFFF" }
							: { backgroundColor: "#F9F9FB" }
					}
				>
					{/* Top row: Order type/Order Type and Date & Time/Asset */}
					<div className="flex justify-between mb-3">
						{/* Order type field (always first) */}
						{fields.some(
							(f) =>
								isFieldType(f, "Order type") || isFieldType(f, "Order Type")
						) && (
							<div className="flex flex-col">
								<span className="text-[12px] text-gray-500 mb-1">
									{fields.find(
										(f) =>
											isFieldType(f, "Order type") ||
											isFieldType(f, "Order Type")
									)}
								</span>
								<span className="text-left text-[14px]">
									{
										row[
											fields.find(
												(f) =>
													isFieldType(f, "Order type") ||
													isFieldType(f, "Order Type")
											) || ""
										]
									}
								</span>
							</div>
						)}

						{/* Date & Time or Asset field (always second) */}
						{fields.some(
							(f) => isFieldType(f, "Date & Time") || isFieldType(f, "Asset")
						) && (
							<div className="flex flex-col">
								<span className="text-[12px] text-gray-500 mb-1 text-right">
									{fields.find(
										(f) =>
											isFieldType(f, "Date & Time") || isFieldType(f, "Asset")
									)}
								</span>
								<span className="text-right font-semibold text-[14px]">
									{
										row[
											fields.find(
												(f) =>
													isFieldType(f, "Date & Time") ||
													isFieldType(f, "Asset")
											) || ""
										]
									}
								</span>
							</div>
						)}
					</div>

					{/* Bottom row: Quantity/Price and Status/Amount */}
					<div className="flex justify-between">
						{/* Quantity or Price field (always third) */}
						{fields.some(
							(f) => isFieldType(f, "Quantity") || isFieldType(f, "Price")
						) && (
							<div className="flex flex-col">
								<span className="text-[12px] text-gray-500 mb-1">
									{fields.find(
										(f) => isFieldType(f, "Quantity") || isFieldType(f, "Price")
									)}
								</span>
								<span className="text-left text-[14px]">
									{
										row[
											fields.find(
												(f) =>
													isFieldType(f, "Quantity") || isFieldType(f, "Price")
											) || ""
										]
									}
								</span>
							</div>
						)}

						{/* Status or Amount field (always fourth) - prefer Status when both exist */}
						{(() => {
							// Check if Status field exists
							const statusField = fields.find((f) => isFieldType(f, "Status"));
							// If Status exists, display it
							if (statusField) {
								return (
									<div className="flex flex-col">
										<span className="text-[12px] text-gray-500 mb-1 text-right">
											{statusField}
										</span>
										<span className="text-right font-semibold text-[14px]">
                                            {renderFieldValue(statusField, row[statusField])}
										</span>
									</div>
								);
							}
							// Otherwise, check for Amount field
							else {
								const amountField = fields.find((f) =>
									isFieldType(f, "Amount")
								);
                                if (amountField) {
                                    console.log(amountField,row["Order Type"])
									return (
										<div className="flex flex-col">
											<span className="text-[12px] text-gray-500 mb-1 text-right">
												{amountField}
											</span>
                                            <span className="text-right font-semibold text-[14px]">
												{
													row["Order Type"] === "Buy" ? `xNGN ${formatNumber(row["Amount"])}` : `${row?.Asset ?? "xNGN"} ${formatNumber(row["Amount"])}`

                                                    // `${row?.Asset}${convertNairaToAsset(row?.Asset, row?.Amount, row?.Price)?.toFixed(2)}`

                                                    // row["Order Type"] === "Buy" ? `xNGN ${row["Amount"]}` : `${row?.Asset}${convertNairaToAsset(row?.Asset, row?.Amount, row?.Price)}`
                                                }

                                                {/* {renderFieldValue(amountField, row[amountField], )} */}
											</span>
										</div>
									);
								}
								return null;
							}
						})()}
					</div>
				</div>
			))}
		</div>
	);

	return (
		<div>
			{renderDesktopTable()}
			{renderMobileTable()}
		</div>
	);
};

export default Table;
