import EditAd from "@/components/Modals/EditAdModal";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/app_route";

export interface IAd {
  id?: string;
  type: string;
  priceType: string;
  currency?: string;
  priceMargin: number;
  asset: string;
  amount?: number;
  amountAvailable?: number;
  amountFilled: number;
  price: number;
  status: string;
  createdAt?: string;
  closedAt?: string;
  expiryDate?: string;
  minimumLimit?: string;
  maximumLimit?: string;
  priceUpperLimit?: string;
  priceLowerLimit?: string;
}

interface TableActionMenuProps {
  adDetail: AdsTypes;
  onCloseAd: (adId: string) => void;
  isUpdating?: boolean;
}

const TableActionMenu = ({ adDetail, onCloseAd }: TableActionMenuProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseAd = () => {
    if (adDetail.id) {
      onCloseAd(adDetail.id);
    }
  };

  const isActiveAd = ["active", "disabled", "open"].includes(
    adDetail.status.toLowerCase()
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-gray-500">
          <DropdownMenuItem asChild>
            <Link to={APP_ROUTES.P2P.AD_DETAILS} state={{ adDetail }}>
              View full details
            </Link>
          </DropdownMenuItem>
          {isActiveAd && (
            <>
              <DropdownMenuItem onSelect={() => setShowEdit(true)}>
                Edit ad
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCloseAd}>
                Close ad
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showEdit && <EditAd close={() => setShowEdit(false)} ad={adDetail} />}
    </>
  );
};

export default TableActionMenu;
