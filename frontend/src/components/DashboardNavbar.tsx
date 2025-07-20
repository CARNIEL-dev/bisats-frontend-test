import MaxWidth from "@/components/shared/MaxWith";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/app_route";
import {
  NotificationState,
  TNotification,
} from "@/redux/reducers/notificationSlice";
import { cn } from "@/utils";
import dayjs from "dayjs";
import { Bell, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import BisatLogo from "@/components/shared/Logo";

import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/Button";
import {
  GetNotification,
  Read_Notification,
} from "@/redux/actions/generalActions";
import { UserState } from "@/redux/reducers/userSlice";
import ProfileDropdown from "@/components/shared/ProfileDropdown";

dayjs.extend(relativeTime);

const DashboardNavbar = () => {
  return (
    <header className="bg-white shadow-sm fixed inset-x-0 top-0 z-50  w-full">
      <MaxWidth as="nav" className="flex items-center justify-between py-5">
        <div className="scale-75">
          <BisatLogo />
        </div>
        <div className="hidden lg:flex justify-center items-center gap-x-12 flex-1  font-semibold text-slate-500 dashboard-navbar">
          <NavLink to={APP_ROUTES.DASHBOARD}>Dashboard</NavLink>
          <NavLink to={APP_ROUTES.P2P.HOME}>P2P Market</NavLink>
          <NavLink to={APP_ROUTES.WALLET.HOME}>Wallet</NavLink>
        </div>

        <div className="flex items-center gap-x-4 md:gap-x-5">
          <Notification />
          <ProfileDropdown />
        </div>
      </MaxWidth>
    </header>
  );
};

export default DashboardNavbar;

// HDR: NOTIFICATION
const Notification = () => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const notificationState: NotificationState = useSelector(
    (state: any) => state.notification
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        {notificationState !== null &&
          notificationState.totalNotification > 0 && (
            <small className="absolute -right-2 -top-3 bg-priYellow grid place-content-center w-5 h-5 text-xs font-medium rounded-full ">
              {notificationState.unreadNotifications}
            </small>
          )}
        <Bell />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="md:w-[380px] w-[85dvw] p-4   h-full"
        sideOffset={10}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          Notifications <Bell className="w-4 h-4 text-emerald-600" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="h-full overflow-y-scroll max-h-[23rem] no-scrollbar">
          <>
            {notificationState !== null &&
            notificationState.totalNotification > 0 ? (
              notificationState?.notifications
                ?.slice()
                .sort((a, b) => Number(a.read) - Number(b.read))
                .map((notification: TNotification, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className={cn(
                        " px-2  border-b py-2 border-[#F3F4F6]",
                        notification.read && "opacity-35 "
                      )}
                    >
                      {!notification.read && (
                        <div className="flex items-center justify-between">
                          <span className="text-green-500 text-[10px] font-normal ">
                            New
                          </span>
                          <Button
                            variant="secondary"
                            className={cn("text-xs py-1 !h-fit text-slate-600")}
                            onClick={() => {
                              Read_Notification({
                                userId: user?.user?.userId,
                                notificationId: notification?.id,
                              });
                              GetNotification();
                            }}
                          >
                            <Check />
                            Read
                          </Button>
                        </div>
                      )}
                      <div className="my-1.5">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[#2B313B] text-sm font-semibold leading-[24px]">
                            {notification.title}
                          </h5>
                          <span className="text-slate-400 text-[10px] font-medium">
                            {dayjs(notification.createdAt).fromNow()}
                          </span>
                        </div>

                        <p className=" text-slate-500 text-sm font-medium  ">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">No notifications</p>
              </div>
            )}
          </>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
