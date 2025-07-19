import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: { width: "414px" },
  icon: <></>,
};

// Base Toast Component
const BaseToast = ({ title, message }: { title: string; message: string }) => (
  <div className="-ml-[40px] ">
    <div className="text-[14px] leading-[24px]">
      <div className=" font-[600] text-[#001140]">{title}</div>
      <div className="text-[#606C82]">{message}</div>
    </div>
  </div>
);

const Toast = {
  success: (message: string, title: string) =>
    toast.success(
      <BaseToast title={title} message={message} />,
      defaultOptions
    ),

  warning: (message: string, title: string) =>
    toast.warning(
      <BaseToast title={title} message={message} />,
      defaultOptions
    ),
  error: (message: string, title: string) =>
    toast.error(<BaseToast title={title} message={message} />, defaultOptions),

  info: (message: string, title: string) =>
    toast.info(<BaseToast title={title} message={message} />, defaultOptions),
};

export default Toast;
