import { cn } from "@/utils";
import React from "react";

const SecurityBanner = ({
  text,
  alertType,
}: {
  text?: string;
  alertType?: "danger" | "default";
}) => {
  return (
    <div
      className={cn(
        "bg-[#F5FEF8] p-2 border border-[#DCFCE7] rounded-[8px] text-xs text-[#17A34A] w-full h-fit flex items-start",
        alertType === "danger" &&
          "bg-[#FEF2F2] border border-[#FED7D7] text-[#EF4444]"
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="w-[5%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9386 7.41288C13.9386 10.6729 11.5719 13.7262 8.3386 14.6195C8.1186 14.6795 7.87859 14.6795 7.65859 14.6195C4.42526 13.7262 2.05859 10.6729 2.05859 7.41288V4.4862C2.05859 3.93953 2.47194 3.31954 2.98527 3.11287L6.69859 1.59289C7.53192 1.25289 8.47192 1.25289 9.30526 1.59289L13.0186 3.11287C13.5253 3.31954 13.9453 3.93953 13.9453 4.4862L13.9386 7.41288Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.0013 8.33268C8.73768 8.33268 9.33464 7.73573 9.33464 6.99935C9.33464 6.26297 8.73768 5.66602 8.0013 5.66602C7.26492 5.66602 6.66797 6.26297 6.66797 6.99935C6.66797 7.73573 7.26492 8.33268 8.0013 8.33268Z"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 8.33203V10.332"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p className="w-[95%]">
        {text ||
          "We take your security seriously. All the information you provide is encrypted and protected using industry-leading security standards. Your details remain strictly confidential."}
      </p>
    </div>
  );
};

export default SecurityBanner;
