import React, { useState } from 'react';

const defaultRates = [
    {
        logo: "",
        token: "xNGN",
        name: "Naira on Bisats",
        rate: "1",
        change: 0
    },
    {
        logo: "",
        token: "USDT",
        name: "Tether USD",
        rate: "1580.40",
        change: 0
    },
    {
        logo: "",
        token: "BTC",
        name: "Bitcoin",
        rate: "150,461,503.76",
        change: 5
    }
]

const MarketRate: React.FC = () => {

    const [marketRates] = useState<any>(defaultRates);

    return (
        <div className="border-[1px] h-[220px] w-[48.5%] p-[16px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
            <div className="mb-[6px]">
                <p style={{fontSize: "15px", fontWeight: "600", color: "#0A0E12"}}>Market Rates (per unit)</p>
            </div>
            <div>
                {
                    marketRates.slice(0,3).map((rate: any, index: number) => (
                        <div key={index} className="py-[6px]" style={ index === 0 ? {} : { borderTop: "1px solid #D6DAE1" }}>
                            <div className="flex justify-between">
                                <div className="flex">
                                    <img src="/Icon/NGN.png" alt="logo" className="h-[24px] w-[24px] mr-[8px] mt-2" />
                                    <div>
                                        <p style={{color: "#515B6E", fontSize: "15px"}} className="font-semibold">{rate.token}</p>
                                        <p style={{color: "#606C82", fontSize: "12px"}}>{rate.name}</p>
                                    </div>
                                </div>
                                <div className="flex mt-3">
                                    <p style={{color: "#2B313B", fontSize: "15px", fontWeight: "600"}} className="mr-[8px]">{rate.rate} NGN</p>
                                    <p style={{color: "#515B6E", fontSize: "12px"}}>{rate.change}%</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MarketRate;