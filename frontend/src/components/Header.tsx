import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="px-[120px] pt-[16px]">
            <nav className="container mx-auto flex justify-between items-center" style={{borderBottomColor : "#F3F4F6", borderBottom: "1px"}}>
                <div className="font-bold">
                    <img src="/logo-dash.png" alt="Logo" className='w-[100px] h-[24px]' />
                </div>
                <div className="flex justify-between px-[8px] pt-4 w-[50%] font-[18px] font-semibold" style={{color: "#515B6E"}}>
                    <Link to="/" className="border-b-4" style={{color: "#937000", borderBottomColor: "#F5BB00", borderRadius: "2px"}}>Dashboard</Link>
                    <Link to="/about" className="">P2P Market</Link>
                    <Link to="/contact" className="">Wallet</Link>
                </div>
                <div className='pb-1'>
                    <div>
                        <button>
                            <img src="/Icon/bell.png" alt='bell' className='w-[24px] h-[24px] inline mr-[20px]'/>
                        </button>
                        <button>
                            <img src="/avatar.png" alt='profile' className='w-[40px] h-[40px] inline'/>
                        </button>
                        <button>
                            <img src="/Icon/arrow-icon.png" alt='bell' className='w-[24px] h-[24px] inline'/>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;