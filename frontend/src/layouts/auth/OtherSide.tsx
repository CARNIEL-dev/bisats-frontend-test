import React, { ReactElement } from 'react'

type TOtherSideProp = {
    header: string,
    subHeader: string,
    upperSubHeader: ReactElement
}

const OtherSide: React.FC<TOtherSideProp> = ({ header, subHeader, upperSubHeader }) => {
    return (
        <div className='w-full lg:w-[442px]'>
            {upperSubHeader}
            <h1 className='text-priBlack font-[600] lg:text-[42px] lg:leading-[56px]'>{header}</h1>
            <p className='text-[#606C82] font-[400] lg:text-[16px] lg:leading-[28px]'>{subHeader}</p>

        </div>
    )
}
export default OtherSide