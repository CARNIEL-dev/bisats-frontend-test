/** @format */

import { getUserId } from "../../helpers";
import { BACKEND_URLS } from "../../utils/backendUrls";
import dispatchWrapper from "../../utils/dispatchWrapper";
import Bisatsfetch from "../fetchWrapper";
import { NotificationsActionypes } from "../types";

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


export const GetNotification = async () => {
  const uid=getUserId()
 
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${uid}/notification/get-notifications`,
      {
        method: "GET",
      }
    );
    const data = response.data;
    if (response.status) {
       dispatchWrapper({
              type: NotificationsActionypes.GET_NOTIFICATIONS,
              payload: data,
            });
      return data;
    } else {
    }
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};

export const Read_Notification = async (payload: {
  userId: string;
  notificationId
:string}) => {
  try {
    const response = await Bisatsfetch(
      `/api/v1/user/${payload.userId}/notification/${payload.notificationId}${BACKEND_URLS.READ_NOTIFICATION}`,
      {
        method: "PUT",
      }
    );
    const data = response.data;
    console.log(data);
    // dispatchWrapper({ type: GeneralTypes.SUCCESS, payload: data });

    return response;
  } catch (error) {
    // throw handleApiError(error);
    return error;
  }
};