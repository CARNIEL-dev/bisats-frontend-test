import { useLocation } from "react-router-dom";
import { formatCrypto, formatNumber } from "../../utils/numberFormat";
import { GetAdOrder } from "../../redux/actions/adActions";
import { useSelector } from "react-redux";
import { UserState } from "../../redux/reducers/userSlice";
import { useEffect, useState } from "react";
import { Ad } from "react-flags-select";


type TOrder = {
    type: string,
    reference: string,
    asset:string,
    amount:number,
    price:number,
    quantity: number,
    buyer: { userName: string },
    createdAt:string
}
const AdDetails = () => {
    const [loading, setLoading] = useState(false)

    const [adOrders, setAdOrders]=useState([])
    const location = useLocation();
    const user = useSelector((state: { user: UserState }) => state.user);
        const userId = user?.user?.userId || "";
    
    const adDetail = location.state?.adDetail;
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return "N/A";
        }
    };

    const FetAdOrder = async () => {
        setLoading(true)
        const res = await GetAdOrder({ userId: userId, adId: adDetail?.id })
        setAdOrders(res?.data)
        console.log(res)
        setLoading(false)
    }
    useEffect(() => {
        FetAdOrder()
    }, [adDetail])
    
    return (
        <div className="w-full max-w-[1024px] mx-auto px-3">
            <div>
                <h2 className="font-semibold" style={{color: "#0A0E12", fontSize: "34px" }}>Ad details</h2>
            </div>
            <div className="h-auto p-4 rounded-lg shadow-sm text-[#606C82] text-[14px] mb-6" style={{backgroundColor: "#F9F9FB"}}>
                <table className="w-full table-fixed mb-2">
                    <thead className="text-left">
                    <tr>
                        {["Transaction Type", "Asset", "Created On",  "Amount", "Amount Filled"].map((header, index) => (
                            <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                            <td className="p-1 w-1/6 font-semibold text-[#17A34A] capitalize">{ adDetail?.type}</td>
                            <td className="p-1 w-1/6">{adDetail?.asset}</td>
                            <td className="p-1 w-1/6">{ formatDate( adDetail?.createdAt)}</td>
                            <td className="p-1 w-1/6">{adDetail?.type.toLowerCase() === "sell" ? `${adDetail?.asset} ${formatCrypto(Number(adDetail?.amount) )}` : `xNGN ${formatNumber(adDetail?.amount)}`}</td>
                            <td className="p-1 w-1/6">{adDetail?.type.toLowerCase()==="sell"? `${adDetail?.asset} ${formatCrypto(Number(adDetail?.amountFilled))}`:`xNGN ${formatNumber(adDetail?.amountFilled)}`} </td>
                    </tr>
                    </tbody>
                </table>

                <table className="w-full table-fixed">
                    <thead className="text-left">
                    <tr>
                        {[ "Your Price",   ""].map((header, index) => (
                        <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="text-black">
                            {/* <td className="p-1 w-1/6">{ adDetail?.priceType}</td> */}
                            <td className="p-1 w-1/6">{ formatNumber(adDetail?.price)} NGN</td>
                        
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
                                        Amount Filled
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
                            <tr>
                                
                            </tr>
                            {
                                adOrders?.map((ad:TOrder, idx:number ) => <tr>
                                    <td className={`text-left px-4 py-2 font-semibold capitalize`} key={idx}>
                                        <span style={ad?.type.toLowerCase() !== "buy" ? { color: "#DC2625" } : { color: "#17A34A" }}>

                                            {
                                                ad?.type
                                            }                                    </span>
                                    </td>
                                    <td className='text-left px-4 py-2 font-semibold'>
                                        {ad?.reference}
                                    </td>
                                    <td className='text-left px-4 py-2'>
                                        {ad?.asset}
                                    </td>
                                    <td className='text-left px-4 py-2'>
                                        {formatNumber(ad?.amount)} xNGN
                                    </td>
                                    <td className='text-right px-4 py-3'>
                                        {formatNumber(ad?.price)} xNGN
                                    </td>
                                    <td className='text-right px-4 py-3'>
                                        {formatCrypto(ad?.quantity)} {ad?.asset}
                                    </td>
                                    <td className='text-right px-4 py-3'>
                                        {ad?.buyer?.userName}
                                    </td>
                                    <td className='text-right px-4 py-3'>
                                        {formatDate(ad?.createdAt)}
                                    </td>
                                </tr>)
                            }
                            
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    )
}

export default AdDetails