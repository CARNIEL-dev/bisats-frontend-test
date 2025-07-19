import React from "react";
import ModalTemplate from "./ModalTemplate";
import { PrimaryButton } from "../buttons/Buttons";
import { typeofSwam } from "../../pages/p2p/components/Swap";
import { formatNumber } from "../../utils/numberFormat";

interface Props {
	close: () => void;
	type: typeofSwam;
	amount: string;
	receiveAmount: string;
	fee: string;
	token: string|undefined;
	currency: string;
	loading?: boolean;
	onConfirm: () => void;
	networkFee?: string | null;
	transactionFee?: string | null;
	error?: string | null;
}

const SwapConfirmation: React.FC<Props> = ({
	close,
	type,
	amount,
	receiveAmount,
	fee,
	token,
	currency,
	loading = false,
	onConfirm,
	networkFee = null,
	transactionFee = null,
	error = null,
}) => {
	return (
		<ModalTemplate onClose={close}>
			<div className="flex flex-col justify-center w-full mx-auto">
				<div>
					<h1
						className={` ${
							type === (typeofSwam.Buy) ? "text-[#17A34A]" : "text-[#DC2625]"
						} text-[22px] leading-[32px] font-semibold text-left mt-5`}
					>
						{type === typeofSwam.Buy ? "Buy" : "Sell"} {token}
					</h1>
					<div className="h-fit rounded-[8px] border border-[#F9F9FB] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px]">
						<div className="flex justify-between items-center mb-1">
							<p className="text-[#424A59] font-normal">Amount:</p>
							<p className="text-[#606C82] font-semibold">
								{formatNumber(amount)} {token}
							</p>
						</div>
						<div className="flex justify-between items-center mb-1">
							<p className="text-[#424A59] font-normal">You'll receive:</p>
							<p className="text-[#606C82] font-semibold">
								{formatNumber(receiveAmount)} {currency}
							</p>
						</div>
						{type === (typeofSwam.Buy) &&
							<div className="flex justify-between items-center mb-1.5">
								<p className="text-[#424A59] font-normal">Fee:</p>
								<p className="text-[#606C82] font-semibold">
									{fee} {token}
								</p>
							</div>}
						{networkFee && (
							<div className="flex justify-between items-center mb-1.5">
								<p className="text-[#424A59] font-normal">Network Fee:</p>
								<p className="text-[#606C82] font-semibold">{formatNumber(networkFee)}</p>
							</div>
						)}
						{transactionFee &&  (
							<div className="flex justify-between items-center mb-1.5">
								<p className="text-[#424A59] font-normal">Transaction Fee:</p>
								<p className="text-[#606C82] font-semibold">{formatNumber(transactionFee)}</p>
							</div>
						)}
					</div>

					{error && (
						<div className="text-[#FFCCCB] text-[14px] font-normal mb-4 p-2 bg-red-50 rounded-lg">
							{error}
						</div>
					)}

					<div className="w-full">
						<PrimaryButton
							text={`Confirm ${type === typeofSwam.Buy ? "Buy" : "Sell"}`}
							loading={loading}
							style={{ width: "100%" }}
							onClick={onConfirm}
						/>
					</div>

					<div className="text-[#515B6E] text-[12px] font-normal text-center mt-5 flex items-center justify-center">
						<svg
							width="15"
							height="13"
							viewBox="0 0 15 13"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2"
						>
							<path
								d="M8.07902 0.99932L14.4297 11.9993C14.4882 12.1007 14.519 12.2156 14.519 12.3326C14.519 12.4497 14.4882 12.5646 14.4297 12.666C14.3712 12.7673 14.287 12.8515 14.1857 12.91C14.0843 12.9685 13.9694 12.9993 13.8524 12.9993H1.15102C1.034 12.9993 0.919041 12.9685 0.817697 12.91C0.716354 12.8515 0.632197 12.7673 0.573687 12.666C0.515177 12.5646 0.484374 12.4497 0.484375 12.3326C0.484376 12.2156 0.51518 12.1007 0.573691 11.9993L6.92436 0.99932C6.98287 0.897981 7.06703 0.81383 7.16837 0.755323C7.26971 0.696817 7.38467 0.666016 7.50169 0.666016C7.61871 0.666016 7.73367 0.696817 7.83501 0.755323C7.93635 0.81383 8.02051 0.897981 8.07902 0.99932ZM6.83502 9.66599V10.9993H8.16836V9.66599H6.83502ZM6.83502 4.99932V8.33265H8.16836V4.99932H6.83502Z"
								fill="#F5BB00"
							/>
						</svg>
						<p>This action is not reversable</p>
					</div>
				</div>
			</div>
		</ModalTemplate>
	);
};

export default SwapConfirmation;
