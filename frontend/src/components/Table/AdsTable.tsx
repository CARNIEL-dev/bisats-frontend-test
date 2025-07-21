import React from "react";
import Table from "./Table";
import { ArrowDown, ArrowUp } from "lucide-react";
import Empty from "../Empty";

export interface IAd {
  type: string;
  amount: number;
  price: number;
  asset: string;
}

interface AdsTableProps {
  ads: IAd[];
  onRowClick?: (ad: IAd) => void;
  className?: string;
}

const AdsTable: React.FC<AdsTableProps> = ({
  ads,
  onRowClick,
  className = "",
}) => {
  const headers = ["Order type", "Asset", "Price", "Amount"];

  const boldColumns = [0, 4];

  const renderCell = (ad: IAd, column: string) => {
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
          orderTypeConfig[ad["type"] as keyof typeof orderTypeConfig];

        if (!config) {
          return (
            <span className="text-[14px] text-[#515B6E] font-semibold">
              {ad.type}
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
            <span className="text-[14px] text-[#515B6E] font-semibold">
              {ad.type}
            </span>
          </div>
        );
      }
      case "Asset":
        return (
          <span className="text-[#515B6E] font-semibold text-[14px]">
            {ad.asset}
          </span>
        );
      case "Price":
        return (
          <span className="text-[#515B6E] font-semibold text-[14px]">
            ₦ {ad.price.toLocaleString()}
          </span>
        );
      case "Amount":
        return (
          <span className="text-[#515B6E] font-semibold text-[14px]">
            {ad.amount.toLocaleString()} NGN
          </span>
        );
      default:
        return null;
    }
  };

  const renderMobileCard = (ad: IAd) => (
    <div
      className="bg-[#F9F9FB] border border-[#F9F9FB] p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onRowClick && onRowClick(ad)}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="font-semibold text-[12px] text-[#515B6E]">Order type</p>
          <div className="flex items-center space-x-2">
            <div
              className={`${
                ad.type === "Buy" ? "bg-[#F5FEF8]" : "bg-[#FEF2F2]"
              } h-[24px] w-[24px] rounded-full flex items-center justify-center`}
            >
              {ad.type === "Buy" ? (
                <ArrowUp className="text-[#22C55D]" />
              ) : (
                <ArrowDown className="text-[#EF4444]" />
              )}
            </div>
            <span className="text-[14px] text-[#515B6E] font-semibold">
              {ad.type}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-[12px] text-[#515B6E] text-right">
            Asset
          </p>
          <span className="text-[14px] text-[#515B6E] font-normal text-right">
            {ad.asset}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="font-semibold text-[12px] text-[#515B6E]">Price</p>
          <span className="font-semibold text-[14px] text-[#2B313B]">
            ₦ {ad.price}
          </span>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-[12px] text-[#515B6E] text-right">
            Amount
          </p>
          <span className="font-semibold text-[14px] text-[#2B313B] text-right">
            {ad.amount.toLocaleString()} NGN
          </span>
        </div>
      </div>
    </div>
  );

  if (ads.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <Empty />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Table
        data={ads}
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

export default AdsTable;
