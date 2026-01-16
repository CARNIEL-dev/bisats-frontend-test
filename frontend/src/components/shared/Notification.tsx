import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchUserNotifications } from "@/redux/actions/generalActions";

import { cn } from "@/utils";

import { Bell, ChevronRight, Loader2, X } from "lucide-react";
import { useSelector } from "react-redux";

import { useMemo } from "react";

import { slideInLeft } from "@/components/animation";
import NotificationItem from "@/components/shared/NotificationItem";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

const Notification = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const isKycVerified = [
    userState?.kyc?.identificationVerified,
    userState?.kyc?.personalInformationVerified,
    userState.user?.phoneNumberVerified,
  ].every(Boolean);

  const {
    data: notificationState = {
      notifications: null,
      loading: false,
      totalNotification: 0,
      unreadNotifications: 0,
    },
    isLoading,
    error,
  } = useFetchUserNotifications({
    userId,
    isKycVerified,
  });

  const notificationData = useMemo(() => {
    const notifications = notificationState?.notifications || [];

    const unReadNotifcation = notifications.filter((item) => !item.read);

    const unreadNotifications =
      unReadNotifcation.length > 0 ? [...unReadNotifcation].slice(0, 3) : [];
    const unreadNotificationsCount = unReadNotifcation.length || 0;

    return {
      unreadNotifications,
      unreadNotificationsCount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    notificationState?.notifications,
    notificationState?.unreadNotifications,
  ]);

  if (isLoading) {
    return <NotificationBellState />;
  } else if (error && error.message !== "You have no notification") {
    return <NotificationBellState loading={false} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        {notificationData.unreadNotificationsCount >= 1 && (
          <small className="absolute -right-2 -top-3 bg-priYellow grid place-content-center w-5 h-5 text-xs font-medium rounded-full ">
            {notificationData.unreadNotificationsCount}
          </small>
        )}
        <Bell />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="md:w-[380px] w-[85dvw] p-4 h-full"
        sideOffset={10}
      >
        <div className="mb-1 flex items-center justify-between">
          <DropdownMenuLabel className="flex items-center gap-2 text-lg">
            Notifications <Bell className="w-4 h-4 text-emerald-600" />
          </DropdownMenuLabel>
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-[#C49600] text-sm"
            )}
            to={APP_ROUTES.NOTIFICATION}
          >
            View all <ChevronRight />
          </Link>
        </div>
        {/* <DropdownMenuSeparator /> */}
        <div className="h-full overflow-y-scroll max-h-[20rem] no-scrollbar">
          <>
            <AnimatePresence mode="sync">
              {notificationData.unreadNotifications.length >= 1 ? (
                notificationData?.unreadNotifications.map(
                  (notification: TNotification, idx: number) => {
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            ease: "easeInOut",
                            duration: 0.4,
                            delay: idx * 0.2,
                          },
                        }}
                        layout
                      >
                        <NotificationItem notification={notification} />
                      </motion.div>
                    );
                  }
                )
              ) : (
                <motion.div
                  variants={slideInLeft}
                  initial="hidden"
                  animate="show"
                  className="text-center py-4"
                >
                  <p className="text-slate-500 text-sm">No notifications</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;

const NotificationBellState = ({ loading = true }: { loading?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -right-2 -top-3 bg-priYellow grid place-content-center w-5 h-5 text-xs font-medium rounded-full ",
          !loading && "bg-red-500"
        )}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4 text-white" />
        )}
      </div>
      <Bell />
    </div>
  );
};
