import { useEffect, useState } from "react"
import DateInput from "../../components/Inputs/DateInput"
import { MultiSelectDropDown } from "../../components/Inputs/MultiSelectInput"
import SearchInput from "../../components/Inputs/SearchInput"
import { BACKEND_URLS } from "../../utils/backendUrls"
import Bisatsfetch from "../../redux/fetchWrapper"
import Toast from "../../components/Toast"

const OrderHistory = () => {
    const [orders, setOrders] = useState<Array<any>>([]);
    const assets = [
        {"value": "USDT", "label": "USDT"},
        {"value": "BTC", "label": "BTC"},
        {"value": "ETH", "label": "ETH"},
    ]
    const types = [
        {"value": "Buy", "label": "Buy"},
        {"value": "Sell", "label": "Sell"}
    ]
    const sortOptions = [
        {"value": "price", "label": "Price"},
        {"value": "date", "label": "Date"}
    ]

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await Bisatsfetch(BACKEND_URLS.P2P.ADS.FETCH_ORDERS, {
                    method: "GET",
                });
                console.log(response)
                setOrders(response.data);
            } catch (error: any) {
                console.error("Error fetching ads:", error);
                Toast.error(error.message, "Error")
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="w-full xl:w-3/4 lg:w-5/6 mx-auto px-6">
            <div className="mb-6">
                <h2 className="font-semibold" style={{color: "#0A0E12", fontSize: "22px" }}>Order History</h2>
            </div>

            <div className="hidden md:block mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="xl:w-40 lg:w-28 md:w-24">
                        <MultiSelectDropDown
                            parentId=""
                            title="All"
                            choices={assets}
                            handleChange={(e) => console.log(e)}
                            label="Assets" error={undefined} touched={undefined}                        />
                    </div>
                    <div className="xl:w-40 lg:w-28 md:w-24">
                        <MultiSelectDropDown
                            parentId=""
                            title="All"
                            choices={types}
                            handleChange={(e) => console.log(e)}
                            label="Type" error={undefined} touched={undefined}                        />
                    </div>
                    <div className="xl:w-80 lg:w-72 md:w-64">
                        <SearchInput placeholder="Search by ref. or counterparty" handleChange={(e) => console.log(e)} />
                    </div>
                    <div className="w-48">
                        <DateInput label="Date Range" handleChange={(e) => console.log(e)} title="Date Range" name="Date Range" error={undefined} touched={undefined}  />
                    </div>
                    <div className="xl:w-40 lg:w-28 md:w-24">
                        <MultiSelectDropDown
                            parentId=""
                            title="Sort By"
                            choices={sortOptions}
                            handleChange={(e) => console.log(e)}
                            label="sort" error={undefined} touched={undefined}                        />
                    </div>
                </div>
            </div>

            <div className="md:hidden mb-4">
                <button className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-md">
                    <span className="font-medium">Filters</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>

            <div className="overflow-x-auto">
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
                            orders.map(order => (
                                <tr>
                                    <td className={`text-left px-4 py-4 font-semibold`}>
                                        <span style={order.type === "Buy" ? {color: "#DC2625"} : {color: "#17A34A"}}>
                                            {order.type}
                                        </span>                 
                                    </td>
                                    <td className='text-left px-4 py-4 font-semibold'>
                                        {order.asset}
                                    </td>
                                    <td className='text-left px-4 py-4'>
                                        1670.23
                                    </td>
                                    <td className='text-left px-4 py-4'>
                                        10,000 USDT
                                    </td>
                                    <td className='text-right px-4 py-4'>
                                        1670.23 NGN
                                    </td>
                                    <td className='text-right px-4 py-4'>
                                        10000 USDT
                                    </td>
                                    <td className='text-right px-4 py-4'>
                                        Express
                                    </td>
                                    <td className='text-right px-4 py-4'>
                                        10/11 12:12
                                    </td>
                                </tr>
                            ))
                        }
                        {false && (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    No orders found matching your filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory