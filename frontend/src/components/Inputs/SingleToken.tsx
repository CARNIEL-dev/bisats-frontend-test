import React from 'react'
import { TNetwork } from '../../pages/wallet/deposits'

type Prop = {
   id: string,
      tokenName: string,
      currentBalance: string,
      networks?: TNetwork[],
      tokenLogo: JSX.Element
}
const SingleToken = ({ prop }: { prop: Prop })=> {
  return (
      <button
          id={`tokenSelectBtn`}
          // data-dropdown-toggle={parentId}
          className={`text-[#515B6E] p-2.5 bg-linear-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-full flex justify-between font-semibold text-[14px] leading-[24px] `}
          type="button"
      >
          {prop.tokenName}
          <div className="flex items-center">
              {
                    <div className="w-[20px] h-[20px] rounded-full">{prop?.tokenLogo}</div>
                    
              }
          </div>
      </button>
  )
}
export default SingleToken