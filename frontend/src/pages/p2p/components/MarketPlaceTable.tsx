import React from "react";
import P2PMPTable from "../../../components/Table/P2PMarketPlaceTable";
import MobileP2PMP from "../../../components/Table/MobileP2PMarketPlace";
import Empty from "../../../components/Empty";
import { AdSchema } from "./ExpressSwap";

type limits = {
	available: string;
	limits: string;
};

export interface Ad {
	Merchant: string;
	"Unit Price": string;
	Limits: limits;
}

interface PaginationProps {
	limit: number;
	skip: number;
}

interface MarketPlaceContentProps {
	type: string;
	ads: AdSchema[];
	pagination: PaginationProps;
	setPagination: React.Dispatch<React.SetStateAction<PaginationProps>>;
}

const MarketPlaceContent = ({
	type,
	ads,
	pagination,
	setPagination,
}: MarketPlaceContentProps) => {
	const Fields = {
		Merchant: "Merchant",
		UnitPrice: "Unit Price",
		Limits: "Available/Limits",
	} as const;

	type FieldKeys = keyof typeof Fields;
	type FieldValues = (typeof Fields)[FieldKeys];

	const fields: FieldValues[] = [
		Fields.Merchant,
		Fields.UnitPrice,
		Fields.Limits,
	];
console.log(ads)
	return (
		<div className="w-full">
			{ads.length === 0 ? (
				<Empty />
			) : (
				<div className="w-full">
					<div className="hidden md:flex">
						<P2PMPTable fields={fields} data={ads} type={type} />
					</div>
					<div className="md:hidden  w-full">
						<MobileP2PMP data={ads} type={type} />
					</div>
				</div>
			)}
		</div>
	);
};

export default MarketPlaceContent;
