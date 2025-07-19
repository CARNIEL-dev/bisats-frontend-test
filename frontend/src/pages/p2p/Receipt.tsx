
import { PrimaryButton, WhiteTransparentButton } from "../../components/buttons/Buttons"
import { typeofSwam } from "./components/Swap"

interface Props {
    // type: typeofSwam
}
const Receipt: React.FC<Props> = () => {
    return (
        <div className='w-1/3 mx-auto border-[#F3F4F6] border my-10 p-4  px-3 rounded-[8px]'>
            <h1 className={` 
                text-[18px] leading-[32px] font-semibold text-left `}>
                Transaction Completed
            </h1>

            <div className="h-fit rounded-[8px] border border  border-[#F9F9FB] bg-[#F9F9FB] rounded-[12px] py-3 px-5  my-5 text-[14px] leading-[24px] ">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Type:</p>
                    <p
                    // className={` ${type === typeofSwam.Buy ? "text-[#17A34A]" : "text-[#DC2625]"}  font-semibold`}
                    >
                        Buy
                        {/* {type === typeofSwam.Buy ? "Buy" : "Sell"} */}
                    </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Asset:</p>
                    <p className="text-[#606C82]  font-semibold">USDT</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Amount:</p>
                    <p className="text-[#606C82]  font-semibold">1000 USDT</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Price:</p>
                    <p className="text-[#606C82]  font-semibold">1 USDT ≈ 1,661.66166 xNGN</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Quantity:</p>
                    <p className="text-[#606C82]  font-semibold">1,000,661 xNGN</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Transaction Fees:</p>
                    <p className="text-[#606C82]  font-semibold">1 USDT</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Counterparty:</p>
                    <p className="text-[#C49600]  font-semibold">Express</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Order ref.:</p>
                    <p className="text-[#606C82]  font-semibold">1210918882191900 </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Transaction Time:</p>
                    <p className="text-[#606C82]  font-semibold">1210918882191900 </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[#424A59] font-normal">Order ref.:</p>
                    <p className="text-[#606C82]  font-semibold">10.11.2025 12:12:32</p>
                </div>
            </div>
            <div className="lg:flex lg:flex-nowrap flex-wrap items-center justify-center w-full justify-between">
                <div className="w-1/2">
                    <WhiteTransparentButton text={"Home"} loading={false} />

                </div>
                <div className="w-1/2 ml-3">
                    <PrimaryButton text={"Go to Wallet"} loading={false} />
                </div>
            </div>

        </div>
    )
}

export default Receipt