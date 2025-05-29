/** @format */

import { NotificationsActionypes } from "../types";


export interface TNotification {
  createdAt: string;
  deviceToken: string;
  id: string;
  message: string;
  metadata: {};
  read: boolean;
  title: string;
  updatedAt: string;
  user: string;
  userId: string;
}
export interface NotificationState {
  notifications: TNotification[] | null;
  loading: boolean;
  totalNotification: number;
  unreadNotifications: number;
}

interface NotificationActionProp {
  type: string;
  payload: Record<string, any>;
}

const initialState: NotificationState = {
  notifications: null,
    loading: false,
    totalNotification: 0,
  unreadNotifications:0,
};

const notificationReducer = (state = initialState, action: NotificationActionProp) => {
  switch (action.type) {
    case NotificationsActionypes.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action?.payload?.notifications,
        totalNotification: action?.payload?.totalNotification,
        unreadNotifications: action?.payload?.unreadNotifications,
      };
    default:
      return state;
  }
};

export default notificationReducer;
