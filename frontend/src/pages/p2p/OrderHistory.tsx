import { useEffect, useState, useCallback, useMemo } from "react";
import DateInput from "../../components/Inputs/DateInput";
import { MultiSelectDropDown } from "../../components/Inputs/MultiSelectInput";
import SearchInput from "../../components/Inputs/SearchInput";
import { BACKEND_URLS } from "../../utils/backendUrls";
import Bisatsfetch from "../../redux/fetchWrapper";
import Toast from "../../components/Toast";
import { UserState } from "../../redux/reducers/userSlice";
import { useSelector } from "react-redux";
import Empty from "../../components/Empty";

const OrderHistory = () => {
	interface Order {
		type: string;
		reference: string;
		asset: string;
		amount: number;
		price: number;
		quantity: number;
		createdAt: string;
		merchant?: { userName: string };
		buyer?: { userName: string };
	}

	const [loading, setLoading] = useState(true);
	const userState: UserState = useSelector((state: any) => state.user);
	const user = userState.user;
	const userId = user?.userId;
	const [orders, setOrders] = useState<Order[]>([]);

	// Fixed filter states - using single values like P2pOrdersTable
	const [selectedAsset, setSelectedAsset] = useState<string>("");
	const [selectedType, setSelectedType] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>("");

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			const response = await Bisatsfetch(
				`/api/v1/user/${userId}${BACKEND_URLS.P2P.ADS.FETCH_ORDERS}`,
				{
					method: "GET",
				}
			);
			console.log("orders history", response);

			if (
				response.status === true &&
				response.data &&
				Array.isArray(response.data)
			) {
				setOrders(response.data);
			} else {
				setOrders([]);
			}
		} catch (error) {
			console.error("Error fetching orders:", error);
			Toast.error("Failed to fetch orders. Please try again later.", "Error");
			setOrders([]);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	// Fixed filtering logic similar to P2pOrdersTable
	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			// Search filter
			const matchesSearch =
				searchTerm === "" ||
				order.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(order.type?.toLowerCase() === "buy"
					? order.merchant?.userName
							?.toLowerCase()
							.includes(searchTerm.toLowerCase())
					: order.buyer?.userName
							?.toLowerCase()
							.includes(searchTerm.toLowerCase()));

			// Date filter
			let matchesDate = true;
			if (selectedDate) {
				const orderDate = new Date(order.createdAt);
				const selectedDateObj = new Date(selectedDate);

				const orderDateOnly = new Date(
					orderDate.getFullYear(),
					orderDate.getMonth(),
					orderDate.getDate()
				);
				const selectedDateOnly = new Date(
					selectedDateObj.getFullYear(),
					selectedDateObj.getMonth(),
					selectedDateObj.getDate()
				);

				matchesDate = orderDateOnly.getTime() === selectedDateOnly.getTime();
			}

			// Asset filter
			const matchesAsset =
				selectedAsset === "" || order.asset === selectedAsset;

			// Type filter
			const matchesType =
				selectedType === "" ||
				order.type?.toLowerCase() === selectedType.toLowerCase();

			return matchesSearch && matchesDate && matchesAsset && matchesType;
		});
	}, [orders, searchTerm, selectedDate, selectedAsset, selectedType]);

	// Apply sorting to filtered results
	const sortedAndFilteredOrders = useMemo(() => {
		if (!sortBy) return filteredOrders;

		return [...filteredOrders].sort((a, b) => {
			switch (sortBy) {
				case "price":
					return (b.price || 0) - (a.price || 0);
				case "date":
					const dateA = new Date(a.createdAt || 0);
					const dateB = new Date(b.createdAt || 0);
					return dateB.getTime() - dateA.getTime();
				default:
					return 0;
			}
		});
	}, [filteredOrders, sortBy]);

	useEffect(() => {
		if (userId) {
			fetchOrders();
		}
	}, [userId, fetchOrders]);

	// Generate dynamic asset options based on available orders - fixed format
	const getUniqueAssets = () => {
		const uniqueAssets = Array.from(
			new Set(orders.map((order) => order.asset).filter(Boolean))
		);
		return [
			{
				value: "",
				label: "All",
				labelDisplay: "All",
			},
			...uniqueAssets.map((asset) => ({
				value: asset,
				label: asset,
				labelDisplay: asset,
			})),
		];
	};

	// Fixed type options format
	const getTypeOptions = () => [
		{
			value: "",
			label: "All",
			labelDisplay: "All",
		},
		{
			value: "buy",
			label: "Buy",
			labelDisplay: "Buy",
		},
		{
			value: "sell",
			label: "Sell",
			labelDisplay: "Sell",
		},
	];

	// Fixed sort options format
	const getSortOptions = () => [
		{
			value: "",
			label: "None",
			labelDisplay: "None",
		},
		{
			value: "price",
			label: "Price",
			labelDisplay: "Price",
		},
		{
			value: "date",
			label: "Date",
			labelDisplay: "Date",
		},
	];

	// Fixed handler functions - single value handlers like P2pOrdersTable
	const handleAssetChange = (asset: string) => {
		setSelectedAsset(asset);
	};

	const handleTypeChange = (type: string) => {
		setSelectedType(type);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(e.target.value);
	};

	const handleSortChange = (sort: string) => {
		setSortBy(sort);
	};

	const MobileOrderRow = ({
		order,
		index,
	}: {
		order: Order;
		index: number;
	}) => {
		const formattedDate = order.createdAt
			? new Date(order.createdAt).toLocaleString("en-US", {
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
			  })
			: "N/A";

		const counterParty =
			order.type?.toLowerCase() === "buy"
				? order.merchant?.userName
				: order.buyer?.userName;

		return (
			<div
				className={`flex flex-col p-4 ${
					index % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"
				}`}
			>
				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Type</span>
						<span
							className="font-semibold"
							style={
								order.type?.toLowerCase() === "buy"
									? { color: "#DC2625" }
									: { color: "#17A34A" }
							}
						>
							{order.type?.charAt(0).toUpperCase() +
								order.type?.slice(1).toLowerCase() || "N/A"}
						</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							Order ref.
						</span>
						<span className="font-semibold">{order.reference || "N/A"}</span>
					</div>
				</div>

				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Asset</span>
						<span>{order.asset || "N/A"}</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Amount</span>
						<span>
							{order.amount
								? `${order.amount.toLocaleString()} ${order.asset}`
								: "N/A"}
						</span>
					</div>
				</div>

				<div className="flex justify-between mb-3">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Price</span>
						<span>
							{order.price ? `${order.price.toLocaleString()} NGN` : "N/A"}
						</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Quantity</span>
						<span>
							{order.quantity ? `${order.quantity} ${order.asset}` : "N/A"}
						</span>
					</div>
				</div>

				<div className="flex justify-between">
					<div className="flex flex-col">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>
							CounterParty
						</span>
						<span>{counterParty || "N/A"}</span>
					</div>
					<div className="flex flex-col items-end">
						<span style={{ color: "#515B6E", fontSize: "14px" }}>Date</span>
						<span>{formattedDate}</span>
					</div>
				</div>
			</div>
		);
	};

	const renderOrdersTable = () => {
		return (
			<>
				<div className="hidden md:block">
					<table className="table-auto w-full text-[#515B6E] text-sm">
						<thead className="text-justify">
							<tr style={{ backgroundColor: "#F9F9FB" }}>
								<th className="text-left px-4 py-4">Type</th>
								<th className="text-left px-4 py-4">Order ref.</th>
								<th className="text-left px-4 py-4">Asset</th>
								<th className="text-left px-4 py-4">Amount</th>
								<th className="text-right px-4 py-4">Price</th>
								<th className="text-right px-4 py-4">Quantity</th>
								<th className="text-right px-4 py-3">CounterParty</th>
								<th className="text-right px-4 py-3">Date</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan={8} className="text-center py-8 text-gray-500">
										Loading orders...
									</td>
								</tr>
							) : (
								sortedAndFilteredOrders.map((order, index) => {
									const formattedDate = order.createdAt
										? new Date(order.createdAt).toLocaleString("en-US", {
												month: "2-digit",
												day: "2-digit",
												hour: "2-digit",
												minute: "2-digit",
												hour12: false,
										  })
										: "N/A";

									const counterParty =
										order.type?.toLowerCase() === "buy"
											? order.merchant?.userName
											: order.buyer?.userName;

									return (
										<tr
											key={index}
											className={index % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"}
										>
											<td className="text-left px-4 py-4 font-semibold">
												<span
													style={
														order.type?.toLowerCase() === "buy"
															? { color: "#DC2625" }
															: { color: "#17A34A" }
													}
												>
													{order.type?.charAt(0).toUpperCase() +
														order.type?.slice(1).toLowerCase() || "N/A"}
												</span>
											</td>
											<td className="text-left px-4 py-4 font-semibold">
												{order.reference || "N/A"}
											</td>
											<td className="text-left px-4 py-4">
												{order.asset || "N/A"}
											</td>
											<td className="text-left px-4 py-4">
												{order.amount
													? `${order.amount.toLocaleString()} ${order.asset}`
													: "N/A"}
											</td>
											<td className="text-right px-4 py-4">
												{order.price
													? `${order.price.toLocaleString()} NGN`
													: "N/A"}
											</td>
											<td className="text-right px-4 py-4">
												{order.quantity
													? `${order.quantity} ${order.asset}`
													: "N/A"}
											</td>
											<td className="text-right px-4 py-4">
												{counterParty || "N/A"}
											</td>
											<td className="text-right px-4 py-4">{formattedDate}</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				<div className="md:hidden">
					{loading ? (
						<div className="flex justify-center items-center h-40">
							<p className="text-gray-500">Loading orders...</p>
						</div>
					) : sortedAndFilteredOrders.length > 0 ? (
						<div className="rounded overflow-hidden">
							{sortedAndFilteredOrders.map((order, index) => (
								<MobileOrderRow key={index} order={order} index={index} />
							))}
						</div>
					) : (
						<Empty />
					)}
				</div>
			</>
		);
	};

	return (
		<div className="w-full max-w-[1024px] mx-auto px-4">
			<div className="mb-6">
				<h2
					className="font-semibold"
					style={{ color: "#0A0E12", fontSize: "22px" }}
				>
					Order History
				</h2>
			</div>

			<div className="hidden md:block mb-6">
				<div className="flex flex-wrap items-end gap-4">
					<div className="xl:w-40 lg:w-28 md:w-24">
						<MultiSelectDropDown
							title="All"
							choices={getUniqueAssets()}
							handleChange={handleAssetChange}
							label="Assets"
							error={null}
							touched={false}
						/>
					</div>
					<div className="xl:w-40 lg:w-28 md:w-24">
						<MultiSelectDropDown
							title="All"
							choices={getTypeOptions()}
							handleChange={handleTypeChange}
							label="Type"
							error={null}
							touched={false}
						/>
					</div>
					<div className="xl:w-80 lg:w-72 md:w-64">
						<SearchInput
							placeholder="Search by ref. or counterparty"
							value={searchTerm}
							handleChange={handleSearchChange}
						/>
					</div>
					<div className="w-48">
						<DateInput
							title="Filter by Date"
							name="Date"
							handleChange={handleDateChange}
						/>
					</div>
					<div className="xl:w-40 lg:w-28 md:w-24">
						<MultiSelectDropDown
							title="Sort By"
							choices={getSortOptions()}
							handleChange={handleSortChange}
							error={null}
							touched={false}
						/>
					</div>
				</div>
			</div>

			<div className="md:hidden mb-4">
				<button className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-md">
					<span className="font-medium">Filters</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</button>
			</div>

			{!loading && sortedAndFilteredOrders.length < 1 ? (
				<Empty />
			) : (
				renderOrdersTable()
			)}
		</div>
	);
};

export default OrderHistory;
