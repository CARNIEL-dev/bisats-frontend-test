import  { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import EditAd from "./EditAdModal";

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
  minimumLimit?: string,
  maximumLimit?: string,
  priceUpperLimit?:string ,
  priceLowerLimit?: string,
}

interface TableActionMenuProps {
	adDetail: IAd;
	onCloseAd: (adId: string) => void;
	isUpdating?: boolean;
}

const TableActionMenu = ({
	adDetail,
	onCloseAd,
	isUpdating = false,
}: TableActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  
	const buttonRef = useRef(null);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleCloseAd = () => {
		if (adDetail.id) {
			onCloseAd(adDetail.id);
			setIsOpen(false);
		}
	};

	const handleRepeatAd = () => {
		// TODO: Implement repeat ad functionality
		console.log("Repeat ad:", adDetail);
		setIsOpen(false);
	};

	const isActiveAd = ["active", "disabled", "open"].includes(
		adDetail.status.toLowerCase()
	);

	const isClosedAd = ["closed", "completed", "cancelled", "expired"].includes(
		adDetail.status.toLowerCase()
	);

	return (
		<>
			<button
				ref={buttonRef}
				className="p-2 text-gray-600 hover:text-black"
				onClick={handleClick}
				disabled={isUpdating}
			>
				<MoreVertical size={16} />
			</button>

			{isOpen && (
				<>
					<div className="fixed inset-0" onClick={() => setIsOpen(false)} />
					<div className="absolute right-6 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
						<Link to="/p2p/ad" state={{ adDetail: adDetail }}>
							<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								View full details
							</button>
						</Link>

						{isActiveAd && (
							<button
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => setShowEdit(true)}
							>
								Edit ad
							</button>
						)}

						{/* {isClosedAd && (
							<button
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={handleRepeatAd}
							>
								Repeat ad
							</button>
						)} */}

						{isActiveAd && (
							<button
								className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
								onClick={handleCloseAd}
								disabled={isUpdating}
							>
								{isUpdating ? "Closing..." : "Close ad"}
							</button>
						)}
					</div>
				</>
      )}
      
      {showEdit && (
        <EditAd
          close={() => setShowEdit(false)}
          ad={adDetail}
        // ad={price: adDetail?.price amount:adDetail?.amount??"",id:adDetail?.id??"",asset:adDetail?.asset, type:adDetail?.type,minimumLimit:adDetail?.minimumLimit??"0", maximumLimit:adDetail?.maximumLiit??"0"}
        />
      )}
		</>
	);
};

export default TableActionMenu;
