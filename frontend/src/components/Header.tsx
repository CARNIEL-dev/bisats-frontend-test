import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/app_route';
import { useNavigate } from 'react-router-dom';
import { Home, MakeDeposit, P2PMC, Profile, Settings, SignOut, Support, Wallet } from '../assets/icons/header-dropdown-icons';
import LogOutModal from './Modals/LogOut';
import { GetWallet } from '../redux/actions/walletActions';

interface HeaderProps {
    currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
    const [active, setActive] = useState(99)
    const [dropDown, setDropDown] = useState(false)
    const [showLogOutModal, setLogOutModal] = useState(false)
    const navigate = useNavigate()

     useEffect(() => {
            GetWallet()
        }, [])

    const navDropDowLinks = {
        Dashboard: {
            text: "Dashboard",
            link: APP_ROUTES.DASHBOARD,
        },
        Wallet: {
            text: "Wallet",
            link: APP_ROUTES.WALLET.HOME
        },
        P2PMC: {
            text: "P2P Marketplace",
            link: APP_ROUTES.P2P.MARKETPLACE
        },
        Ads: {
            text: "My Ads",
            link: APP_ROUTES.P2P.MY_ADS
        },
        Express: {
            text: "Express",
            link: APP_ROUTES.P2P.EXPRESS
        },
        Order_History: {
            text: "Order History",
            link: ""
        },
        Deposit: {
            text: "Make deposit",
            link: APP_ROUTES.WALLET.DEPOSIT
        },
        Profile: {
            text: "Profile",
            link: APP_ROUTES.PROFILE
        },
        Settings: {
            text: "Settings",
            link: APP_ROUTES.SETTINGS.PROFILE
        },
        Support: {
            text: "Support",
            link: ""
        },
        Sign_out: {
            text: "Sign out",
        }
    }

    console.log(Object.values(navDropDowLinks))
    return (
        <header className="px-[120px] pt-[16px] pb-2 border-b-[1px] border-[#F3F4F6]">
            <nav className="container mx-auto flex justify-between items-center relative  border-b-[#F3F4F6]" style={{ borderBottomColor: "#F3F4F6", borderBottom: "1px" }}>
                <div className="font-bold">
                    <img src="/logo-dash.png" alt="Logo" className='w-[100px] h-[24px]' />
                </div>
                <div className="flex justify-between px-[8px] pt-4 w-[50%] font-[18px] font-semibold" style={{color: "#515B6E"}}>
                    <Link to="/dashboard" className={currentPage === 'Dashboard' ? "border-b-4" : ""} style={currentPage === 'Dashboard' ? {color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px"}: {}}>Dashboard</Link>
                    <Link to="/p2p/market-place" className={currentPage === 'P2P' ? "border-b-4" : ""} style={currentPage === 'P2P' ? { color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px" } : {}}>P2P Market</Link>
                    <Link to="/wallet" className={currentPage === 'Wallet' ? "border-b-4" : ""} style={currentPage === 'Wallet' ? {color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px"}: {}}>Wallet</Link>
                </div>
                <div className='pb-1'>
                    <div>
                        <button>
                            <img src="/Icon/bell.png" alt='bell' className='w-[24px] h-[24px] inline mr-[20px]'/>
                        </button>
                        <button>
                            <img src="/avatar.png" alt='profile' className='w-[40px] h-[40px] inline'/>
                        </button>
                        <button onClick={() => setDropDown(!dropDown)}>
                            <img src="/Icon/arrow-icon.png" alt='bell' className='w-[24px] h-[24px] inline'/>
                        </button>
                    </div>
                </div>

                {
                    dropDown &&
                    <>
                        <div className='absolute border-[1px] bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[207px] lg:hidden ' style={{
                            boxShadow: "0px 2px 2px -1px #0000001F"
                        }}>
                            {Object.values(navDropDowLinks).map((link, idx: number) => {
                                let title = link.text

                                return (
                                    <div className={` px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]`} onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(100)}>
                                        <div className={`${(idx === 0 || idx === 1 || idx === 5 || idx === 9) && "border-b-[1px] border-[#F3F4F6]"} flex items-center  py-2`}>

                                            {
                                                title === "Dashboard" ? <Home active={active === idx ? true : false} /> : title === "Wallet" ? <Wallet active={active === idx ? true : false} /> : title === "P2P Marketplace" ? <P2PMC active={active === idx ? true : false} /> : title === "Make deposit" ? <MakeDeposit active={active === idx ? true : false} /> : title === "Profile" ? <Profile active={active === idx ? true : false} /> :
                                                    title === "Settings" ? <Settings active={active === idx ? true : false} /> : title === "Support" ? <Support active={active === idx ? true : false} /> : title === "Sign out" ? <SignOut /> : <div className='mr-4'></div>
                                            }
                                            <p key={idx} className='text-[#515B6E] hover:text-[#17A34A] hover:font-[600] text-[14px] leading-[24px] font-[400] pl-2 cursor-pointer'>{link.text}</p></div>
                                    </div>)
                            })}


                        </div>

                        <div className={`absolute border-[1px] bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[197px] hidden lg:block transition-all duration-200 ease-in-out ${dropDown
                            ? "opacity-100 scale-100 ease-in-out"
                            : "opacity-0 scale-95 ease-in pointer-events-none ease-in-out"
                            }`} style={{
                                boxShadow: "0px 2px 2px -1px #0000001F"
                            }}>
                            {Object.values(navDropDowLinks).slice(6).map((link: any, idx: number) => {
                                let title = link.text

                                return (
                                    <div className={` px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]`} onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(100)}>
                                        <div className={`${(idx === 3) && "border-b-[1px] border-[#F3F4F6]"} flex items-center  py-2`}>

                                            {
                                                title === "Dashboard" ? <Home active={active === idx ? true : false} /> : title === "Wallet" ? <Wallet active={active === idx ? true : false} /> : title === "P2P Marketplace" ? <P2PMC active={active === idx ? true : false} /> : title === "Make deposit" ? <MakeDeposit active={active === idx ? true : false} /> : title === "Profile" ? <Profile active={active === idx ? true : false} /> :
                                                    title === "Settings" ? <Settings active={active === idx ? true : false} /> : title === "Support" ? <Support active={active === idx ? true : false} /> : title === "Sign out" ? <SignOut /> : <div className='mr-4'></div>
                                            }
                                            <p key={idx} className='text-[#515B6E] hover:text-[#17A34A] hover:font-[600] text-[14px] leading-[24px] font-[400] pl-2 cursor-pointer' onClick={() => link.text === "Sign out" ? setLogOutModal(true) : navigate(`${link?.link}`)}>{link.text}</p></div>
                                    </div>)
                            })}


                        </div>
                    </>
                }
            </nav>
            {showLogOutModal && <LogOutModal close={() => setLogOutModal(false)} />
            }
        </header>
    );
};

export default Header;