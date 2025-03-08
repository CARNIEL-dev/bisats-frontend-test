import { ToggleRight } from 'lucide-react';
import { PrimaryButton } from '../../../components/buttons/Buttons';
import TableActionMenu from '../../../components/Modals/TableActionMenu';
import { useNavigate } from 'react-router-dom';

const MyAds = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full lg:w-2/3 mx-auto px-3">
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <div className="flex flex-col">
                    <h2 className="font-semibold" style={{color: "#0A0E12", fontSize: "34px" }}>My Ads</h2>
                    <p style={{color: "#0A0E12", fontSize: "14px", fontWeight: 400}}>
                        Create, view and manage your ads on Bisats here
                    </p>
                </div>

                <PrimaryButton text="Create Ad" loading={false} onClick={() => navigate("/p2p/ad/create")} />
            </div>
            <div>
                <div className="h-[288px] m-[15px] p-[24px]">
                        <div className="mb-[12px]">
                            <p style={{ fontSize: "15px" }}>
                                <span style={{ fontSize: "18px", fontWeight: "600", color: "#0A0E12" }} className="mr-[8px]">
                                    Active ads
                                </span>
                            </p>
                        </div>
                        <table className="table-auto w-full" style={{color: "#515B6E", fontSize: "14px"}}>
                            <thead className='text-justify'>
                                <tr style={{backgroundColor: "#F9F9FB"}}>
                                    {/* <th className={(index + 1) > fields.length / 2 ? 'text-right px-4 py-3' : 'text-left px-4 py-4'} style={{backgroundColor: "#F9F9FB"}}> */}
                                    <th className='text-left px-4 py-4'>
                                        Type
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Asset
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Price
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Quantity
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Amount Filled
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Created
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Status
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr style={{backgroundColor: "#F9F9FB"}}> */}
                                <tr>
                                        {/* <td className={(colIndex + 1) > fields.length / 2 ? 'text-right font-semibold px-4 py-3' : 'text-left px-4 py-2'}> */}
                                        <td className='text-left px-4 py-2 font-semibold'>
                                            {/* <span style={"Sell" === "Sell" ? {color: "#DC2625"} : {color: "#17A34A"}}> */}
                                            <span style={{color: "#DC2625"}} >
                                                Sell
                                            </span>                           
                                        </td>
                                        <td className='text-left px-4 py-2 font-semibold'>
                                            USDT
                                        </td>
                                        <td className='text-left px-4 py-2'>
                                            1670.23
                                        </td>
                                        <td className='text-left px-4 py-2'>
                                            10,000 USDT
                                        </td>
                                        <td className='text-right px-4 py-2'>
                                            2,450 USDT
                                        </td>
                                        <td className='text-right px-4 py-3'>
                                            10/11 12:12
                                        </td>
                                        <td className='text-right space-x-2'>
                                            <span>
                                                Active
                                            </span>
                                            <ToggleRight 
                                                className="inline cursor-pointer" 
                                                fill="#22C55D"
                                                color="#22C55D"
                                                strokeWidth={1}
                                                >
                                                <circle cx="17" cy="12" r="5" fill="white" />
                                            </ToggleRight>
                                            {/* <ToggleLeft
                                                className="inline transition-all duration-200"
                                                fill="#9CA3AF"
                                                color="#9CA3AF"
                                                strokeWidth={1}
                                                >
                                                <circle cx="7" cy="12" r="5" fill="white" />
                                            </ToggleLeft> */}
                                        </td>
                                        <td className="text-right px-4 py-3 relative">
                                            <TableActionMenu />
                                        </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
            <div>
                <div className="h-[288px] m-[15px] p-[24px]">
                        <div className="mb-[12px]">
                            <p style={{ fontSize: "15px" }}>
                                <span style={{ fontSize: "18px", fontWeight: "600", color: "#0A0E12" }} className="mr-[8px]">
                                    Closed ads
                                </span>
                            </p>
                        </div>
                        <table className="table-auto w-full" style={{color: "#515B6E", fontSize: "14px"}}>
                            <thead className='text-justify'>
                                <tr style={{backgroundColor: "#F9F9FB"}}>
                                    <th className='text-left px-4 py-4'>
                                        Type
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Asset
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Price
                                    </th>
                                    <th className='text-left px-4 py-4'>
                                        Quantity
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Created
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Closed
                                    </th>
                                    <th className='text-right px-4 py-3'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                        {/* <td className={(colIndex + 1) > fields.length / 2 ? 'text-right font-semibold px-4 py-3' : 'text-left px-4 py-2'}> */}
                                        <td className={`text-left px-4 py-2 font-semibold`}>
                                            <span style={{color: "#17A34A"}}>
                                                Buy
                                            </span>                           
                                        </td>
                                        <td className='text-left px-4 py-2 font-semibold'>
                                            BTC
                                        </td>
                                        <td className='text-left px-4 py-2'>
                                            1670.23
                                        </td>
                                        <td className='text-left px-4 py-2'>
                                            10,000 USDT
                                        </td>
                                        <td className='text-right px-4 py-2'>
                                            10/11 12:12
                                        </td>
                                        <td className='text-right px-4 py-3'>
                                            10/11 12:12
                                        </td>
                                        <td className='text-right px-4 py-3 relative'>
                                            <TableActionMenu />
                                        </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    )
}

export default MyAds