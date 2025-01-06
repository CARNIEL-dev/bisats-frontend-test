import React, { useState } from 'react';
import Empty from '../../components/Empty';

const defaultAssets = [
    {
        Asset: 'BTC',
        name: 'Bitcoin',
        Balance: 1,
        Rate : 98000
    },
    {
        Asset: 'Eth',
        name: 'Ethereum',
        Balance: 2,
        Rate: 3800
    },
    {
        Asset: 'SOL',
        name: 'Solana',
        Balance: 100,
        Rate: 240
    },
    {
        Asset: 'USDT',
        name: 'Tether USD',
        Balance: 1000,
        Rate: 0.99
    },
    {
        Asset: 'xNGN',
        name: 'Naira on Bisats',
        Balance: 1800,
        Rate: 80
    },
]


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