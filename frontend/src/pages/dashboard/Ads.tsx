import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Empty from '../../components/Empty';

const defaultAds = [
    {
        'Order Type': 'Buy',
        Asset: 'Bitcoin',
        Price: 98000,
        Amount: 0.1
    },
    {
        'Order Type': 'Sell',
        Asset: 'Ethereum',
        Price: 4700,
        Amount: 1
    },
    {
        'Order Type': 'Buy',
        Asset: 'USDT',
        Price: 0.99,
        Amount: 100
    },
]


export enum Fields {
    OrderType = 'Order Type',
    Asset = 'Asset',
    Price = 'Price',
    Amount = 'Amount',
}

export interface Ad {
    'Order Type': string;
    Asset: string;
    Price: number;
    Amount: number;
}

const Ads: React.FC = () => {
    const fields: Fields[]  = [Fields.OrderType, Fields.Asset, Fields.Price, Fields.Amount];
    const [openAds] = useState<Array<Ad>>(defaultAds);

    return (
        <div>
            {
                openAds.length === 0 ? <Empty /> : <Table fields={fields} data={openAds} />
            }
        </div>
    );
};

export default Ads;