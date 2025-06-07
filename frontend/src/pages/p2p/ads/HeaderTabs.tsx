import React, { useState } from 'react'

const HeaderTabs = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
  const [tab, setTab]=useState("details")

   const PageData = [
           {
           tab: "Ad Details",
               active: "details"
           },
          //  {
          //      tab: "Pricing",
          //      active: "pricing"
          //  },
           {
               tab: "Review & Publish",
               active: "summary"
           },
       
    ]
  return (
       <div className=" flex lg:flex justify-between  pt-4 w-full items-center mx-auto flex-nowrap " style={{ color: "#515B6E" }}>
                        {
        PageData.map((page, idx) => <div key={idx}  className={` ${tab === (page.active) ? "border-b-2 border-[#F5BB00] text-[#937000]" : ""} text-[14px] text-[#515B6E] leading-[24px] text-center cursor-pointer w-1/3 font-[600] `}
          onClick={() => { setTab(page?.active); setActivePage(page.active) }}
              >{page.tab}</div>
                            )
                        }
    
                 </div>
  )
}
export default HeaderTabs