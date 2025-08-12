import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateAdStatusResponse } from "@/pages/p2p/MyAds";
import {
  Read_Notification,
  useFetchUserNotifications,
} from "@/redux/actions/generalActions";
import { UserState } from "@/redux/reducers/userSlice";
import { cn } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Bell, Check, Loader, Loader2, X } from "lucide-react";
import { useSelector } from "react-redux";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Notification = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const queryClient = useQueryClient();

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

  //HDR: Mutation function
  const mutation = useMutation<
    UpdateAdStatusResponse,
    Error,
    UpdateNotificationStatusVars
  >({
    mutationFn: ({ id }: UpdateNotificationStatusVars) =>
      Read_Notification({ userId, notificationId: id }),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["userNotifications", userId],
      });
    },
    onError(err) {
      console.error(err);
      Toast.error("Failed to mark as read", "Failed");
    },
  });

  if (isLoading) {
    return <NotificationBellState />;
  } else if (error) {
    return <NotificationBellState loading={false} />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        {notificationState && notificationState?.unreadNotifications >= 1 && (
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
            {notificationState && notificationState?.totalNotification >= 1 ? (
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
                            onClick={() =>
                              mutation.mutate({
                                id: notification.id,
                              })
                            }
                            disabled={
                              mutation.isPending &&
                              mutation.variables?.id === notification.id
                            }
                          >
                            {mutation.isPending &&
                            mutation.variables?.id === notification.id ? (
                              <Loader className="animate-spin" />
                            ) : (
                              <Check />
                            )}
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
