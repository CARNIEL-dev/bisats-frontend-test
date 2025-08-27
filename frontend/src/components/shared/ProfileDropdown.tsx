import {
  Home,
  MakeDeposit,
  P2PMC,
  Profile,
  Settings,
  SignOut,
  Swap,
  Wallet,
} from "@/assets/icons/header-dropdown-icons";
import LogOutModal from "@/components/Modals/LogOut";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
import { BadgeCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";

const mainMenuItems = [
  {
    text: "Make deposit",
    link: APP_ROUTES.WALLET.DEPOSIT,
    icon: MakeDeposit,
  },
  {
    text: "Profile",
    link: APP_ROUTES.PROFILE,
    icon: Profile,
  },
  {
    text: "Settings",
    link: APP_ROUTES.SETTINGS.PROFILE,
    icon: Settings,
  },
  // {
  //   text: "Support",
  //   link: APP_ROUTES.SETTINGS.SUPPORT,
  //   icon: Support,
  // },
];

const mobileMenuItems = [
  {
    text: "Dashboard",
    link: APP_ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    text: "Wallet",
    link: APP_ROUTES.WALLET.HOME,
    icon: Wallet,
  },
  {
    text: "Swap",
    link: APP_ROUTES.SWAP.HOME,
    icon: Swap,
  },
  {
    text: "P2P Marketplace",
    link: APP_ROUTES.P2P.HOME,
    icon: P2PMC,
    subMenu: [
      {
        text: "My Ads",
        link: APP_ROUTES.P2P.MY_ADS,
      },
      {
        text: "Order History",
        link: APP_ROUTES.P2P.ORDER_HISTORY,
      },
    ],
  },
];

const ProfileDropdown = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const [open, setOpen] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="outline-none relative flex items-center gap-2">
          <img
            src="/avatar.png"
            alt="profile"
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
          />
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] p-2"
          sideOffset={10}
        >
          <div className="profile-dropdown">
            <div className="text-sm  px-2 capitalize text-slate-500">
              <h2>
                Hello,{" "}
                <span className="font-medium capitalize text-slate-600">
                  {user?.userName || user?.firstName || "User"}{" "}
                </span>
              </h2>

              <p className="flex items-center gap-1">
                {user?.accountLevel?.replace("_", " ") || "N/A"}

                {user?.accountLevel === "level_3" ? (
                  // <Medal fill="#FFD700" size={16} />
                  <BadgeCheck fill="#F5BB00" stroke="#fff" size={20} />
                ) : (
                  <BadgeCheck fill="#22C55D" stroke="#fff" size={16} />
                )}
              </p>
            </div>
            <Separator className="my-2" />
            <div className="md:hidden">
              {mobileMenuItems.map((item, index) => {
                if (item.subMenu) {
                  return (
                    <div key={index}>
                      <NavLink
                        to={item.link}
                        className={cn(
                          "group flex items-center gap-2 py-2.5  font-normal cursor-pointer text-slate-700 text-sm  hover:bg-[#F5FEF8] px-3 hover:font-medium hover:text-green-600 ",
                          pathname.includes(item.link) && "active"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon />
                        <span>{item.text}</span>
                      </NavLink>
                      <div className="pl-8 border-b">
                        {item.subMenu.map((subItem, subIndex) => (
                          <NavLink
                            to={subItem.link}
                            key={subIndex}
                            className={cn(
                              "block py-2.5 text-sm text-slate-600 hover:text-green-500",
                              pathname.includes(subItem.link) && "active"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {subItem.text}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <NavLink
                    to={item.link}
                    key={index}
                    className={cn(
                      "group flex items-center gap-2 py-2.5 hover:text-green-500 font-normal cursor-pointer text-slate-700 text-sm  hover:bg-[#F5FEF8] px-3 border-b "
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon />
                    <span className="group-hover:text-green-600 group-hover:font-medium">
                      {item.text}
                    </span>
                  </NavLink>
                );
              })}
            </div>
            {mainMenuItems.map((item, index) => (
              <NavLink
                to={item.link}
                key={index}
                onClick={() => setOpen(false)}
                className={cn(
                  " flex items-center gap-2 py-2  font-normal cursor-pointer text-slate-700 text-sm  hover:bg-[#F5FEF8] px-3  hover:font-medium hover:text-green-600"
                )}
              >
                <item.icon />
                <span className="  ">{item.text}</span>
              </NavLink>
            ))}
            <div className="border-t mt-2">
              <Button
                variant="ghost"
                onClick={() => setShowLogOutModal(true)}
                className={cn(
                  "w-full text-sm px-3 text-slate-700 font-normal justify-start hover:bg-red-500/5 hover:text-red-500 hover:font-medium"
                )}
              >
                <SignOut />
                Sign out
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {showLogOutModal && (
        <LogOutModal close={() => setShowLogOutModal(false)} />
      )}
    </>
  );
};

export default ProfileDropdown;
