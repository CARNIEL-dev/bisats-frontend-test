import React, { useEffect, useState } from 'react';
import Empty from '../../components/Empty';
import { WalletState } from '../../redux/reducers/walletSlice';
import { useSelector } from 'react-redux';
import { TWallet } from '../../types/wallet';
import { GetLivePrice } from '../../redux/actions/walletActions';
import { assets } from '../../data';




export enum Fields {
    Asset = 'Asset',
    Balance = 'Balance',
    Empty = '',
}

export interface Asset {
    Asset: string;
    Balance: number;
    name: string;
    Rate: number;
}

interface TableProps {
    data: Array<any>;
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
    USDT_SOL_TEST: number
    USDT_TRC20: number;
    USDT_SOL: number;
    TRX: number;
    USDT_TRX: number;

};
const Table: React.FC<TableProps> = ({data}) => {
    return (
        <table className="table-auto w-full" style={{color: "#515B6E", fontSize: "14px"}}>
            <thead className='text-justify' style={{backgroundColor: "#F9F9FB"}}>
                <tr>
                    <th className='px-4 py-4'>Asset</th>
                    <th className='px-4 py-4'>Balance</th>
                    <th className='px-4 py-4'></th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={rowIndex % 2 === 0 ? {} : {backgroundColor: "#F9F9FB"}}>
                        <td className=''>
                            <div className="flex px-4 py-3">
                                <img src="/Icon/NGN.png" alt="logo" className="h-[24px] w-[24px] mr-[8px] mt-2" />
                                <div>
                                    <p style={{color: "#515B6E", fontSize: "14px"}} className="font-semibold">{row.Asset}</p>
                                    <p style={{color: "#606C82", fontSize: "12px"}}>{row.name}</p>
                                </div>
                            </div>
                        </td>
                        <td className='px-4 py-3'>
                            <div>
                                <p style={{color: "#515B6E", fontSize: "14px"}} className="font-semibold">{row.Balance}</p>
                                <p style={{color: "#606C82", fontSize: "12px"}}> ~{Math.round(row.Balance / row.Rate)} USD</p>
                            </div>
                        </td>
                        <td className='px-4 py-3 flex justify-end'>
                            <button style={{backgroundColor: "#FEF8E5", color: "#624B00"}} className='px-[12px] py-[6px] w-[108px] font-semibold mr-2'>Deposit</button>
                            <button style={{backgroundColor: "#FEF8E5", color: "#624B00"}} className='px-[12px] py-[6px] w-[108px] font-semibold'>Withdraw</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const Assets: React.FC = () => {
    const [tokenLivePrices,setTokenLivePrices]= useState<PriceData>()
    useEffect(() => {
        const fetchPrices = async () => {
            const prices = await GetLivePrice();
            setTokenLivePrices(prices);
        };

        fetchPrices();
    }, []);
    const wallet: TWallet = useSelector((state: any) => state.wallet).wallet
    const defaultAssets = [
        {
            Asset: 'BTC',
            name: 'Bitcoin',
            Balance: wallet?.BTC ?? 0,
            Rate:  tokenLivePrices?.BTC??0
        },
        {
            Asset: 'Eth',
            name: 'Ethereum',
            Balance: wallet?.ETH ?? 0,
            Rate: tokenLivePrices?.ETH??0
        },
        {
            Asset: 'SOL',
            name: 'Solana',
            Balance: wallet?.SOL ?? 0,
            Rate: tokenLivePrices?.SOL??0
        },
        {
            Asset: 'USDT',
            name: 'Tether USD',
            Balance: wallet?.USDT ?? 0,
            Rate: tokenLivePrices?.USDT??0
        },
        {
            Asset: 'xNGN',
            name: 'Naira on Bisats',
            Balance: wallet?.xNGN ?? 0,
            Rate: tokenLivePrices?.xNGN??0
        },
    ]

    console.log(tokenLivePrices)
    // const fields: Fields[]  = [Fields.Asset, Fields.Balance, Fields.Empty];
    const [openAssets] = useState<Array<Asset>>(defaultAssets);

    return (
        <div>
            {
                openAssets.length === 0 ? <Empty /> : <Table data={openAssets} />
            }
        </div>
    );
};

export default Assets;