import MaxWidth from "@/components/shared/MaxWith";

import ErrorDisplay from "@/components/shared/ErrorDisplay";
import Toast from "@/components/Toast";
import PreLoader from "@/layouts/PreLoader";
import {
  Delete_All_Notifications,
  Delete_Notification,
  GetNotificationById,
  Read_All_Notifications,
  Read_Notification,
  useFetchUserNotifications,
} from "@/redux/actions/generalActions";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { slideInLeft } from "@/components/animation";
import NotificationItem from "@/components/shared/NotificationItem";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";
import { Check, Loader2, Trash, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

const NotificationsPage = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef<HTMLUListElement>(null);

  const id = searchParams.get("id") || "";

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

  const notifyId = useQuery({
    queryKey: ["notificationById", id],
    queryFn: async () => {
      const res = await GetNotificationById(userId, id);

      if (!res.read) {
        await mutation.mutate({
          type: "read",
          id: id,
        });
      }
      return res;
    },
    enabled: Boolean(id),
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
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(`${vars.type}:${vars.id}`);
          return next;
        });
      } else {
        setPendingBulk((b) => ({ ...b, [vars.type]: false }));
      }
      queryClient.invalidateQueries({ queryKey: nKey(userId) });
      queryClient.invalidateQueries({ queryKey: ["notificationById", id] });
      if (vars.type === "delete" || vars.type === "deleteAll") {
        setSearchParams({});
      }
    },
  });

  const notificationData = useMemo(() => {
    const hasNotifications = notificationState?.totalNotification >= 1;
    const notifications = notificationState?.notifications || [];

    return hasNotifications
      ? [...notifications].sort((a, b) => Number(a.read) - Number(b.read))
      : [];
  }, [notificationState?.notifications, notificationState?.totalNotification]);

  useEffect(() => {
    if (!id) return;

    // find the <li> whose data-id matches
    const li = listRef.current?.querySelector<HTMLLIElement>(
      `li[data-id="${id}"]`
    );
    if (li) {
      li.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [id]);

  return (
    <>
      <MaxWidth as="section" className="space-y-3 max-w-6xl lg:pb-5 mb-20 mt-6">
        <h2 className="font-semibold text-[28px] lg:text-[34px]">
          Notifications
        </h2>
        {isLoading ? (
          <div className=" grid h-[30rem] place-content-center">
            <PreLoader primary={false} />
          </div>
        ) : error ? (
          <div className="grid h-[30rem] place-content-center">
            <ErrorDisplay
              isError={false}
              showIcon={false}
              message={error.message || "Could not get notifications"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_1.6fr] gap-4 !h-[68dvh] ">
            <div>
              <div className="flex md:items-center flex-col-reverse md:flex-row md:justify-between py-4 border-b gap-y-2">
                <h5 className="text-sm text-gray-500">
                  <span>Total : </span>
                  <span>{notificationState?.totalNotification}</span>
                </h5>

                <div className="flex items-center gap-2">
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
                </div>
              </div>

              <ul
                className="overflow-y-scroll h-[65dvh]  no-scrollbar"
                ref={listRef}
              >
                <AnimatePresence mode="sync">
                  {notificationData.length >= 1 ? (
                    notificationData?.map(
                      (notification: TNotification, idx: number) => {
                        return (
                          <motion.li
                            key={notification.id}
                            data-id={notification.id}
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
                            role="button"
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                            className={cn(
                              id === notification.id
                                ? "border border-green-600 rounded-md"
                                : ""
                            )}
                            onClick={() => {
                              if (id === notification.id) {
                                setSearchParams({});
                              } else {
                                setSearchParams({ id: notification.id });
                              }
                            }}
                          >
                            <NotificationItem
                              notification={notification}
                              showMessage={false}
                            />
                          </motion.li>
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
              </ul>
            </div>
            <div className="bg-neutral-50 border p-4 rounded-md h-full">
              {notifyId.isLoading ? (
                <div className="grid h-full place-content-center">
                  <PreLoader primary={false} />
                </div>
              ) : notifyId.isError ? (
                <ErrorDisplay
                  isError={true}
                  showIcon={false}
                  message={
                    notifyId.error.message || "Could not get notification"
                  }
                />
              ) : (
                notifyId.data && (
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-4 md:justify-between border-b pb-4">
                      <h3 className="text-lg font-semibold">
                        {notifyId.data?.title}
                      </h3>
                      <p className="text-gray-500 text-xs capitalize">
                        {dayjs(notifyId.data?.createdAt).fromNow()}
                      </p>
                      <div className="flex items-center gap-2">
                        {!notifyId.data.read && (
                          <Button
                            variant="ghost"
                            size={"sm"}
                            className={cn(
                              "text-xs rounded-full border border-green-200  size-8 text-slate-600 hover:bg-green-500/10"
                            )}
                            onClick={() => {
                              mutation.mutate({
                                type: "read",
                                id: id,
                              });
                            }}
                            disabled={isItemLoading(id, "read")}
                          >
                            {isItemLoading(id, "read") ? (
                              <Loader2 className="animate-spin text-green-600" />
                            ) : (
                              <Check className="text-green-600" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className={cn(
                            "hover:bg-red-500/10 border border-red-200 rounded-full size-8"
                          )}
                          disabled={isItemLoading(id, "delete")}
                          onClick={() => {
                            mutation.mutate({
                              type: "delete",
                              id: id,
                            });
                          }}
                        >
                          {isItemLoading(id, "delete") ? (
                            <Loader2 className="animate-spin text-red-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {notifyId.data?.message}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </MaxWidth>
    </>
  );
};

export default NotificationsPage;

/* 
HDR: NEW
 


     HDR: DELETE
         


     HDR: READ ALL
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


HDR: DELETE ALL
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

*/
