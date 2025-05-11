const AdDetails = () => {
    return (
        <div className="w-full max-w-[1024px] mx-auto px-3">
            <div>
                <h2 className="font-semibold" style={{color: "#0A0E12", fontSize: "34px" }}>Ad details</h2>
            </div>
            <div className="h-auto p-4 rounded-lg shadow text-[#606C82] text-[14px] mb-6" style={{backgroundColor: "#F9F9FB"}}>
                <table className="w-full table-fixed mb-2">
                    <thead className="text-left">
                    <tr>
                        {["Transaction Type", "Asset", "Created On", "Expires On", "Quantity", "Amount Filled"].map((header, index) => (
                            <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                        <td className="p-1 w-1/6 font-semibold text-[#17A34A]">Buy</td>
                        <td className="p-1 w-1/6">USDT</td>
                        <td className="p-1 w-1/6">10/11/25 12:45</td>
                        <td className="p-1 w-1/6">12/11/25 12:45</td>
                        <td className="p-1 w-1/6">10,000 USDT</td>
                        <td className="p-1 w-1/6">2,450 USDT</td>
                    </tr>
                    </tbody>
                </table>

                <table className="w-full table-fixed">
                    <thead className="text-left">
                    <tr>
                        {["Pricing Type", "Your Price", "Upper Limit", "Lower Limit", "Ad Duration", ""].map((header, index) => (
                        <th key={index} className="p-1 w-1/6 font-light">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="text-black">
                        <td className="p-1 w-1/6">Static</td>
                        <td className="p-1 w-1/6">1640.44 NGN</td>
                        <td className="p-1 w-1/6">1,000,000.99 NGN</td>
                        <td className="p-1 w-1/6">1,000.99 NGN</td>
                        <td className="p-1 w-1/6">2 days, 0 hrs, 0 mins</td>
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
                            <tr>
                                    <td className={`text-left px-4 py-2 font-semibold`}>
                                        {/* <span style={"Buy" === "Buy" ? {color: "#DC2625"} : {color: "#17A34A"}}> */}
                                        <span style={{color: "#DC2625"}}>
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
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    )
}

export default AdDetails