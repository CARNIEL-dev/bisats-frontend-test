import { cn } from "@/utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const NotificationItem = ({
  notification,
  showMessage = true,
}: {
  notification: TNotification;
  showMessage?: boolean;
}) => {
  return (
    <div
      className={cn(
        " px-2  border-t py-2  text-gray-500   ",
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
            </div>
          )}
        </div>
        <div></div>
      </div>

      <div className="my-1.5">
        <div className="flex md:items-center flex-col md:flex-row gap-2 md:justify-between">
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

        {showMessage && <p className=" text-xs">{notification.message}</p>}
      </div>
    </div>
  );
};

export default NotificationItem;
