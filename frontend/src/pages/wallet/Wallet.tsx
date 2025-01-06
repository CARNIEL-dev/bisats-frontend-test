import Header from "../../components/Header"
import Balance from "../../components/Balance";
import Assets from "./Assets";
import Orders from "../dashboard/Orders";

const Wallet = () => {    
    return (
        <div>
            <Header currentPage="Wallet"/>
            <div className="flex justify-center mt-[30px]">
                <div className="w-[60%]">
                    <div className="flex m-[15px]">
                        <Balance />
                    </div>
                    <div className="border-[1px] h-[432px] m-[15px] p-[24px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
                        <div className="mb-[12px]">
                            <p style={{fontSize: "15px"}}>
                                <span style={{fontSize: "18px", fontWeight: "600", color: "#0A0E12"}} className="mr-[8px]">
                                    Your assets
                                </span>
                                <button style={{color: "#C49600", fontSize: "14px", fontWeight: "600"}}>
                                    view all
                                </button>
                            </p>
                        </div>
                        <Assets />
                    </div>
                    <div className="border-[1px] h-[288px] m-[15px] p-[24px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
                    <div className="mb-[12px]">
                            <p style={{fontSize: "15px"}}>
                                <span style={{fontSize: "18px", fontWeight: "600", color: "#0A0E12"}} className="mr-[8px]">
                                    Transaction History
                                </span>
                                <button style={{color: "#C49600", fontSize: "14px", fontWeight: "600"}}>
                                    view all
                                </button>
                            </p>
                            <Orders />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Wallet
