import { useEffect, useState } from "react";
import { BACKEND_URLS } from "../../../utils/backendUrls";
import Toast from "../../../components/Toast";
import Bisatsfetch from "../../../redux/fetchWrapper";

interface IAd {
    type: string,
    priceType: string,
    currency: string,
    priceMargin: number,
    asset: string,
    amount: number,
    amountFilled: number,
    createdAt: string,
    expiryDate: string,
    price: number,
    status: string
}

const AdDetails = () => {
    const [ad, setAd] = useState<IAd>();
    const [orders, setOrders] = useState<Array<any>>();

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await Bisatsfetch(BACKEND_URLS.P2P.ADS.GET_BY_ID, {
                    method: "GET",
                });
                console.log(response)
                setAd(response.data);
            } catch (error: any) {
                console.error("Error fetching ads:", error);
                Toast.error(error.message, "Error")
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await Bisatsfetch(BACKEND_URLS.P2P.ADS.GET_ORDER, {
                    method: "GET",
                });
                console.log(response)
                setOrders(response.data);
            } catch (error: any) {
                console.error("Error fetching ads:", error);
                Toast.error(error.message, "Error")
            }
        };

        fetchAd();
        fetchOrders();
    }, []);

    return (
        <div className="w-full lg:w-2/3 mx-auto px-3">
            <div>
                <h2 className="font-semibold" style={{color: "#0A0E12", fontSize: "34px" }}>Ad details</h2>
            </div>
            <div className="h-auto p-4 rounded-lg shadow-sm text-[#606C82] text-[14px] mb-6" style={{backgroundColor: "#F9F9FB"}}>
                <table className="w-full table-fixed mb-2">
                    <thead className="text-left">
                    <tr>
                        {["Transaction Type", "Asset", "Created On",, "Amount", "Amount Filled"].map((header, index) => (
                            <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                        <td className="p-1 w-1/6 font-semibold text-[#17A34A] capitalise">{ad?.type}</td>
                        <td className="p-1 w-1/6">{ad?.asset}</td>
                        <td className="p-1 w-1/6">{ad?.createdAt}</td>
                        <td className="p-1 w-1/6">{ad?.amount} USDT</td>
                        <td className="p-1 w-1/6">{ad?.amountFilled} USDT</td>
                    </tr>
                    </tbody>
                </table>

                <table className="w-full table-fixed">
                    <thead className="text-left">
                    <tr>
                        {["Pricing Type", "Your Price",  ""].map((header, index) => (
                        <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="text-black">
                        <td className="p-1 w-1/6">{ad?.type}</td>
                        <td className="p-1 w-1/6">1640.44 NGN</td>

                        <td className="p-1 w-1/6"></td>
                    </tr>
                    </tbody>
                </table>
                </div>
            <div>
                <div className="">
                        <div className='mb-2'>
                            <p>
                                <span className="font-semibold text-lg text-[#0A0E12]">
                                    Order History
                                </span>
                            </p>
                        </div>
                        <table className="table-auto w-full text-[#515B6E] text-sm">
                            <thead className='text-justify'>
                                <tr style={{backgroundColor: "#F9F9FB"}}>
                                    <th className='text-left px-4 py-4'>
                                        Type
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Order ref.
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Asset
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Amount
                                    </th>
                                    <th className='text-right px-4 py-4'>
                                        Price
                                    </th>
                                    <th className='text-right px-4 py-4'>
                                        Quantity
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        CounterParty
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders?.map(order => (
                                        <tr>
                                            <td className={`text-left px-4 py-2 font-semibold`}>
                                                <span style={order.type === "Buy" ? {color: "#DC2625"} : {color: "#17A34A"}}>
                                                    {order.type}
                                                </span>                 
                                            </td>
                                            <td className='text-left px-4 py-2 font-semibold'>
                                                {order.asset}
                                            </td>
                                            <td className='text-left px-4 py-2'>
                                                1670.23
                                            </td>
                                            <td className='text-left px-4 py-2'>
                                                10,000 USDT
                                            </td>
                                            <td className='text-right px-4 py-3'>
                                                1670.23 NGN
                                            </td>
                                            <td className='text-right px-4 py-3'>
                                                10000 USDT
                                            </td>
                                            <td className='text-right px-4 py-3'>
                                                Express
                                            </td>
                                            <td className='text-right px-4 py-3'>
                                                10/11 12:12
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    )
}

export default AdDetails