import React, { ReactElement } from 'react'

type TOtherSideProp = {
    header: string,
    subHeader?: ReactElement | string,
    upperSubHeader?: ReactElement|string
}

const OtherSide = ({ header, subHeader, upperSubHeader = <div></div> }: TOtherSideProp) => {
    return (
        <div className='w-full lg:w-[452px]'>
            {upperSubHeader}
            <h1 className='text-pri-black font-semibold lg:text-[42px] lg:leading-[56px]'>{header}</h1>
            <p className='text-[#606C82] font-normal lg:text-[16px] lg:leading-[28px]'>{subHeader}</p>
        </div>
    )
}
export default OtherSide