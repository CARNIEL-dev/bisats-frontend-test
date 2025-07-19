import ModalTemplate from "./ModalTemplate";
import PrimaryInput from "../Inputs/PrimaryInput";
import { PrimaryButton } from "../buttons/Buttons";
import { useState } from "react";
import Toast from "../Toast";
import { TwoFactorAuth } from "../../redux/actions/walletActions";
import { UserState } from "../../redux/reducers/userSlice";
import { useSelector } from "react-redux";
import {
	rehydrateUser,
	Set_PIN,
	UPDATE_PIN,
} from "../../redux/actions/userActions";

interface Props {
	close: () => void;
	type: "create" | "change";
}

const SetPinModal: React.FC<Props> = ({ close, type }) => {
	const userState: UserState = useSelector((state: any) => state.user);
	const user = userState.user;
	const [oldPin, setOldPin] = useState("");
	const [pin, setPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
	const [loading, setLoading] = useState(false);

	const Submit = async () => {
		if (pin !== confirmPin) {
			Toast.error("Make sure you entered the same PIN", "PIN mismatch");
			return;
		}
		setLoading(true);
		const response = await (type === "create"
			? Set_PIN({
					userId: user?.userId,
					pin: pin,
					confirmPin: confirmPin,
			  })
			: UPDATE_PIN({
					userId: user?.userId,
					pin: pin,
					confirmPin: confirmPin,
					oldPin: oldPin,
			  }));
		setLoading(false);
		if (response?.status) {
			Toast.success(
				response.message,
				type === "create" ? "PIN Created" : "PIN Updated"
			);
			rehydrateUser();
			close();
		} else {
			Toast.error(response.message, "Failed");
		}
	};

	const handleModalContentClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<ModalTemplate onClose={close}>
			<div
				className="flex flex-col justify-center w-full mx-auto"
				onClick={handleModalContentClick}
			>
				<h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-5">
					Security Verification
				</h1>
				<div className="mt-5">
					{type === "change" && (
						<PrimaryInput
							css={"w-full p-2.5 mb-7"}
							label={"Old PIN"}
							placeholder="Old PIN"
							error={undefined}
							touched={undefined}
							value={oldPin}
							onChange={(e) => {
								let value = e.target.value.replace(/\D/g, "");
								setOldPin(value);
							}}
						/>
					)}
					<div className="relative mb-4">
						<PrimaryInput
							css={"w-full p-2.5"}
							type="number"
							label={"Wallet PIN"}
							placeholder="Enter PIN"
							error={undefined}
							touched={undefined}
							value={pin}
							onChange={(e) => {
								let value = e.target.value.replace(/\D/g, "");
								setPin(value);
							}}
						/>
					</div>
					<PrimaryInput
						css={"w-full p-2.5 mb-7"}
						label={"Confirm PIN"}
						placeholder="Confirm PIN"
						error={pin !== confirmPin ? true : false}
						touched={undefined}
						value={confirmPin}
						onChange={(e) => {
							let value = e.target.value.replace(/\D/g, "");
							setConfirmPin(value);
						}}
					/>

					<PrimaryButton
						css={"w-full"}
						text={"Confirm"}
						loading={loading}
						onClick={Submit}
						disabled={loading}
					/>
				</div>
			</div>
		</ModalTemplate>
	);
};

export default SetPinModal;
