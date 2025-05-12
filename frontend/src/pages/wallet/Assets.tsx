import React, { useEffect, useMemo, useState } from "react";
import Empty from "../../components/Empty";
import { useSelector } from "react-redux";
import { TWallet } from "../../types/wallet";
import { GetLivePrice } from "../../redux/actions/walletActions";
import { convertAssetToUSD } from "../../utils/conversions";
import { Link } from "react-router-dom";
import { assets } from "../../data";

export enum Fields {
    Asset = "Asset",
    Balance = "Balance",
    Empty = "",

}

export interface Asset {
    Asset: string;
    Balance: number;
    name: string;
    Rate: number;
}

interface TableProps {
    data: Array<any>;
    livePrices?: any;
}

export type PriceData = {
    xNGN: number;
    BTC: number;
    SOL: number;
    ETH: number;
    USDT: number;
    BTC_TEST: number;
    SOL_TEST: number;
    ETH_TEST5: number;
    USDT_ETH_TEST5_KDZ7: number;
    TRX_TEST: number;
    USDT_TRX_TEST: number;
    USDT_SOL_TEST: number;
    USDT_TRC20: number;
    USDT_SOL: number;
    TRX: number;
    USDT_TRX: number;
};

const Table: React.FC<TableProps> = ({ data, livePrices }) => {
    return (
        <table
            className="table-auto w-full"
            style={{ color: "#515B6E", fontSize: "14px" }}
        >
            <thead className="text-justify" style={{ backgroundColor: "#F9F9FB" }}>
                <tr>
                    <th className="px-4 py-4">Asset</th>
                    <th className="px-4 py-4">Balance</th>
                    {/* Hide the empty header on mobile, show on sm and up */}
                    <th className="hidden sm:table-cell px-4 py-4"></th>
                </tr>
            </thead>
            <tbody>
                {data?.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }}
                    >
                        <td className="">
                            <div className="flex px-4 py-3">
                                <img
                                    src="/Icon/NGN.png"
                                    alt="logo"
                                    className="h-[24px] w-[24px] mr-[8px] mt-2"
                                />
                                <div>
                                    <p
                                        style={{ color: "#515B6E", fontSize: "14px" }}
                                        className="font-semibold"
                                    >
                                        {row.Asset}
                                    </p>
                                    <p style={{ color: "#606C82", fontSize: "12px" }}>
                                        {row.name}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <div>
                                <p
                                    style={{ color: "#515B6E", fontSize: "14px" }}
                                    className="font-semibold"
                                >
                                    {row.Balance}
                                </p>
                                <p style={{ color: "#606C82", fontSize: "12px" }}>
                                    {" "}
                                    ~
                                    {convertAssetToUSD(
                                        row?.Asset,
                                        row?.Balance,
                                        row?.Rate,
                                        livePrices
                                    )}{" "}
                                    USD
                                </p>
                            </div>
                        </td>
                        {/* Hide buttons on mobile, show on sm and up */}
                        <td className="hidden md:table-cell px-4 py-3">
                            <div className="flex justify-end">
                                <Link to="/wallet/deposit" state={{ asset: row.Asset }}>
                                    <button
                                        style={{ backgroundColor: "#FEF8E5", color: "#624B00" }}
                                        className="px-[12px] py-[6px] w-[108px] font-semibold mr-2"
                                    >
                                        Deposit
                                    </button>
                                </Link>
                                <Link to="/wallet/withdrawal" state={{ asset: row.Asset }}>
                                    <button
                                        style={{ backgroundColor: "#FEF8E5", color: "#624B00" }}
                                        className="px-[12px] py-[6px] w-[108px] font-semibold"
                                    >
                                        Withdraw
                                    </button>
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    // <div className="flex justify-end">
    //     <Link to="/wallet/deposit" state={{ asset: row.Asset }}>
    //         <button
    //             style={{ backgroundColor: "#FEF8E5", color: "#624B00" }}
    //             className="px-[12px] py-[6px] w-[108px] font-semibold mr-2"
    //         >
    //             Deposit
    //         </button>
    //     </Link>
    //     <Link to="/wallet/withdrawal" state={{ asset: row.Asset }}>
    //         <button
    //             style={{ backgroundColor: "#FEF8E5", color: "#624B00" }}
    //             className="px-[12px] py-[6px] w-[108px] font-semibold"
    //         >
    //             Withdraw
    //         </button>
    //     </Link>
    // </div>
	
};

// Mobile version of the table for smaller screens
const MobileTable: React.FC<TableProps> = ({ data, livePrices }) => {
    return (
        <div className="sm:hidden w-full">
            {data?.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex flex-col p-4 mb-2 rounded"
                    style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }}
                >
                    <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center">
                            <img
                                src="/Icon/NGN.png"
                                alt="logo"
                                className="h-[24px] w-[24px] mr-[8px]"
                            />
                            <div>
                                <p
                                    style={{ color: "#515B6E", fontSize: "14px" }}
                                    className="font-semibold"
                                >
                                    {row.Asset}
                                </p>
                                <p style={{ color: "#606C82", fontSize: "12px" }}>{row.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p
                                style={{ color: "#515B6E", fontSize: "14px" }}
                                className="font-semibold"
                            >
                                {row.Balance}
                            </p>
                            <p style={{ color: "#606C82", fontSize: "12px" }}>
                                {" "}
                                ~
                                {convertAssetToUSD(
                                    row?.Asset,
                                    row?.Balance,
                                    row?.Rate,
                                    livePrices
                                )}{" "}
                                USD
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Assets: React.FC = () => {
    const [tokenLivePrices, setTokenLivePrices] = useState<PriceData>();
    useEffect(() => {
        const fetchPrices = async () => {
            const prices = await GetLivePrice();
            setTokenLivePrices(prices);
        };

        fetchPrices();
    }, []);
    const wallet: TWallet = useSelector((state: any) => state.wallet).wallet;

    const defaultAssets = useMemo(
        () => [
            {
                Asset: assets.BTC,
                name: "Bitcoin",
                Balance: wallet?.BTC ?? 0,
                Rate: tokenLivePrices?.BTC ?? 0,
            },
            {
                Asset: assets.ETH,
                name: "Ethereum",
                Balance: wallet?.ETH ?? 0,
                Rate: tokenLivePrices?.ETH ?? 0,
            },
            {
                Asset: assets.SOL,
                name: "Solana",
                Balance: wallet?.SOL ?? 0,
                Rate: tokenLivePrices?.SOL ?? 0,
            },
            {
                Asset: assets.USDT,
                name: "Tether USD",
                Balance: wallet?.USDT ?? 0,
                Rate: tokenLivePrices?.USDT ?? 0,
            },
            {
                Asset: assets.xNGN,
                name: "Naira on Bisats",
                Balance: wallet?.xNGN ?? 0,
                Rate: tokenLivePrices?.xNGN ?? 0,
            },
        ],
        [
            tokenLivePrices?.BTC,
            tokenLivePrices?.ETH,
            tokenLivePrices?.SOL,
            tokenLivePrices?.USDT,
            tokenLivePrices?.xNGN,
            wallet?.BTC,
            wallet?.ETH,
            wallet?.SOL,
            wallet?.USDT,
            wallet?.xNGN,
        ]
    );

    const [openAssets] = useState<Array<Asset>>(defaultAssets);

    return (
        <div>
            {openAssets.length === 0 || !tokenLivePrices ? (
                <Empty />
            ) : (
                <>
                    {/* Regular table for sm screens and up */}
                    <div className="hidden sm:block">
                        <Table data={openAssets} livePrices={tokenLivePrices} />
                    </div>

                    {/* Mobile table for xs screens */}
                    <MobileTable data={openAssets} livePrices={tokenLivePrices} />
                </>
            )}
        </div>
    );

};

export default Assets;