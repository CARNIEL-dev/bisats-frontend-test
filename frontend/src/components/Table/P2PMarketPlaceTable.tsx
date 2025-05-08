import React from 'react';
import { PrimaryButton } from '../buttons/Buttons';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app_route';

interface TableProps {
    fields: Array<any>;
    data: Array<any>;
    type: string
}

const P2PMPTable: React.FC<TableProps> = ({ fields, data, type }) => {

    return (
        <div className='w-full'>
                    <table className="table-auto w-full" style={{ color: "#515B6E", fontSize: "14px" }}>
                        <thead className='text-justify '>
                            <tr className=''>
                                {fields?.map((field, index) => (
                                    <th key={index} className={'text-left px-4 py-4 '} style={{ backgroundColor: "#F9F9FB" }}>
                                        {field}
                                    </th>

                                ))}
                                <th style={{ backgroundColor: "#F9F9FB" }} className={(3 + 1) > fields?.length / 2 ? 'text-right px-10 py-3' : 'text-left px-4 py-4'}>
                                    {type}
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-[14px]'>
                            {data?.map((row, rowIndex) => (
                                <tr key={rowIndex} style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }} >
                                    <td className={'text-left px-4 py-2 h-[96px]'}>
                                        Chinex Exchange

                                    </td>
                                    <td className={'text-left px-4 py-2 h-[96px]'}>
                                        NGN {row?.price}

                                    </td>
                                    <td className={'text-left text-[#515B6E] font- px-4 py-2 h-[96px] '}>
                                        <p>{row?.amountAvailable} {row?.asset}</p>
                                        <p>{row?.minimumLimit} - {row?.maximumLimit} xNGN</p>
                                    </td>

                                    <td className={'text-right px-4 py-3 flex justify-end '}>
                                        <Link to={row?.orderType === "buy" ? APP_ROUTES.P2P.BUY : APP_ROUTES.P2P.SELL} state={{ adDetail: row }}>
                                            <PrimaryButton text={type} loading={false} css='w-[102px] ' />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            
</div>

    );
};

export default P2PMPTable;