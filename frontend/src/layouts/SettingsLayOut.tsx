import React, { useState } from 'react'
import { APP_ROUTES } from '../constants/app_route'
import Header from '../components/Header'
import { Link, Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'

const SettingsLayOut = () => {
    const [activePage, setActivePage] = useState(0)

    const PageData = [
        {
            tab: "User info",
            link: APP_ROUTES.SETTINGS.PROFILE
        },
        {
            tab: "Security",
            link: APP_ROUTES.SETTINGS.SECURITY
        },
        {
            tab: "Payment",
            link: APP_ROUTES.SETTINGS.PAYMENT
        },
        {
            tab: "Support",
            link: APP_ROUTES.SETTINGS.SUPPORT
        },
    ]
    return (
        <div>
            <div className="w-full">
                <Header currentPage={""} />

                <div className='w-2/3 mx-auto py-10 lg:pt-20'>
                    <h1 className='text-[28px] lg:text-[34px] leading-[40px] font-[600] text-[#0A0E12] mr-4 '>Settings</h1>

                </div>
                <div className=" border-b-[1px] border-[#F3F4F6] h-[48px] ">
                    <div className=" hidden lg:flex justify-between px-[8px] pt-4 w-2/3 items-center mx-auto flex-nowrap " style={{ color: "#515B6E" }}>
                        {
                            PageData.map((page, idx) => <Link to={`${page.link}`} className={`${activePage === idx ? "border-b-4" : ""} text-[14px] text-[#515B6E] leading-[24px] font-[600] px-5`} style={activePage === idx ? { color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px" } : {}} onClick={() => setActivePage(idx)}>{page.tab}</Link>
                            )
                        }
                    </div>

                    <div className='py-10 w-2/3 mx-auto'>
                        <Outlet />

                    </div>
                </div>

            </div>
        </div>
    )
}

export default SettingsLayOut
