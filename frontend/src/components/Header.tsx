import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/app_route';
import { useNavigate } from 'react-router-dom';
import { Home, MakeDeposit, P2PMC, Profile, Settings, SignOut, Support, Wallet } from '../assets/icons/header-dropdown-icons';
import LogOutModal from './Modals/LogOut';
import { GetLivePrice, GetWallet } from '../redux/actions/walletActions';
import { useSelector } from 'react-redux';
import { NotificationState, TNotification } from '../redux/reducers/notificationSlice';

interface HeaderProps {
    currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
    const notificationState: NotificationState = useSelector((state: any) => state.notification);
    
    const [active, setActive] = useState(99)
    const [dropDown, setDropDown] = useState(false)
    const [notiDropDown, setNotiDropDown]=useState(false)
    const [showLogOutModal, setLogOutModal] = useState(false)
    
    console.log(notificationState)
    const navigate = useNavigate()

     useEffect(() => {
         GetWallet()
         GetLivePrice()
        }, [])

    const formatDate = (isoDate:string) => {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formatted = <p className='text-[12px] leading-[16px] font-[400] flex items-center'>{day}/{month}<span className='w-1 h-1 mx-1 rounded bg-[#D6DAE1]'></span> {hours}:{minutes}</p>;
        return formatted
    }
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
            link: APP_ROUTES.P2P.ORDER_HISTORY
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
            link: APP_ROUTES.DASHBOARD
        },
        Sign_out: {
            text: "Sign out",
            link: ""
        }
    }

    console.log(Object.values(navDropDowLinks))
    return (
        <header className="px-4 md:px-8 lg:px-[120px] pt-[16px] pb-2 border-b-[1px] border-[#F3F4F6] ">
            <nav className="container mx-auto flex justify-between items-center relative border-b-[#F3F4F6]" style={{ borderBottomColor: "#F3F4F6", borderBottom: "1px" }}>
                <div className="font-bold">

                    <Link to="/dashboards" className='cursor-pointer'>
                        <img src="/logo-dash.png" alt="Logo" className="w-[80px] h-[20px] md:w-[100px] md:h-[24px]" />

                    </Link>
                </div>
                
                {/* Navigation links - hidden on medium screens and below */}
                <div className="hidden lg:flex justify-between px-[8px] pt-4 w-[50%] font-[18px] font-semibold" style={{color: "#515B6E"}}>
                    <Link to="/dashboard" className={currentPage === 'Dashboard' ? "border-b-4" : ""} style={currentPage === 'Dashboard' ? {color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px"}: {}}>Dashboard</Link>
                    <Link to="/p2p/market-place" className={currentPage === 'P2P' ? "border-b-4" : ""} style={currentPage === 'P2P' ? { color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px" } : {}}>P2P Market</Link>
                    <Link to="/wallet" className={currentPage === 'Wallet' ? "border-b-4" : ""} style={currentPage === 'Wallet' ? {color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px"}: {}}>Wallet</Link>
                </div>
                
                <div className="pb-1">
                    <div className="flex items-center">
                        <button className="mr-2 md:mr-[20px]">
                            <img src="/Icon/bell.png" alt="bell" className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" onClick={() => { setNotiDropDown(!notiDropDown); setDropDown(false) }}/>
                        </button>
                        <button className="mr-1 md:mr-2">
                            <img src="/avatar.png" alt="profile" className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
                        </button>
                        <button onClick={() => { setDropDown(!dropDown);setNotiDropDown(false) }}>
                            <img src="/Icon/arrow-icon.png" alt="dropdown" className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
                        </button>
                    </div>
                </div>
                {notiDropDown && (
                    <div className={`absolute  p-3  border-[1px] bg-[white] border-[#D6DAE1] rounded-[8px] right-20 top-12 w-[380px] h-[252px] z-10 hidden lg:block transition-all duration-200 ease-in-out ${notiDropDown ? "opacity-100 scale-100 ease-in-out" : "opacity-0 scale-95 ease-in pointer-events-none ease-in-out"
                        }`} style={{
                            boxShadow: "0px 2px 2px -1px #0000001F"
                        }}>
                        
                        <div className='mx-3 flex items-center border-b-[1px] py-2 border-[#D6DAE1]'>
                            <div className='flex items-center'>
                                <h1 className='text-[#0A0E12] text-[18px] font-[600] leading-[32px]'>Notifications</h1>

                            </div>

                        </div>
                        <div className='h-[180px] overflow-hidden overflow-y-scroll'>
                            {notificationState !== null && notificationState?.notifications?.map((notification: TNotification, idx: number) => {
                                return (
                                    <div key={idx} className="hover:bg-[#F5FEF8] cursor-pointer border-b-[1px] py-3 border-[#F3F4F6]" onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(100)}>
                                        <div className={`  items-center py-2`}>
                                            <div className='flex items-center justify-between'>
                                                <h1 className='text-[#2B313B] text-[14px] font-[600] leading-[24px]'>{notification.title}</h1>
                                                <p className='text-[#606C82] text-[12px] font-[600] leading-[16px]'

                                                >{formatDate(notification.createdAt)}</p>
                                            </div>

                                            <p className="text-[#606C82]  font-[400] text-[14px] leading-[24px] "
                                            >{notification.message}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                     
                    </div>
                )}
                {dropDown && (
                    <>
                        <div className="absolute border-[1px] bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[207px] z-10 block lg:hidden" style={{
                            boxShadow: "0px 2px 2px -1px #0000001F"
                        }}>
                            {Object.values(navDropDowLinks).map((link, idx: number) => {
                                let title = link.text

                                return (
                                    <div key={idx} className="px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]" onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(100)}>
                                        <div className={`${(idx === 0 || idx === 1 || idx === 5 || idx === 9) && "border-b-[1px] border-[#F3F4F6]"} flex items-center py-2`}>
                                            {
                                                title === "Dashboard" ? <Home active={active === idx ? true : false} /> : 
                                                title === "Wallet" ? <Wallet active={active === idx ? true : false} /> : 
                                                title === "P2P Marketplace" ? <P2PMC active={active === idx ? true : false} /> : 
                                                title === "Make deposit" ? <MakeDeposit active={active === idx ? true : false} /> : 
                                                title === "Profile" ? <Profile active={active === idx ? true : false} /> :
                                                title === "Settings" ? <Settings active={active === idx ? true : false} /> : 
                                                title === "Support" ? <Support active={active === idx ? true : false} /> : 
                                                title === "Sign out" ? <SignOut /> : <div className="mr-4"></div>
                                            }
                                            <p className="text-[#515B6E] hover:text-[#17A34A] hover:font-[600] text-[14px] leading-[24px] font-[400] pl-2 cursor-pointer" onClick={() => link.text === "Sign out" ? setLogOutModal(true) : navigate(link.link)}>{link.text}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={`absolute border-[1px] bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[197px] z-10 hidden lg:block transition-all duration-200 ease-in-out ${
                            dropDown ? "opacity-100 scale-100 ease-in-out" : "opacity-0 scale-95 ease-in pointer-events-none ease-in-out"
                        }`} style={{
                            boxShadow: "0px 2px 2px -1px #0000001F"
                        }}>
                            {Object.values(navDropDowLinks).slice(6).map((link: any, idx: number) => {
                                let title = link.text

                                return (
                                    <div key={idx} className="px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]" onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(100)}>
                                        <div className={`${(idx === 3) && "border-b-[1px] border-[#F3F4F6]"} flex items-center py-2`}>
                                            {
                                                title === "Dashboard" ? <Home active={active === idx ? true : false} /> : 
                                                title === "Wallet" ? <Wallet active={active === idx ? true : false} /> : 
                                                title === "P2P Marketplace" ? <P2PMC active={active === idx ? true : false} /> : 
                                                title === "Make deposit" ? <MakeDeposit active={active === idx ? true : false} /> : 
                                                title === "Profile" ? <Profile active={active === idx ? true : false} /> :
                                                title === "Settings" ? <Settings active={active === idx ? true : false} /> : 
                                                title === "Support" ? <Support active={active === idx ? true : false} /> : 
                                                title === "Sign out" ? <SignOut /> : <div className="mr-4"></div>
                                            }
                                            <p className="text-[#515B6E] hover:text-[#17A34A] hover:font-[600] text-[14px] leading-[24px] font-[400] pl-2 cursor-pointer" onClick={() => link.text === "Sign out" ? setLogOutModal(true) : navigate(`${link?.link}`)}>{link.text}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </nav>
            {showLogOutModal && <LogOutModal close={() => setLogOutModal(false)} />}
        </header>
    );
};

export default Header;