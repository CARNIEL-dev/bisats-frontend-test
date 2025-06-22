import React, { useCallback, useEffect, useState } from "react";
import Empty from "../../components/Empty";
import Table from "../../components/Table/TransactionHistory";
import { MultiSelectDropDown } from "../../components/Inputs/MultiSelectInput";
import DateInput from "../../components/Inputs/DateInput";
import SearchInput from "../../components/Inputs/SearchInput";
import { useSelector } from "react-redux";
import { UserState } from "../../redux/reducers/userSlice";
import { GetWalletTransactions } from "../../redux/actions/walletActions";
import { formatDate } from "../../layouts/utils/Dates";
export enum Fields {
	Asset = "Asset",
	Network = "Network",
	Amount = "Amount",
	Type="Type",
	
	Reference = "Reference",
	Date = "Date",
	Status = "Status",
}

export interface ITransaction {
	Asset: string;
	Type: string;
	Date: string;
	Reference: string;
	Network: string;
	Amount: number;
	Status: string;
	txHash: string;
	bankDetails: {accountName:string,
		accountNumber:string,
		
		bankName:string
		}
}

const Transactions: React.FC = () => {
	const user = useSelector((state: { user: UserState }) => state.user);
	const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedAsset, setSelectedAsset] = useState<string>("");
		const [selectedType, setSelectedType] = useState<string>("");
		const [searchTerm, setSearchTerm] = useState("");
		const [selectedDate, setSelectedDate] = useState<string>("");
	const fields: Fields[] = [
		Fields.Asset,
		Fields.Network,
		Fields.Amount,
	
		Fields.Type,
		Fields.Date,
		Fields.Reference,
		Fields.Status,

	];

	const fetchUserTransactions = useCallback(async () => {
		const res = await GetWalletTransactions({
			userID: user?.user?.userId,
			reason: selectedType ?? "top-up",
			asset:selectedAsset,
			type: "",
			date: selectedDate,
			searchWord: searchTerm
		})
		console.log(res)
		if (res?.transactions) {
			console.log(transactions)
			setLoading(false)
			setTransactions(res?.transactions.map((trans: {
				paymentMethod: any; createdAt: string; asset: any; reason: any; reference: any; network: any; amount: any;
				status: any; txHash: string;bankDetails:any
}) => {
				// const tranDate = new Date(trans?.createdAt);
				// const transDate = new Date(
				// 	tranDate.getFullYear(),
				// 	tranDate.getMonth(),
				// 	tranDate.getDate()
				// );
				return (
					{
						Asset: trans.asset,
						Type: trans.reason,
						Date: formatDate(trans?.createdAt),
						Reference: trans.reference??"-",
						Network: trans.network??trans?.paymentMethod,
						Amount: trans?.amount,
						Status: trans.status,
						txHash: trans?.txHash,
						bankDetails: trans?.bankDetails

				
					})
			}))
		}
	},[searchTerm, selectedAsset, selectedDate, selectedType, user?.user?.userId]);

	useEffect(() => {
	fetchUserTransactions()
		}, [fetchUserTransactions, searchTerm, selectedDate, selectedType, user?.user?.userId]);

	const handleRetry = () => {
		fetchUserTransactions();
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-32">
				Loading transactions...
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

	const getUniqueAssets = () => {
		const uniqueAssets = ["USDT", "BTC", "ETH", "SOL","xNGN"]
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
			value: "withdrawal",
			label: "Withdrawal",
			labelDisplay: "Withdrawal",
		},
		{
			value: "top-up",
			label: "Deposit",
			labelDisplay: "Deposit",
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
	const handleAssetChange = (asset: string) => {
		setSelectedAsset(asset);
	};

	const handleTypeChange = (type: string) => {
		setSelectedType(type);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};


	return (
		<div>
			<div className="hidden md:block mb-6">
				<div className="flex flex-wrap items-end gap-4 py-5">
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
							placeholder="Search by reference"
							value={searchTerm}
							handleChange={handleSearchChange}
						/>
					</div>
					{/* <div className="w-48">
						<DateInput
							title="Filter by Date"
							name="Date"
							handleChange={handleDateChange}
						/>
					</div> */}
					{/* <div className="xl:w-40 lg:w-28 md:w-24">
						<MultiSelectDropDown
							title="Sort By"
							choices={getSortOptions()}
							handleChange={handleSortChange}
							error={null}
							touched={false}
						/>
					</div> */}
				</div>
			</div>
			{transactions?.length === 0 ? (
				<Empty />
			) : (
				<Table fields={fields} data={transactions} />
			)}
		</div>
	);
};

export default Transactions;
