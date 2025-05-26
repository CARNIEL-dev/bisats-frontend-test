import React from 'react'
import { PrimaryButton } from './buttons/Buttons'
import { APP_ROUTES } from '../constants/app_route';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo/blackTextLogo.png"

const NavBar = () => {
    const navLinks = [
        { title: "More", href: "#" },
        { title: "Blog", href: "#" },
        { title: "Contact", href: "#" },
        { title: "Sign In", href: "/auth/login" },
    ];
    const navigate=useNavigate()

  return (
      <div className='bg-[transparent]'>
          <header className="flex items-center justify-between px-5 lg:px-20 py-4 lg:py-4 relative z-10">
              <img
                  className="w-[132.92px] h-5 lg:h-8"
                  alt="Bisats Logo"
                  src={Logo}
              />

              <nav className="hidden lg:flex items-center gap-12">
                  {navLinks.map((link, index) => (
                      <a
                          key={index}
                          href={link.href}
                          className="font-[400] text-[14px] leading-[24px] text-[#515B6E] text-center whitespace-nowrap cursor-pointer"
                      >
                          {link.title}
                      </a>
                  ))}

                  <PrimaryButton css='w-full lg:w-[133px]' text={'Sign Up'} loading={false} onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}/>
              </nav>
          </header>
    </div>
  )
}

export default NavBar
