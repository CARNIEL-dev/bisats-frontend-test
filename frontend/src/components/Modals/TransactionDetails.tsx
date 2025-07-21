import ModalTemplate from "./ModalTemplate";
import { PrimaryButton, RedTransparentButton } from "../buttons/Buttons";

import { handleCopy } from "@/redux/actions/generalActions";
import Toast from "../Toast";
import { ITransaction } from "@/pages/wallet/Transaction";

interface Props {
  close: () => void;
  details?: ITransaction;
}
const TransactionDetails: React.FC<Props> = ({ close, details }) => {
  const handleCopyToClip = async (prop: string) => {
    const result = await handleCopy(prop);
    if (result.status) {
      Toast.info(result.message, "");
    } else {
      Toast.error(result.message, "");
    }
  };

  const isXNGN = details?.Asset === "xNGN";

  return (
    <ModalTemplate onClose={close} className="md:!max-w-[45rem]">
      <div className="">
        <p
          className={` ${
            details?.Type === "top_up" ? "text-green-600" : "text-red-600"
          }  text-lg md:text-xl 2xl:text-3xl font-semibold`}
        >
          {details?.Type === "top_up" ? "Deposit" : "Withdrawal"}
        </p>
        <p className="text-gray-600 text-xs 2xl:text-base">
          Here is the details of your transacion
        </p>

        <div className="border bg-gray-100 rounded-2xl p-2 md:p-4 mt-4 space-y-2">
          <TextBetweenDisplay label="Asset" value={details?.Asset} />
          <TextBetweenDisplay
            label="Amount"
            value={details?.Amount.toString()}
          />
          <TextBetweenDisplay label="Network" value={details?.Network} />
          <TextBetweenDisplay label="Reference" value={details?.Reference} />
        </div>

        {/* <PrimaryButton css={"w-full"} text={"Copy Reference"} loading={false}
                    onClick={() =>handleCopyToClip(details?.Reference) } />
                <RedTransparentButton css={"w-full my-3"} text={"Cancel"} loading={false} onClick={close} /> */}
      </div>
    </ModalTemplate>
  );
};

export default TransactionDetails;

const TextBetweenDisplay = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  return (
    <div className="flex justify-between items-center text-sm ">
      <p className="text-gray-500 font-normal">{label}:</p>
      <p className="text-gray-600 font-medium capitalize">{value}</p>
    </div>
  );
};

/* 

       <div className="bg-[#F9F9FB] p-2 my-5 w-fit text-left border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] h-fit flex flex-col space-y-2 ">
          {
            <>
           
           
              {details?.Asset === "xNGN" && (
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#424A59] font-normal">Bank Detail:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {details?.bankDetails?.accountName} (
                    {details?.bankDetails?.accountNumber})
                  </p>
                </div>
              )}
              <div className="flex justify-between h-full items-center mb-2">
                <p className="text-[#424A59] font-normal">Transaction Hash:</p>
                <h1 className="text-[#606C82]  font-semibold  relative text-wrap overflow-wrap lg:w-1/3 ">
                  {details?.txHash}
                </h1>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className={`text-[#424A59] font-normal`}>Status:</p>
                <p
                  className={` ${
                    details?.Status === "success"
                      ? "text-[#17A34A]"
                      : "text-[red]"
                  } capitalize  font-semibold`}
                >
                  {details?.Status}
                </p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[#424A59] font-normal">Date:</p>
                <p className="text-[#606C82]  font-semibold">{details?.Date}</p>
              </div>
            </>
          }
        </div>

*/
