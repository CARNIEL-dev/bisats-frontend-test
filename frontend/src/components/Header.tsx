import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  MakeDeposit,
  P2PMC,
  Profile,
  Settings,
  SignOut,
  Support,
  Wallet,
} from "../assets/icons/header-dropdown-icons";
import { APP_ROUTES } from "../constants/app_route";
import { GetLivePrice, GetWallet } from "../redux/actions/walletActions";
import LogOutModal from "./Modals/LogOut";

import { Read_Notification } from "../redux/actions/generalActions";
import { UserState } from "../redux/reducers/userSlice";
import BisatLogo from "./shared/Logo";

interface HeaderProps {
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const notificationState: NotificationState = useSelector(
    (state: any) => state.notification
  );
  const user = useSelector((state: { user: UserState }) => state.user);

  const [active, setActive] = useState(99);
  const [dropDown, setDropDown] = useState(false);
  const [notiDropDown, setNotiDropDown] = useState(false);
  const [showLogOutModal, setLogOutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    GetWallet();
    GetLivePrice();
  }, []);

  useEffect(() => {
    // GetNotification();
  }, [active]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formatted = (
      <p className="text-[12px] leading-[16px] font-normal flex items-center">
        {day}/{month}
        <span className="w-1 h-1 mx-1 rounded bg-[#D6DAE1]"></span> {hours}:
        {minutes}
      </p>
    );
    return formatted;
  };
  const navDropDowLinks = {
    Dashboard: {
      text: "Dashboard",
      link: APP_ROUTES.DASHBOARD,
    },
    Wallet: {
      text: "Wallet",
      link: APP_ROUTES.WALLET.HOME,
    },
    P2PMC: {
      text: "P2P Marketplace",
      link: APP_ROUTES.P2P.MARKETPLACE,
    },
    Ads: {
      text: "My Ads",
      link: APP_ROUTES.P2P.MY_ADS,
    },
    Express: {
      text: "Express",
      link: APP_ROUTES.P2P.EXPRESS,
    },
    Order_History: {
      text: "Order History",
      link: APP_ROUTES.P2P.ORDER_HISTORY,
    },
    Deposit: {
      text: "Make deposit",
      link: APP_ROUTES.WALLET.DEPOSIT,
    },
    Profile: {
      text: "Profile",
      link: APP_ROUTES.PROFILE,
    },
    Settings: {
      text: "Settings",
      link: APP_ROUTES.SETTINGS.PROFILE,
    },
    Support: {
      text: "Support",
      link: APP_ROUTES.SETTINGS.SUPPORT,
    },
    Sign_out: {
      text: "Sign out",
      link: "",
    },
  };

  return (
    <header className="px-4 md:px-8 lg:px-[120px] pt-[16px] pb-2 border-b border-[#F3F4F6] ">
      <nav
        className="container mx-auto flex justify-between items-center relative border-b-[#F3F4F6]"
        style={{ borderBottomColor: "#F3F4F6", borderBottom: "1px" }}
      >
        <BisatLogo className="w-[80px] h-[20px] lg:w-[100px] lg:h-[24px]" />

        {/* Navigation links - Fixed centering for large screens */}
        <div
          className="hidden lg:flex justify-center items-center gap-8 flex-1 text-lg font-semibold"
          style={{ color: "#515B6E" }}
        >
          <Link
            to="/dashboard"
            className={`px-2 py-4 ${
              currentPage === "Dashboard" ? "border-b-4" : ""
            }`}
            style={
              currentPage === "Dashboard"
                ? {
                    color: "#937000",
                    borderBottomColor: "#F5BB00",
                    borderRadius: "2px",
                  }
                : {}
            }
          >
            Dashboard
          </Link>
          <Link
            to="/p2p/market-place"
            className={`px-2 py-4 ${currentPage === "P2P" ? "border-b-4" : ""}`}
            style={
              currentPage === "P2P"
                ? {
                    color: "#937000",
                    borderBottomColor: "#F5BB00",
                    borderRadius: "2px",
                  }
                : {}
            }
          >
            P2P Market
          </Link>
          <Link
            to="/wallet"
            className={`px-2 py-4 ${
              currentPage === "Wallet" ? "border-b-4" : ""
            }`}
            style={
              currentPage === "Wallet"
                ? {
                    color: "#937000",
                    borderBottomColor: "#F5BB00",
                    borderRadius: "2px",
                  }
                : {}
            }
          >
            Wallet
          </Link>
        </div>

        <div className="pb-1">
          <div className="flex items-center">
            <button className="mr-2 md:mr-[20px] relative">
              <small className="absolute -right-2 -top-3 bg-[#F5BB00] px-1.5 py-1 text-[8px] rounded-full ">
                {notificationState.unreadNotifications}
              </small>
              <img
                src="/Icon/bell.png"
                alt="bell"
                className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
                onClick={() => {
                  setNotiDropDown(!notiDropDown);
                  setDropDown(false);
                }}
              />
            </button>
            <button className="mr-1 md:mr-2">
              <img
                src="/avatar.png"
                alt="profile"
                className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
              />
            </button>
            <button
              onClick={() => {
                setDropDown(!dropDown);
                setNotiDropDown(false);
              }}
            >
              <img
                src="/Icon/arrow-icon.png"
                alt="dropdown"
                className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
              />
            </button>
          </div>
        </div>
        {notiDropDown && (
          <div
            className={`absolute  p-3  border bg-[white] border-[#D6DAE1] rounded-[8px] right-20 top-12 w-[380px] h-[252px] z-10 hidden lg:block transition-all duration-200 ease-in-out ${
              notiDropDown
                ? "opacity-100 scale-100 ease-in-out"
                : "opacity-0 scale-95 ease-in pointer-events-none ease-in-out"
            }`}
            style={{
              boxShadow: "0px 2px 2px -1px #0000001F",
            }}
          >
            <div className="mx-3 flex items-center border-b py-2 border-[#D6DAE1]">
              <div className="flex items-center">
                <h1 className="text-[#0A0E12] text-[18px] flex items-center font-semibold leading-[32px]">
                  Notifications
                  <svg
                    className="mx-1.5"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 4.29297V6.51297"
                      stroke="#17A34A"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                    />
                    <path
                      d="M8.01522 1.33301C5.56189 1.33301 3.57522 3.31967 3.57522 5.77301V7.17301C3.57522 7.62634 3.38855 8.30634 3.15522 8.69301L2.30855 10.1063C1.78855 10.9797 2.14855 11.953 3.10855 12.273C6.29522 13.333 9.74188 13.333 12.9286 12.273C13.8286 11.973 14.2152 10.9197 13.7286 10.1063L12.8819 8.69301C12.6486 8.30634 12.4619 7.61967 12.4619 7.17301V5.77301C12.4552 3.33301 10.4552 1.33301 8.01522 1.33301Z"
                      stroke="#17A34A"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.2213 12.5469C10.2213 13.7669 9.22125 14.7669 8.00125 14.7669C7.39458 14.7669 6.83458 14.5135 6.43458 14.1135C6.03458 13.7135 5.78125 13.1535 5.78125 12.5469"
                      stroke="#17A34A"
                      stroke-miterlimit="10"
                    />
                  </svg>
                </h1>
              </div>
            </div>
            <div className="h-[180px] overflow-hidden overflow-y-scroll">
              {notificationState !== null &&
                notificationState?.notifications?.map(
                  (notification: TNotification, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="hover:bg-[#F5FEF8] relative px-2 cursor-pointer border-b py-3 border-[#F3F4F6]"
                        onMouseEnter={() => setActive(idx)}
                        onMouseLeave={() => setActive(100)}
                        onClick={() =>
                          Read_Notification({
                            userId: user?.user?.userId,
                            notificationId: notification?.id,
                          })
                        }
                      >
                        {!notification.read && (
                          <p className="text-[green] absolute top-1 left-2 text-[10px] font-normal leading-[16px]">
                            New
                          </p>
                        )}
                        <div className={`  items-center py-2`}>
                          <div className="flex items-center justify-between">
                            <h1 className="text-[#2B313B] text-[14px] font-semibold leading-[24px]">
                              {notification.title}
                            </h1>
                            <p className="text-[#606C82] text-[12px] font-semibold leading-[16px]">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>

                          <p className="text-[#606C82]  font-normal text-[14px] leading-[24px] ">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        )}
        {dropDown && (
          <>
            <div
              className="absolute border bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[207px] z-10 block lg:hidden"
              style={{
                boxShadow: "0px 2px 2px -1px #0000001F",
              }}
            >
              {Object.values(navDropDowLinks).map((link, idx: number) => {
                let title = link.text;

                return (
                  <div
                    key={idx}
                    className="px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]"
                    onMouseEnter={() => setActive(idx)}
                    onMouseLeave={() => setActive(100)}
                  >
                    <div
                      className={`${
                        (idx === 0 || idx === 1 || idx === 5 || idx === 9) &&
                        "border-b border-[#F3F4F6]"
                      } flex items-center py-2`}
                    >
                      {title === "Dashboard" ? (
                        <Home />
                      ) : title === "Wallet" ? (
                        <Wallet />
                      ) : title === "P2P Marketplace" ? (
                        <P2PMC />
                      ) : title === "Make deposit" ? (
                        <MakeDeposit />
                      ) : title === "Profile" ? (
                        <Profile />
                      ) : title === "Settings" ? (
                        <Settings />
                      ) : title === "Support" ? (
                        <Support />
                      ) : title === "Sign out" ? (
                        <SignOut />
                      ) : (
                        <div className="mr-4"></div>
                      )}
                      <p
                        className="text-[#515B6E] hover:text-[#17A34A] hover:font-semibold text-[14px] leading-[24px] font-normal pl-2 cursor-pointer"
                        onClick={() =>
                          link.text === "Sign out"
                            ? setLogOutModal(true)
                            : navigate(link.link)
                        }
                      >
                        {link.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`absolute border bg-[white] border-[#D6DAE1] rounded-[8px] right-0 top-12 w-[197px] z-10 hidden lg:block transition-all duration-200 ease-in-out ${
                dropDown
                  ? "opacity-100 scale-100 ease-in-out"
                  : "opacity-0 scale-95 ease-in pointer-events-none ease-in-out"
              }`}
              style={{
                boxShadow: "0px 2px 2px -1px #0000001F",
              }}
            >
              {Object.values(navDropDowLinks)
                .slice(6)
                .map((link: any, idx: number) => {
                  let title = link.text;

                  return (
                    <div
                      key={idx}
                      className="px-3 hover:bg-[#F5FEF8] hover:border-[#DCFCE7]"
                      onMouseEnter={() => setActive(idx)}
                      onMouseLeave={() => setActive(100)}
                    >
                      <div
                        className={`${
                          idx === 3 && "border-b border-[#F3F4F6]"
                        } flex items-center py-2`}
                      >
                        {title === "Dashboard" ? (
                          <Home />
                        ) : title === "Wallet" ? (
                          <Wallet />
                        ) : title === "P2P Marketplace" ? (
                          <P2PMC />
                        ) : title === "Make deposit" ? (
                          <MakeDeposit />
                        ) : title === "Profile" ? (
                          <Profile />
                        ) : title === "Settings" ? (
                          <Settings />
                        ) : title === "Support" ? (
                          <Support />
                        ) : title === "Sign out" ? (
                          <SignOut />
                        ) : (
                          <div className="mr-4"></div>
                        )}
                        <p
                          className="text-[#515B6E] hover:text-[#17A34A] hover:font-semibold text-[14px] leading-[24px] font-normal pl-2 cursor-pointer"
                          onClick={() =>
                            link.text === "Sign out"
                              ? setLogOutModal(true)
                              : navigate(`${link?.link}`)
                          }
                        >
                          {link.text}
                        </p>
                      </div>
                    </div>
                  );
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
