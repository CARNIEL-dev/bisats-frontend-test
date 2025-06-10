import React from "react";
import { formatNumber } from "../../utils/numberFormat";

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
	const renderFieldValue = (field: string, value: any) => {
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

	// Standard table for desktop screens
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
								{renderFieldValue(field, row[field])}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);

	// Redesigned mobile layout with three specific rows
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
					{/* Row 1: Trx type and Date & Time */}
					<div className="flex justify-between mb-3 w-full">
						{/* Trx type field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1">
								{fields.find((f) => isFieldType(f, "Trx type")) || "Trx type"}
							</span>
							<span className="text-left text-[14px]">
								{row[fields.find((f) => isFieldType(f, "Trx type")) || ""]}
							</span>
						</div>

						{/* Date & Time field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1 text-right">
								{fields.find((f) => isFieldType(f, "Date & Time")) ||
									"Date & Time"}
							</span>
							<span className="text-right text-[14px]">
								{row[fields.find((f) => isFieldType(f, "Date & Time")) || ""]}
							</span>
						</div>
					</div>

					{/* Row 2: Amount and Asset */}
					<div className="flex justify-between mb-3 w-full">
						{/* Amount field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1">
								{fields.find((f) => isFieldType(f, "Amount")) || "Amount"}
							</span>
							<span className="text-left font-semibold text-[14px]">
								{( renderFieldValue(
									fields.find((f) => isFieldType(f, "Amount")) || "",
									formatNumber(row[fields.find((f) => isFieldType(f, "Amount")) || ""])
								))}
							</span>
						</div>

						{/* Asset field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1 text-right">
								{fields.find(
									(f) => isFieldType(f, "Assets") || isFieldType(f, "Asset")
								) || "Asset"}
							</span>
							<span className="text-right text-[14px]">
								{
									row[
										fields.find(
											(f) => isFieldType(f, "Assets") || isFieldType(f, "Asset")
										) || ""
									]
								}
							</span>
						</div>
					</div>

					{/* Row 3: Status and Reference */}
					<div className="flex justify-between w-full">
						{/* Status field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1">
								{fields.find((f) => isFieldType(f, "Status")) || "Status"}
							</span>
							<span className="text-left text-[14px]">
								{renderFieldValue(
									fields.find((f) => isFieldType(f, "Status")) || "",
									row[fields.find((f) => isFieldType(f, "Status")) || ""]
								)}
							</span>
						</div>

						{/* Reference field */}
						<div className="flex flex-col">
							<span className="text-[12px] text-gray-500 mb-1 text-right">
								{fields.find((f) => isFieldType(f, "Reference")) || "Reference"}
							</span>
							<span className="text-right text-[14px]">
								{row[fields.find((f) => isFieldType(f, "Reference")) || ""]}
							</span>
						</div>
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
