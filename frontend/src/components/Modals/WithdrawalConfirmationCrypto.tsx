import { PriceData } from "../../pages/wallet/Assets";
import { PrimaryButton } from "../buttons/Buttons";
import ModalTemplate from "./ModalTemplate";

interface Props {
  close: () => void;
  asset: string;
  network?: string;
  address: string;
  amount: string;
  submit: () => void;
  isLoading: boolean;
}
const WithdrawalConfirmationCrypto: React.FC<Props> = ({
  close,
  asset,
  address,
  amount,
  submit,
  isLoading,
  network,
}) => {
  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full text-center mx-auto">
        <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-5">
          Withdrawal Confirmation
        </h1>

        <div className="h-fit  border bg-[#F9F9FB] rounded-md py-3 px-5 my-5 text-[14px] leading-[24px] w-full ">
          <div className="flex justify-between items-start mb-2 text-wrap w-full">
            <p className="text-[#424A59] font-normal ">Withdrawal Address:</p>
            <p className="text-[#606C82]  font-semibold  text-right w-1/2 break-all ">
              {address}
            </p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Network:</p>
            <p className="text-[#606C82]  font-semibold">{network}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Withdrawal amount:</p>
            <p className="text-[#606C82]  font-semibold">
              {amount} {asset}
            </p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Fee:</p>
            <p className="text-[#606C82]  font-semibold">{2} USDT</p>
          </div>
        </div>

        <div className="flex items-center mb-5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[25px] h-[25px] shrink-0"
          >
            <path
              d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z"
              stroke="#858FA5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 5.33301V8.66634"
              stroke="#858FA5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.99609 10.667H8.00208"
              stroke="#858FA5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-[#606C82] text-[12px] leading-[16px] font-normal text-left ml-1">
            Ensure that the address and network are correct. Incorrect entries
            can lead to permanent loss of funds
          </p>
        </div>
        <PrimaryButton
          className={"w-full"}
          text={"Proceed"}
          loading={isLoading}
          onClick={submit}
        />
      </div>
    </ModalTemplate>
  );
};

export default WithdrawalConfirmationCrypto;
