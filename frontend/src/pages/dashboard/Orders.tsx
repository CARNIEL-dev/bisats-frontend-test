import React, { useState, useEffect } from "react";
import Table from "../../components/Table/Table";
import Empty from "../../components/Empty";
import { getUser } from "../../helpers";
import Bisatsfetch from "../../redux/fetchWrapper";

export enum Fields {
	OrderType = "Order type",
	Date = "Date & Time",
	Reference = "Reference",
	Quantity = "Quantity",
	Amount = "Amount",
	Status = "Status",
}

export interface IOrder {
	"Order type": string;
	"Date & Time": string;
	Reference: string;
	Quantity: number;
	Amount: number;
	Status: string;
}

const Orders: React.FC = () => {
	const fields: Fields[] = [
		Fields.OrderType,
		Fields.Date,
		Fields.Reference,
		Fields.Quantity,
		Fields.Amount,
		Fields.Status,
	];
	const [orders, setOrders] = useState<Array<IOrder>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserOrders();
	}, []);

	const fetchUserOrders = async () => {
		console.log("Fetching orders...");
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
					setOrders([]);
				} else if (response.statusCode === 200 && response.data) {
					const ordersData = response.data || [];

					const transformedOrders: IOrder[] = Array.isArray(ordersData)
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
									"Order type": order.type
										? order.type.charAt(0).toUpperCase() + order.type.slice(1)
										: "Unknown",
									"Date & Time": formattedDate,
									Reference: order.reference || "N/A",
									Quantity: order.quantity || 0,
									Amount: order.amount || 0,
									Status: order.status
										? order.status.charAt(0).toUpperCase() +
										  order.status.slice(1)
										: "Unknown",
								};
						  })
						: [];
					setOrders(transformedOrders.slice(0, 4));
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
		fetchUserOrders();
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

	// If we get here, we've fetched data successfully but it might be empty
	return (
		<div>
			{orders.length === 0 ? (
				<Empty />
			) : (
				<Table fields={fields} data={orders} />
			)}
		</div>
	);
};

export default Orders;
