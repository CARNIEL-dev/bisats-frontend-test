/** @format */

import { BACKEND_URLS } from "@/utils/backendUrls";
import { useQuery } from "@tanstack/react-query";
import Bisatsfetch from "../fetchWrapper";

export const handleCopy = async (
  text: string
): Promise<{ status: boolean; message: string }> => {
  try {
    await navigator.clipboard.writeText(text);

    return { status: true, message: "Copied to clipboard" };
  } catch (err) {
    return { status: false, message: "Unable to copy" };
  }
};

export const GetNotification = async (uid: string) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${uid}/notification/get-notifications`,
      {
        method: "GET",
      }
    );

    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    // console.log("error notification catch", error);
    throw error;
    // return error;
  }
};
export const GetNotificationById = async (
  uid: string,
  notificationId: string
) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${uid}/notification/${notificationId}/get-notification-by-id`,
      {
        method: "GET",
      }
    );

    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    // console.log("error notification catch", error);
    throw error;
    // return error;
  }
};

const useFetchUserNotifications = ({
  userId,
  isKycVerified,
}: {
  userId: string;
  isKycVerified?: boolean;
}) => {
  return useQuery<Omit<NotificationState, "loading">, Error>({
    queryKey: ["userNotifications", userId],
    queryFn: async () => GetNotification(userId),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(userId && isKycVerified),
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
};

const Read_Notification = async (payload: {
  userId: string;
  notificationId: string;
}) => {
  const res = await Bisatsfetch(
    `/api/v1/user/${payload.userId}/notification/${payload.notificationId}${BACKEND_URLS.READ_NOTIFICATION}`,
    { method: "PUT" }
  );
  if (!res?.status) {
    throw new Error(res?.message || "Failed to mark notification as read");
  }
  return res;
};

const Delete_Notification = async (payload: {
  userId: string;
  notificationId: string;
}) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/notification/${payload.notificationId}${BACKEND_URLS.DELETE_NOTIFICATION}`,
      {
        method: "DELETE",
      }
    );
    if (!response.status) {
      throw new Error(response.message);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
const Read_All_Notifications = async (payload: { userId: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/notification${BACKEND_URLS.READ_ALL_NOTIFICATION}`,
      {
        method: "PUT",
      }
    );
    if (!response.status) {
      throw new Error(response.message);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
const Delete_All_Notifications = async (payload: { userId: string }) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/notification${BACKEND_URLS.DELETE_ALL_NOTIFICATION}`,
      {
        method: "DELETE",
      }
    );
    if (!response.status) {
      throw new Error(response.message);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export {
  useFetchUserNotifications,
  Read_Notification,
  Delete_Notification,
  Read_All_Notifications,
  Delete_All_Notifications,
};
