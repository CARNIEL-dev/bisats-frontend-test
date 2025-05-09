import React from 'react'
import { PrimaryButton } from '../buttons/Buttons';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app_route';

interface TableProps {
    // fields: Array<any>;
    data: Array<any>;
    type: string
}

const MobileP2PMP: React.FC<TableProps> = ({ data, type }) => {
    return (
        <div>
            {
                data?.map((row, rowIndex) => (
                    <div style={rowIndex % 2 === 0 ? {} : { backgroundColor: "#F9F9FB" }} className='h-[106px] text-[14px] text-[#515B6E] p-2'>
                        <div>
                            <div className='flex items-center justify-between text-[14px] font-[600] text-[#515B6E]'>
                                {/* <p className='flex items-center'><span style={{ color: type === "Buy" ? "#17A34A" : "#B91C1B", background: type === "Buy" ? "#F5FEF8" : "#FEF2F2" }} className='w-[24px] h-[24px] rounded-[60px] mr-3 flex items-center justify-center'>{row?.["Merchant"][0]}</span>{row?.["Merchant"]}</p> */}
                                <p>{row?.price}</p>
                            </div>

                            <div className='flex justify-between items-end text-[12px] text-[#515B6E]'>
                                <div>
                                    <div className='flex items-center py-3'>
                                        <p className=' font-[600]'>Unit Price</p> <span className='pl-2 font-[400]'>{row?.["Limits"]?.available}</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className='font-[600]'>Available/Limits</p> <span className='pl-2 font-[400]'>{row?.["Limits"]?.limits}</span>
                                    </div>
                                </div>
                                    <Link to={row?.orderType === "buy" ? APP_ROUTES.P2P.BUY : APP_ROUTES.P2P.SELL} state={{ adDetail: row }}>
                                
                                    <PrimaryButton text={type} loading={false} css='w-[100px] h-[36px] flex items-center justify-end' />
                                    </Link>
                            </div>
                        </div>
                    </div>
                ))
            }</div>
    )
}
export default MobileP2PMP