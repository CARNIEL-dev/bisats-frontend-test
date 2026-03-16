import { PrimaryButton } from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import TextBox from "../shared/TextBox";

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
        <h4 className=" text-[22px] leading-[32px] font-semibold text-left mt-5">
          Withdrawal Confirmation
        </h4>

        <div className="h-fit border  border-border bg-secondary rounded-[12px] py-3 px-5 my-5 text-[14px] leading-[24px] space-y-2">
          <TextBox
            label="Transaction fee"
            value={
              <span className=" font-semibold">
                {transactionFee}{" "}
                <span className="text-muted-foreground">xNGN</span>
              </span>
            }
          />
          <TextBox
            label="Withdrawal amount"
            value={
              <span className=" font-semibold">
                {withdrawalAmount}{" "}
                <span className="text-muted-foreground">xNGN</span>
              </span>
            }
          />
          <TextBox
            label="Total"
            value={
              <span className=" font-semibold">
                {total} <span className="text-muted-foreground">xNGN</span>
              </span>
            }
          />
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
