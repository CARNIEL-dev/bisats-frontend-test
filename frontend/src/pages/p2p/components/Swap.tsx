import React from 'react'
import PrimaryInput from '../../../components/Inputs/PrimaryInput'
import CryptoFilter from '../../../components/CryptoFilter'
import { PrimaryButton } from '../../../components/buttons/Buttons'
import { TokenData } from '../../../data'

export enum typeofSwam { "Buy", "Sell" }
const Swap = ({ type }: { type: typeofSwam }) => {

    return (
        <div>
            <p className={`${type === typeofSwam.Buy ? "text-[#17A34A]" : "text-[#DC2625]"} text-[14px] font-[600] my-3`}> {type === typeofSwam.Buy ? "You’re Buying from" : "You’re Selling to"}</p>

            <h1 className='text-[28px] md:text-[34px] text-[#0A0E12] font-[600] leading-[40px] my-3'>Chinex exchanger</h1>

            <p className='text-[#515B6E] text-[14px] font-[400] my-2'><span>1 USDT</span>  ≈ <span>1,661.66166 xNGN</span> <span className='text-[#17A34A] text-[12px] font-[600] bg-[#F5FEF8]'> 30 s</span></p>
            <div className='flex items-center my-1 w-2/3 justify-between'>
                <div className='text-[12px] text-[#515B6E]'>
                    <h2 className='font-[600]'>Available</h2>
                    <p>565.5 USDT</p>
                </div>
                <div className='text-[12px] text-[#515B6E]'>
                    <h2 className='font-[600]'>Limit</h2>
                    <p>50,000 - 1,000,000 NGN</p>
                </div>
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
                </div>

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
                </div>


            </div>
            <PrimaryButton text={`${typeofSwam[type]} ${TokenData[1].tokenName}`} loading={false} css='w-full' />

        </div>
    )
}

export default Swap