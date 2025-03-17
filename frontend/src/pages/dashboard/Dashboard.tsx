import Header from "../../components/Header"
import Balance from "./Balance"
import MarketRate from "./MarketRate";
import Ads from "./Ads";
import Orders from "./Orders";
import { getUser } from "../../helpers";
import { useEffect, useState } from "react";
import KycBanner from "../../components/KycBanner";

const Dashboard = () => {  
    const [openKycModal, setKycModalOpen] = useState(false)
    const user = getUser()
    useEffect(() => {
        const kyscStatus = user.kyc
        if (!kyscStatus.identificationVerified || !kyscStatus.personalInformationVerified || !kyscStatus.utilityBillVerified
        ) {
            setKycModalOpen(true)
        }
        // GetKYCStatus({ userId: user?.userId })
    }, [])

    return (
        <div>
            <Header currentPage="Dashboard" />
            <div className="w-[90%] lg:w-[70%] mx-auto pt-20">
                <div >
                    {openKycModal &&
                        <KycBanner />}
                </div>
                <div className="w-full flex justify-center mt-[30px]">

                    <div className="w-full">
                        <h2 className="text-[34px] mx-[15px] font-semibold" style={{ color: '#0A0E12' }}>Hello, {user.firstName}</h2>

                        <div className="flex justify-between m-[15px]">
                            <Balance />
                            <MarketRate />
                        </div>
                        <div className="border-[1px] h-[288px] m-[15px] p-[24px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
                            <div className="mb-[12px]">
                                <p style={{ fontSize: "15px" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "600", color: "#0A0E12" }} className="mr-[8px]">
                                        Open ads
                                    </span>
                                    <button style={{ color: "#C49600", fontSize: "14px", fontWeight: "600" }}>
                                        view all
                                    </button>
                                </p>
                            </div>
                            <Ads />
                        </div>
                        <div className="border-[1px] h-[288px] m-[15px] p-[24px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
                            <div className="mb-[12px]">
                                <p style={{ fontSize: "15px" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "600", color: "#0A0E12" }} className="mr-[8px]">
                                        Order History
                                    </span>
                                    <button style={{ color: "#C49600", fontSize: "14px", fontWeight: "600" }}>
                                        view all
                                    </button>
                                </p>
                            </div>
                            <Orders />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default Dashboard
