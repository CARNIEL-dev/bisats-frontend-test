import React from 'react'
import { PrimaryButton } from './buttons/Buttons'
import { APP_ROUTES } from '../constants/app_route';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navLinks = [
        { title: "Blog", href: "#" },
        { title: "More", href: "#" },
        { title: "Contact", href: "#" },
    ];
    const navigate=useNavigate()

  return (
      <div className='bg-[#0A0E12]'>
          <header className="flex items-center justify-between px-5 lg:px-20 py-4 lg:py-6 relative z-10">
              <img
                  className="w-[132.92px] h-5 lg:h-8"
                  alt="Bisats Logo"
                  src="/logo-1.svg"
              />

              <nav className="hidden lg:flex items-center gap-12">
                  {navLinks.map((link, index) => (
                      <a
                          key={index}
                          href={link.href}
                          className="font-desktop-body-4 text-white text-center whitespace-nowrap cursor-pointer"
                      >
                          {link.title}
                      </a>
                  ))}

                  <PrimaryButton  text={'Sign in'} loading={false} onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}/>
              </nav>
          </header>
    </div>
  )
}

export default NavBar
