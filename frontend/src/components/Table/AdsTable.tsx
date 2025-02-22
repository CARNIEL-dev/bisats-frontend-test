import React from 'react';

interface TableProps {
    fields: Array<any>;
    data: Array<any>;
}

const Table: React.FC<TableProps> = ({ fields, data }) => {
    return (
        <table className="table-auto w-full" style={{color: "#515B6E", fontSize: "14px"}}>
            <thead className='text-justify'>
                <tr>
                    {fields.map((field, index) => (
                        <th key={index} className={(index + 1) > fields.length / 2 ? 'text-right px-4 py-3' : 'text-left px-4 py-4'} style={{backgroundColor: "#F9F9FB"}}>
                            {field}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} style={rowIndex % 2 === 0 ? {} : {backgroundColor: "#F9F9FB"}}>
                    {fields.map((field, colIndex) => (
                        <td key={colIndex} className={(colIndex + 1) > fields.length / 2 ? 'text-right font-semibold px-4 py-3' : 'text-left px-4 py-2'}>
                            {field === 'Status' ? <span style={{color: row[field] === 'Pending' ? "#D97708" : row[field] === 'Completed' ? "#17A34A" : "#B91C1B"}}>{row[field]}</span> : row[field]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;