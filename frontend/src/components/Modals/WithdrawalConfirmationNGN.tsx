import { PrimaryButton } from "../buttons/Buttons";
import ModalTemplate from "./ModalTemplate";

interface Props {
  close: () => void;
  transactionFee: string;
  withdrawalAmount: string;
  total: string;
  submit?: () => void;
  isLoading?: boolean;
}
const WithdrawalConfirmationNGN: React.FC<Props> = ({
  close,
  transactionFee,
  withdrawalAmount,
  total,
  submit,
  isLoading,
}) => {
  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full text-center mx-auto">
        <h1 className="text-[#0A0E12] text-[22px] leading-[32px] font-semibold text-left mt-5">
          Withdrawal Confirmation
        </h1>

        <div className="h-fit border  border-[#F3F4F6] bg-[#F9F9FB] rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] ">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Transaction fee:</p>
            <p className="text-[#606C82]  font-semibold">
              {transactionFee} xNGN
            </p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Withdrawal amount:</p>
            <p className="text-[#606C82]  font-semibold">
              {withdrawalAmount} xNGN
            </p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#424A59] font-normal">Total:</p>
            <p className="text-[#606C82]  font-semibold">{total} xNGN</p>
          </div>
        </div>
        <PrimaryButton
          className={""}
          text={"Proceed"}
          loading={isLoading ?? false}
          onClick={submit}
        />
      </div>
    </ModalTemplate>
  );
};

export default WithdrawalConfirmationNGN;
