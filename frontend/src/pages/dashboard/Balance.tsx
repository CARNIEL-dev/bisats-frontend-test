import React from 'react';
import { Link } from 'react-router-dom';

const Balance: React.FC = () => {
    return (
        <div className="border-[1px] h-[220px] w-[48.5%] py-[24px] px-[34px]" style={{ borderRadius: '12px', borderColor: "#D6DAE1" }}>
            <div className="m-[2px]">
                <p style={{color: "#2B313B", fontSize: "15px"}} className="font-semibold">
                    Total Balance
                    <img className="mx-[8px] inline h-[15px] w-[15px] focus:cursor-pointer outline-none" src="/Icon/eye.png" alt="eye" tabIndex={0} />
                </p>
            </div>
            <div className="m-[2px]">
                <p style={{color: "#0A0E12"}}>
                    <span style={{fontSize: "34px", fontWeight: 600 }} className="mr-[0.5px]">96,000</span>
                    <span style={{fontSize: "22px", fontWeight: 600}} className="mr-[4px]">.05</span>
                    <span className="focus:cursor-pointer" tabIndex={0}>
                        <span style={{fontSize: "16px", fontWeight: 400}}>USD</span>
                        <img className="inline h-[16px] w-[16px]" src="/Icon/Arrow-down-Fill.png" alt="d"/>
                    </span>
                </p>
            </div>
            <div>
                <p style={{color: "#515B6E"}} className="mb-[25px]">
                    <span style={{fontSize: "12px", fontWeight: 600}}>+$100.45</span>
                    <span style={{fontSize: "12px", fontWeight: 400}} className="ml-[4px]">0.11%</span>
                </p>
            </div>
            <div>
                <Link to="/wallet/deposit" className="inline-flex items-center justify-center w-full h-[48px] py-[10px] px-[16px] font-semibold rounded-md " style={{backgroundColor: "#F5BB00", color: "#0A0E12", fontSize: "14px", lineHeight: "24px"}}>
                    Deposit
                </Link>
            </div>
        </div>
    );
};

export default Balance;