import React from "react";
import P2PMPTable from "../../../components/Table/P2PMarketPlaceTable";
import MobileP2PMP from "../../../components/Table/MobileP2PMarketPlace";
import Empty from "../../../components/Empty";
import { AdSchema } from "./ExpressSwap";
import Pagination from "../../../components/pagination";

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
  page: number;
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

      <Pagination
        currentPage={0}
        totalPages={0}
        onPageChange={() => {
          setPagination({
            limit: 10,
            skip: (pagination.page - 1) * 10,
            page: pagination?.page + 1,
          });
        }}
      />
    </div>
  );
};

export default MarketPlaceContent;
