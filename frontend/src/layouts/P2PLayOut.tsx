import UpTrend from "../assets/icons/upTrend.svg"
import DownTrend from "../assets/icons/downTrend.svg"
import { BTC, NGN, ETH, USDT, SOL } from "../assets/tokens"
import { Link, Outlet } from "react-router-dom"
import { useState } from "react"
import Header from "../components/Header"
import { APP_ROUTES } from "../constants/app_route"

const P2PLayOut = () => {
    const [activePage, setActivePage] = useState(0)

    const PageData = [
        {
            tab: "Market",
            link: APP_ROUTES.P2P.MARKETPLACE
        },
        {
            tab: "Express",
            link: APP_ROUTES.P2P.EXPRESS
        },
        {
            tab: "My ads",
            link: APP_ROUTES.P2P.MY_ADS
        },
        {
            tab: "Order history",
            link: APP_ROUTES.P2P.ORDER_HISTORY
        },
    ]
    const LiveData = [
        {
            token: "BTC",
            logo: BTC,
            price: "90,200.11",
            trend: "up",
            percentageIncrease: "3.8%"
        },
        {
            token: "ETH",
            logo: ETH,
            price: "1.01",
            trend: "down",
            percentageIncrease: "2.4%"
        },
        {
            token: "SOL",
            logo: SOL,
            price: "220.11",
            trend: "up",
            percentageIncrease: "10.9%"
        },
        {
            token: "USDT",
            logo: USDT,
            price: "1.0002",
            trend: "up",
            percentageIncrease: "0.0%"
        },

        {
            token: "xNGN",
            logo: NGN,
            price: "1670",
            trend: "up",
            percentageIncrease: "5%"
        },


    ]

    return (
        <div className="w-full">
            <Header currentPage={"P2P"} />

            <div className="bg-[#F9F9FB] border-[1px] border-[#F3F4F6] h-[48px] flex overflow-hidden">
                <div className="w-full lg:w-3/5  flex  mx-auto justify-between items-center" >
                    {
                        LiveData.map((data, idx) => <div className="flex items-center text-[12px] leading-[16px] text-[#515B6E] w-fit mr-12 lg:mr-0" key={idx}>
                            <img src={data.logo} alt={`${data.token} logo`} className="w-[16px] h-[16px]" />
                            <h2 className=" font-[600] text-[#515B6E] px-1">{data.token}</h2>
                            <p className=" font-[400] text-[#515B6E] flex whitespace-nowrap  ">{`${data.price} USD ${data.percentageIncrease}`}</p>
                            <img src={data.trend === "up" ? UpTrend : DownTrend} alt={`market trend`} className="w-[16px] h-[16px]" />

                        </div>)
                    }
                </div>
            </div>

            <div>
                <div className=" hidden lg:flex justify-between px-[8px] pt-4 w-[50%] items-center mx-auto flex-nowrap " style={{ color: "#515B6E" }}>

                    {
                        PageData.map((page, idx) => <Link to={`${page.link}`} className={`${activePage === idx ? "border-b-4" : ""} text-[14px] text-[#515B6E] leading-[24px] font-[600] px-5`} style={activePage === idx ? { color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px" } : {}} onClick={()=>setActivePage(idx)}>{page.tab}</Link>
                        )
                    }

                </div>
            </div>

            <div className="w-full py-10 lg:py-20">
                <Outlet />
            </div>

        </div>
    )
}

export default P2PLayOut