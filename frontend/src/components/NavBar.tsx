import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import MaxWidth from "@/components/shared/MaxWith";
import { Button, buttonVariants } from "@/components/ui/Button";
import NAV_LINKS from "@/data/navlinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils";
import { Menu, X } from "lucide-react";
import { APP_ROUTES } from "@/constants/app_route";
import { UserState } from "@/redux/reducers/userSlice";
import BisatLogo from "./shared/Logo";
import usePreventScroll from "@/hooks/use-preventScroll";
import { logoutUser } from "@/redux/actions/userActions";

const NavBar = () => {
  const user: UserState = useSelector((state: any) => state.user);
  const isAuthenticated = user.isAuthenticated;
  const isMobile = useIsMobile();

  const [toggleMenu, setToggleMenu] = useState(false);

  usePreventScroll(toggleMenu);

  const closeMenu = () => {
    setToggleMenu(false);
  };

  return (
    <>
      <div className="bg-white w-full fixed inset-x-0 top-0 z-50 shadow-sm">
        <MaxWidth
          as="header"
          className="flex items-center justify-between  py-5 "
        >
          <div className="scale-75" onClick={isMobile ? closeMenu : undefined}>
            <BisatLogo />
          </div>

          <nav
            className={cn(
              "flex items-center gap-8 flex-col md:flex-row absolute md:static bg-white md:bg-transparent w-full md:w-auto top-full md:top-0   -right-[100vw] md:right-0 z-40 md:z-0 transition-all duration-500 ease transform p-10 md:p-0",
              toggleMenu && "right-0 duration-700 ease-in-out rounded-b-xl"
            )}
          >
            {NAV_LINKS.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                onClick={isMobile ? closeMenu : undefined}
                className="font-[400] text-sm leading-[24px] text-slate-600 text-center whitespace-nowrap cursor-pointer"
              >
                {link.title}
              </NavLink>
            ))}

            <div className="flex items-center gap-x-6 gap-y-4 md:flex-row flex-col w-full md:w-auto">
              {isAuthenticated ? (
                <>
                  <Link
                    to={APP_ROUTES.DASHBOARD}
                    className="text-sm text-slate-600"
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="secondary"
                    className={cn(
                      "px-8 md:w-fit w-full self-stretch h-fit py-2.5 text-sm"
                    )}
                    onClick={() => {
                      if (isMobile) {
                        closeMenu();
                      }
                      logoutUser();
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "px-8 md:w-fit w-full self-stretch h-fit py-2.5 text-sm"
                    )}
                    to={APP_ROUTES.AUTH.LOGIN}
                    onClick={isMobile ? closeMenu : undefined}
                  >
                    Sign In
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants(),
                      "px-8 md:w-fit w-full self-stretch h-fit py-2.5 text-sm"
                    )}
                    to={APP_ROUTES.AUTH.SIGNUP}
                    onClick={isMobile ? closeMenu : undefined}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          <Button
            variant="ghost"
            onClick={() => setToggleMenu((prev) => !prev)}
            className={cn(" !p-0 w-fit h-fit bg-transparent lg:hidden")}
          >
            {toggleMenu ? (
              <X className="!w-6 !h-6" />
            ) : (
              <Menu className="!w-6 !h-6" />
            )}
          </Button>
        </MaxWidth>
      </div>
      {/* SUB: OVERLAY */}
      <div
        onClick={closeMenu}
        className={cn(
          "md:hidden fixed inset-0 bg-black/80 z-30 opacity-0 duration-500 ease delay-300 invisible",
          toggleMenu && "opacity-100 visible"
        )}
      />
    </>
  );
};

export default NavBar;
