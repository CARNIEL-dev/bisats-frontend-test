import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Delete_All_Notifications,
  Delete_Notification,
  Read_All_Notifications,
  Read_Notification,
  useFetchUserNotifications,
} from "@/redux/actions/generalActions";
import { UserState } from "@/redux/reducers/userSlice";
import { cn } from "@/utils";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { Bell, Check, Loader2, Trash, X } from "lucide-react";
import { useSelector } from "react-redux";

import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

dayjs.extend(relativeTime);

const nKey = (userId: string) => ["userNotifications", userId] as const;

type Action =
  | { type: "read"; id: string }
  | { type: "delete"; id: string }
  | { type: "readAll" }
  | { type: "deleteAll" };

type MutationData = {
  status: boolean;
  message?: string;
  data: Omit<NotificationState, "loading"> | null;
} | void;
type MutationCtx = { prev: TNotification[] };

const Notification = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingBulk, setPendingBulk] = useState<{
    readAll: boolean;
    deleteAll: boolean;
  }>({
    readAll: false,
    deleteAll: false,
  });

  const isItemLoading = (id: string, kind: "read" | "delete") => {
    const key = `${kind}:${id}`;
    console.log("Checking loading for:", key, pendingIds.has(key));
    return pendingIds.has(key);
  };

  const isReadAllLoading = pendingBulk.readAll;
  const isDeleteAllLoading = pendingBulk.deleteAll;

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

  const mutation = useMutation<MutationData, Error, Action>({
    mutationKey: ["notification-action", userId],
    mutationFn: async (vars) => {
      switch (vars.type) {
        case "read":
          return Read_Notification({ userId, notificationId: vars.id });

        case "delete":
          return Delete_Notification({ userId, notificationId: vars.id });

        case "readAll":
          return Read_All_Notifications({ userId });

        case "deleteAll":
          return Delete_All_Notifications({ userId });

        default:
          return Promise.resolve();
      }
    },

    // 🔵 optimistic update
    onMutate: async (vars) => {
      // set loading flags
      if ("id" in vars) {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.add(`${vars.type}:${vars.id}`);
          return next;
        });
      } else {
        setPendingBulk((b) => ({ ...b, [vars.type]: true }));
      }
      await queryClient.cancelQueries({ queryKey: nKey(userId) });
    },

    onError: () => {
      Toast.error("Operation failed", "Failed");
    },

    //? re-sync
    onSettled: (_res, _err, vars) => {
      if ("id" in vars) {
      } else {
        setPendingBulk((b) => ({ ...b, [vars.type]: false }));
      }
      queryClient.invalidateQueries({ queryKey: nKey(userId) });
    },
  });

  const notificationData = useMemo(() => {
    const hasNotifications = notificationState?.totalNotification >= 1;
    const notifications = notificationState?.notifications || [];

    return hasNotifications
      ? [...notifications].sort((a, b) => Number(a.read) - Number(b.read))
      : [];
  }, [notificationState?.notifications, notificationState?.totalNotification]);

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
        className="md:w-[380px] w-[85dvw] p-4 h-full"
        sideOffset={10}
      >
        <div className="mb-1">
          <DropdownMenuLabel className="flex items-center gap-2 text-lg">
            Notifications <Bell className="w-4 h-4 text-emerald-600" />
          </DropdownMenuLabel>
          <DropdownMenuLabel className="flex items-center font-normal gap-2">
            <span className="text-sm text-gray-500">All </span>
            {notificationState.unreadNotifications >= 1 && (
              <Button
                variant="ghost"
                size={"sm"}
                className={cn(
                  "text-xs rounded-full border border-green-200  size-8 hover:bg-green-500/10"
                )}
                onClick={() => {
                  mutation.mutate({ type: "readAll" });
                }}
                disabled={isReadAllLoading}
              >
                {isReadAllLoading ? (
                  <Loader2 className="text-green-600 animate-spin" />
                ) : (
                  <Check className="text-green-600" />
                )}
              </Button>
            )}
            {notificationState.totalNotification >= 1 && (
              <Button
                variant="ghost"
                size={"sm"}
                className={cn(
                  "text-xs rounded-full border border-red-200  size-8 hover:bg-red-500/10"
                )}
                onClick={() => {
                  mutation.mutate({ type: "deleteAll" });
                }}
                disabled={isDeleteAllLoading}
              >
                {isDeleteAllLoading ? (
                  <Loader2 className="text-red-600 animate-spin" />
                ) : (
                  <Trash className="text-red-600" />
                )}
              </Button>
            )}
            <div className="text-xs flex items-center gap-1 text-gray-500 ml-auto">
              <p>Total :</p>
              <p>{notificationState.totalNotification}</p>
            </div>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <div className="h-full overflow-y-scroll max-h-[23rem] no-scrollbar">
          <>
            <AnimatePresence mode="sync">
              {notificationData.length >= 1 ? (
                notificationData?.map(
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
                        exit={{
                          opacity: 0,
                          x: -80,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        layout
                      >
                        <NotificationItem
                          notification={notification}
                          userId={userId}
                          mutation={mutation}
                          loading={isItemLoading(notification.id, "read")}
                          isDeleting={isItemLoading(notification.id, "delete")}
                          disabled={isReadAllLoading || isDeleteAllLoading}
                        />
                      </motion.div>
                    );
                  }
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No notifications</p>
                </div>
              )}
            </AnimatePresence>
          </>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;

const NotificationItem = ({
  notification,
  mutation,
  disabled,
  loading,
  isDeleting,
}: {
  notification: TNotification;
  userId: string;
  mutation: UseMutationResult<MutationData, Error, Action>;
  disabled: boolean;
  loading: boolean;
  isDeleting: boolean;
}) => {
  return (
    <div
      className={cn(
        " px-2  border-b py-2  text-gray-500  my-3 first:mt-0",
        notification.read && "text-gray-300"
      )}
    >
      <div className="flex items-center gap-1">
        <div className="flex-1">
          {!notification.read && (
            <div className="flex items-center justify-between">
              <span className="text-green-500 text-[10px] font-normal ">
                New
              </span>
              <Button
                variant="ghost"
                size={"sm"}
                className={cn(
                  "text-xs rounded-full border border-green-200  size-8 text-slate-600 hover:bg-green-500/10"
                )}
                onClick={() => {
                  mutation.mutate({
                    type: "read",
                    id: notification.id,
                  });
                }}
                disabled={disabled || loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin text-green-600" />
                ) : (
                  <Check className="text-green-600" />
                )}
              </Button>
            </div>
          )}
        </div>
        <div>
          <Button
            variant={"ghost"}
            size={"sm"}
            className={cn(
              "hover:bg-red-500/10 border border-red-200 rounded-full size-8"
            )}
            disabled={disabled || isDeleting}
            onClick={() => {
              mutation.mutate({
                type: "delete",
                id: notification.id,
              });
            }}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin text-red-500" />
            ) : (
              <X className="text-red-500" />
            )}
          </Button>
        </div>
      </div>

      <div className="my-1.5">
        <div className="flex items-center justify-between">
          <h5
            className={cn(
              "text-[#2B313B] text-sm font-semibold leading-[24px]",
              notification.read && "text-gray-400"
            )}
          >
            {notification.title}
          </h5>
          <span className="text-[10px] font-medium capitalize">
            {dayjs(notification.createdAt).fromNow()}
          </span>
        </div>

        <p className=" text-xs">{notification.message}</p>
      </div>
    </div>
  );
};

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
