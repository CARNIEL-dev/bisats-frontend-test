import React, { useEffect, useState } from "react";
import Empty from "../../components/Empty";
import { getUser } from "../../helpers";
import Bisatsfetch from "../../redux/fetchWrapper";
import Table from "../../components/Table/TransactionHistory";

export enum Fields {
	TransactionType = "Trx type",
	Assets = "Assets",
	Amount = "Amount",
	Reference = "Reference",
	Date = "Date & Time",
	Status = "Status",
}

export interface ITransaction {
	"Trx type": string;
	"Date & Time": string;
	Reference: string;
	Assets: string;
	Amount: number;
	Status: string;
}

const Transactions: React.FC = () => {
	const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const fields: Fields[] = [
		Fields.TransactionType,
		Fields.Assets,
		Fields.Amount,
		Fields.Date,
		Fields.Reference,
		Fields.Status,
	];

	useEffect(() => {
		fetchUserTransactions();
	}, []);

	const fetchUserTransactions = async () => {
		console.log("Fetching Transactions...");
		try {
			setLoading(true);
			setError(null);

			const user = getUser();
			if (!user || !user.userId) {
				console.error("User data not found or userId is missing");
				setError("User authentication issue. Please log in again.");
				setLoading(false);
				return;
			}

			const response = await Bisatsfetch(
				`/api/v1/user/${user.userId}/order/fetch-user-orders`,
				{
					method: "GET",
				}
			);

			// Handle the response
			console.log("Orders API response:", response);
			if (response) {
				if (response.message === "No orders found") {
					setTransactions([]);
				} else if (response.statusCode === 200 && response.data) {
					const ordersData = response.data || [];

					const transformedTransactions: ITransaction[] = Array.isArray(
						ordersData
					)
						? ordersData.map((order: any) => {
								const orderDate = new Date(order.createdAt);
								const formattedDate = orderDate
									.toLocaleString("en-US", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										hour12: false,
									})
									.replace(",", "");

								return {
									"Trx type": order.type
										? order.type.charAt(0).toUpperCase() + order.type.slice(1)
										: "Unknown",
									"Date & Time": formattedDate,
									Reference: order.reference || "N/A",
									Assets: order.asset || "Unknown",
									Amount: order.amount || 0,
									Status: order.status
										? order.status.charAt(0).toUpperCase() +
										  order.status.slice(1)
										: "Unknown",
								};
						  })
						: [];

					console.log("Transformed transactions:", transformedTransactions);
					setTransactions(transformedTransactions);
				} else if (response.message !== "No orders found") {
					console.error("API returned error status:", response);
					setError(`Error: ${response?.message || "Failed to load orders"}`);
				}
			} else {
				setError("Failed to receive API response");
			}
		} catch (err) {
			console.error("Error fetching orders:", err);
			const errorMessage =
				err instanceof Error ? err.message : "An unknown error occurred";
			setError(`Failed to load orders data: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	const handleRetry = () => {
		fetchUserTransactions();
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				Loading orders...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-32">
				<div className="text-red-500 text-center mb-4">{error}</div>
				<button
					onClick={handleRetry}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div>
			{transactions.length === 0 ? (
				<Empty />
			) : (
				<Table fields={fields} data={transactions} />
			)}
		</div>
	);
};

export default Transactions;
