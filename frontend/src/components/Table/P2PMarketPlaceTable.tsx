import React from 'react';
import { PrimaryButton } from '../buttons/Buttons';

interface TableProps {
    fields: Array<any>;
    data: Array<any>;
    type: string
}

const P2PMPTable: React.FC<TableProps> = ({ fields, data, type }) => {
    return (
        <table className="table-auto w-full" style={{ color: "#515B6E", fontSize: "14px" }}>
            <thead className='text-justify'>
                <tr>
                    {fields.map((field, index) => (
                        <th key={index} className={'text-left px-4 py-4'} style={{ backgroundColor: "#F9F9FB" }}>
                            {field}
                        </th>

                    ))}
                    <th style={{ backgroundColor: "#F9F9FB" }} className={(3 + 1) > fields.length / 2 ? 'text-right px-10 py-3' : 'text-left px-4 py-4'}>
                        {type}
                    </th>
                </tr>
            </thead>
            <tbody className='text-[14px]'>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }} >
                        {fields.map((field, colIndex) => (
                            <>
                                <td key={colIndex} className={'text-left px-4 py-2 h-[96px]'}>

                                    {
                                        field === "Available/Limits" ? <div className='text-[14px] text-[#515B6E] font-[400]'>
                                            <p className='mb-2'>{row["Limits"].available}</p>
                                            <p>{row["Limits"].limits}</p>
                                        </div>
                                            : <div className={`flex items-center ${field === 'Unit Price' && "font-[600] text-[#2B313B]"}`}>{field === "Merchant" && <span className='w-[32px] h-[32px] rounded-[60px] mr-3 flex items-center justify-center' style={{ color: type === "Buy" ? "#17A34A" : "#B91C1B", background: type === "Buy" ? "#F5FEF8" : "#FEF2F2" }}>{row[field][0]}</span>}{row[field]}</div>}
                                </td>

                            </>
                        ))}
                        <td className={'text-right px-4 py-3'}>
                            <PrimaryButton text={type} loading={false} css='w-[102px]' />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default P2PMPTable;