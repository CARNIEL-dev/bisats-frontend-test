import CryptoFilter from "../../components/CryptoFilter"
import Header from "./components/Header"
import { useState } from "react"
import MarketPlaceContent from "./components/MarketPlaceTable"
const MarketPlace = () => {
    const [active, setActive] = useState(0)
    return (
        <div className="w-full lg:w-2/3 mx-auto px-3">
            <div>
                <Header text="P2P Market" subtext="Fast, secure, and hassle-free. Complete your trades instantly—no waiting, no delays!" />
            </div>

            <div className=" flex items-center w-1/2 lg:w-1/4 justify-between my-5">
                <p onClick={() => setActive(0)} className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${active === 0 && "border-b-[4px] rounded-x-[2px] border-[#49DE80] text-[#17A34A]"}`}>Buy</p>
                <p onClick={() => setActive(1)} className={`cursor-pointer text-[#515B6E] text-[18px] font-[18px] pb-1 px-5 ${active === 1 && "border-b-[4px] rounded-x-[2px] border-[#F87171] text-[#DC2625]"}`}>Sell</p>


            </div>

            <div className="flex items-center w-3/5 lg:w-1/4  ">
                <CryptoFilter error={undefined} touched={undefined} handleChange={() => { }} />

                <button className="border-[1px] border-[#D6DAE1] rounded-[6px] w-[120px] px-4 flex justify-between items-center h-[48px] text-[#515B6E] text-[14px]">

                    Filter

                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.05078 1.57422H13.9508C14.7758 1.57422 15.4508 2.24922 15.4508 3.07422V4.72422C15.4508 5.32422 15.0758 6.07422 14.7008 6.44922L11.4758 9.29922C11.0258 9.67422 10.7258 10.4242 10.7258 11.0242V14.2492C10.7258 14.6992 10.4258 15.2992 10.0508 15.5242L9.00078 16.1992C8.02578 16.7992 6.67578 16.1242 6.67578 14.9242V10.9492C6.67578 10.4242 6.37578 9.74922 6.07578 9.37422L3.22578 6.37422C2.85078 5.99922 2.55078 5.32422 2.55078 4.87422V3.14922C2.55078 2.24922 3.22578 1.57422 4.05078 1.57422Z" stroke="#707D96" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.1975 1.57422L4.5 7.49922" stroke="#707D96" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                </button>

            </div>

            <div className="my-10">
                <p style={{ fontSize: "15px" }} className="mb-2 md:mb-3">
                    <span style={{ fontWeight: "600", color: "#0A0E12" }} className="mr-[8px] text-[14px] lg:text-[18px]  ">
                        Open Ads
                    </span>
                </p>
                <MarketPlaceContent type={active === 0 ? 'Buy' : 'Sell'} />
            </div>

        </div>
    )
}

export default MarketPlace