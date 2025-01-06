import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Empty from '../../components/Empty';

const defaultOrders = [
    {
        'Order type': 'Buy',
        'Date & Time': '2021.09.10 20:00:00',
        Reference: '123456',
        Quantity: 0.1,
        Amount: 50000,
        Status: 'Pending'        
    },
    {
        'Order type': 'Sell',
        'Date & Time': '2021.09.10 12:10:00',
        Reference: '123456',
        Quantity: 1,
        Amount: 4000,
        Status: 'Completed'
    },
    {
        'Order type': 'Sell',
        'Date & Time': '2021.09.10 15:32:00',
        Reference: '123456',
        Quantity: 100,
        Amount: 0.99,
        Status: 'Canceled'
    },
]


export enum Fields {
    OrderType = 'Order type',
    Date = 'Date & Time',
    Reference = 'Reference',
    Quantity = 'Quantity',
    Amount = 'Amount',
    Status = 'Status'
}

export interface IOrder {
    'Order type': string;
    'Date & Time': string;
    Reference: string;
    Quantity: number;
    Amount: number;
    Status: string;
}

const Orders: React.FC = () => {
    const fields: Fields[]  = [Fields.OrderType, Fields.Date, Fields.Reference, Fields.Quantity, Fields.Amount, Fields.Status];
    const [openAds] = useState<Array<IOrder>>(defaultOrders);

    return (
        <div>
            {
                openAds.length === 0 ? <Empty /> : <Table fields={fields} data={openAds} />
            }
        </div>
    );
};

export default Orders;