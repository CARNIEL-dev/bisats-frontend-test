import React from 'react';

const Empty: React.FC = () => {
    return (
        <div className='flex flex-col justify-center items-center h-[90%] p-[10px]'>
            <img className='h-[56px] w-[56px] mb-[8px]' src="/no_record.png" alt="Empty" />
            <p style={{ color: "#606C82", fontSize: "16px", lineHeight: "28px" }}>No Record Available</p>
        </div>
    );
};

export default Empty;