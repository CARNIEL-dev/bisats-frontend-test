import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Empty from '../../components/Empty';

const defaultTransactions: ITransaction[] = [
    {
        'Trx type': 'Withdraw',
        'Date & Time': '2021.09.10 20:00:00',
        Reference: '123456',
        Assets: 'BTC',
        Amount: 50000,
        Status: 'Pending'        
    },
    {
        'Trx type': 'Deposit',
        'Date & Time': '2021.09.10 12:10:00',
        Reference: '123457',
        Assets: 'ETH',
        Amount: 4000,
        Status: 'Completed'
    },
    {
        'Trx type': 'Deposit',
        'Date & Time': '2021.09.10 15:32:00',
        Reference: '123458',
        Assets: 'LTC',
        Amount: 0.99,
        Status: 'Canceled'
    },
    {
        'Trx type': 'Withdraw',
        'Date & Time': '2021.09.10 15:32:00',
        Reference: '123458',
        Assets: 'LTC',
        Amount: 0.99,
        Status: 'Completed'
    },
];


export enum Fields {
    TransactionType = 'Trx type',
    Assets = 'Assets',
    Amount = 'Amount',
    Reference = 'Reference',
    Date = 'Date & Time',
    Status = 'Status'
}

export interface ITransaction {
    'Trx type': string;
    'Date & Time': string;
    Reference: string;
    Assets: string;
    Amount: number;
    Status: string;
}

const Transactions: React.FC = () => {
    const fields: Fields[]  = [Fields.TransactionType, Fields.Assets, Fields.Amount, Fields.Date, Fields.Reference, Fields.Status];
    const [openAds] = useState<Array<ITransaction>>(defaultTransactions);

    return (
        <div>
            {
                openAds.length === 0 ? <Empty /> : <Table fields={fields} data={openAds} />
            }
        </div>
    );
};

export default Transactions;