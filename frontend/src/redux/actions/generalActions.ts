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

    if (!response.status) {
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
    retry: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(userId && isKycVerified),
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
};

export const Read_Notification = async (payload: {
  userId: string;
  notificationId: string;
}) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/notification/${payload.notificationId}${BACKEND_URLS.READ_NOTIFICATION}`,
      {
        method: "PUT",
      }
    );
    // const data = response.data;
    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export { useFetchUserNotifications };
