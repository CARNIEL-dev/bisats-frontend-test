import ModalTemplate from "./ModalTemplate"
import { PrimaryButton, RedTransparentButton } from "../buttons/Buttons"

import { handleCopy } from "../../redux/actions/generalActions"
import Toast from "../Toast"

interface Props {
    close: () => void;
    details?:any

}
const TransactionDetails: React.FC<Props> = ({ close, details }) => {
    const handleCopyToClip = async (prop: string) => {
        const result = await handleCopy(prop);
        if (result.status) {
            Toast.info(result.message, "");
        } else {
            Toast.error(result.message, "")
        }
    }
    return (
        <ModalTemplate onClose={close} >
            <div className="flex flex-col justify-center w-full text-center mx-auto">
                <h1 className={` ${details?.Type === "top_up" ? "text-[#17A34A]" :"text-[red]"}  text-[18px] leading-[32px] lg:text-[18px] lg:leading-[32px] font-[600]`}>{details?.Type==="top_up"?"Deposit":"Withdrawal"}</h1>
                <p className="text-[#606C82] text-[14px] leading-[24px] lg:text-[14px] lg:leading-[24px] font-[400] my-3">Here is the details of your transacion</p>
                <div className="bg-[#F9F9FB] p-2 my-5 w-fit text-left border-[1px] border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
                    {
                        <>
                             <div className="flex justify-between items-center mb-2">
                        <p className="text-[#424A59] font-[400]">Asset:</p>
                        <p className="text-[#606C82]  font-[600]">{ details?.Asset}</p>
                    </div>
                            <div className="flex justify-between items-center mb-2">
                    <p className="text-[#424A59] font-[400]">Amount:</p>
                            <p className="text-[#606C82]  font-[600]">{details?.Amount}</p>
                        </div>
                         <div className="flex justify-between items-center mb-2">
                         <p className="text-[#424A59] font-[400]">Network:</p>
                         <p className="text-[#606C82]  font-[600]">{ details?.network}</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[#424A59] font-[400]">Reference:</p>
                                <p className="text-[#606C82]  font-[600]">{details?.Reference}</p>
                            </div>
                            {details?.Asset === "xNGN" &&
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[#424A59] font-[400]">Bank Detail:</p>
                                    <p className="text-[#606C82]  font-[600]">{details?.bankDetails?.accountName} ({details?.bankDetails?.accountNumber })</p>
                                </div>
                            }
                            <div className="flex justify-between h-full items-center mb-2">
                        <p className="text-[#424A59] font-[400]">Transaction Hash:</p>
                        <h1 className="text-[#606C82]  font-[600]  relative text-wrap overflow-wrap lg:w-1/3 ">{ details?.txHash}</h1>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className={`text-[#424A59] font-[400]`}>Status:</p>
                                <p className={` ${details?.Status === "success" ? "text-[#17A34A]" : "text-[red]"} capitalize  font-[600]`}>{details?.Status}</p>
                            </div>
                     <div className="flex justify-between items-center mb-2">
                     <p className="text-[#424A59] font-[400]">Date:</p>
                     <p className="text-[#606C82]  font-[600]">{ details?.Date}</p>
                            </div>
                        </>
                    }
                </div>
                <PrimaryButton css={"w-full"} text={"Copy Reference"} loading={false}
                    onClick={() =>handleCopyToClip(details?.Reference) } />
                <RedTransparentButton css={"w-full my-3"} text={"Cancel"} loading={false} onClick={close} />
            </div>
        </ModalTemplate>

    )
}

export default TransactionDetails
