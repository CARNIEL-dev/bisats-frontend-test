import { PrimaryButton } from '../../../components/buttons/Buttons'
import { TokenData } from '../../../data'
import PrimaryInput from '../../../components/Inputs/PrimaryInput'
import { useState } from 'react'
import SwapConfirmation from '../../../components/Modals/SwapConfirmation'
import { typeofSwam } from './Swap'

const ExpressSwap = () => {
    const [active, setActive] = useState(0)
    const [showConfirmation, setShowConfirmation] = useState(false)
    return (
        <div>

            <h1 className='text-[28px] md:text-[34px] text-[#0A0E12] font-[600] leading-[40px] my-3'>P2P Express</h1>

            <p className='text-[#515B6E] text-[14px] font-[400] my-2'>Skip the stress of manually finding a merchant.</p>
            <div className='flex items-center my-1 w-full border-b-[1px] border-[#F3F4F6] justify-between my-5'>
                <p onClick={() => setActive(0)} className={`w-1/2  text-center cursor-pointer ${active === 0 ? " text-[18px] border-b-[3px] py-1 px-3 border-[#49DE80] rounded-t-[2px] text-[#49DE80] font-[600]" : ""}`}> Buy</p>
                <p onClick={() => setActive(1)} className={`w-1/2  text-center cursor-pointer ${active === 1 ? " text-[18px] border-b-[3px] py-1 px-3 border-[#DC2625] rounded-t-[2px] text-[#DC2625] font-[600]" : ""}`}> Sell</p>


            </div>

            <div>
                <div className='relative'>
                    <PrimaryInput css={'w-full h-[64px]'} label={'Amount'} error={undefined} touched={undefined} />
                    <div className='absolute right-3 top-10'>

                        <button

                            className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                            type="button"
                        >
                            {/* <Typography.Text> */}
                            {TokenData[1].tokenLogo}

                            <div className="mx-3">

                                {TokenData[1].tokenName}
                            </div>
                            {/* </Typography.Text> */}



                        </button>
                        {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                    </div>
                    <small className='text-[#606C82] text-[12px] font-[400]'>Balance: 20,000 xNGN</small>
                </div >

                <div className='relative my-10'>
                    <PrimaryInput css={'w-full h-[64px]'} label={'You’ll receive at least'} error={undefined} touched={undefined} />
                    <div className='absolute right-3 top-10'>

                        <button

                            className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] `}
                            type="button"
                        >
                            {/* <Typography.Text> */}
                            {TokenData[0].tokenLogo}

                            <div className="mx-3">

                                {TokenData[0].tokenName}
                            </div>
                            {/* </Typography.Text> */}



                        </button>
                        {/* <CryptoFilter error={undefined} touched={undefined} handleChange={() => console.log("mms")} /> */}
                    </div>
                    <small className='text-[#606C82] text-[12px] font-[400]'>Balance: 20,000 xNGN</small>

                    <p className='text-[#515B6E] text-[14px] font-[400] my-5'><span>1 USDT</span>  ≈ <span>1,661.66166 xNGN</span> <span className='text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]'> 30 s</span></p>
                </div>
            </div>
            <PrimaryButton text={`${active === 0 ? "Buy" : "Sell"} ${TokenData[1].tokenName}`} loading={false} css='w-full' />
            {showConfirmation && <SwapConfirmation close={() => setShowConfirmation(false)} type={typeofSwam.Buy} />
            }
        </div >
    )
}


export default ExpressSwap