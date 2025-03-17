import React, { useState } from 'react';
import Empty from '../../../components/Empty';
import P2PMPTable from '../../../components/Table/P2PMarketPlaceTable';
import MobileP2PMP from '../../../components/Table/MobileP2PMarketPlace';


type limits = {
    available: string;
    limits: string
}

export interface Ad {
    Merchant: string;
    'Unit Price': string;
    Limits: limits;
}

const MarketPlaceContent = ({ type }: { type: string }) => {
    const Fields = {
        Merchant: "Merchant",
        UnitPrice: "Unit Price",
        Limits: "Available/Limits",
    } as const;


    const defaultAds = [
        {
            Merchant: "Chinex exchanger",
            'Unit Price': "₦ 1739.80",
            Limits: {
                available: "565.5 USDT",
                limits: "50,000 - 1,000,000 NGN"
            },
        },
        {
            Merchant: "Chinex exchanger",
            'Unit Price': "₦ 1739.80",
            Limits: {
                available: "565.5 USDT",
                limits: "50,000 - 1,000,000 NGN"
            },
        },

    ]
    type FieldKeys = keyof typeof Fields;
    type FieldValues = (typeof Fields)[FieldKeys];

    const fields: FieldValues[] = [Fields.Merchant, Fields.UnitPrice, Fields.Limits,];
    const [openAds] = useState<Array<Ad>>(defaultAds);

    return (
        <div>
            {
                openAds.length === 0 ? <Empty /> : <div>
                    <div className='hidden md:flex'>
                        <P2PMPTable fields={fields} data={openAds} type={type} />
                    </div>
                    <div className='md:hidden'>
                        <MobileP2PMP data={openAds} type={type} />
                    </div>
                </div>
            }
        </div>
    );
};

export default MarketPlaceContent;