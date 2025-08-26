import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/Button";

interface TButtons extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text: string | React.ReactNode;
  loading: boolean;
  size?: "sm" | "md";
}
export const PrimaryButton: React.FC<TButtons> = ({
  className,
  text,
  loading,
  ...props
}) => {
  return (
    <button
      type={props.type || "submit"}
      disabled={loading}
      className={`flex justify-center items-center h-[48px] px-5 rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-[14px] leading-[24px] font-semibold text-center py-3 shadow-[0_0_0.8px_#000] whitespace-nowrap hover:bg-primary/80 duration-300 ease gap-2 transition-all ${
        props.disabled ? "bg-primary/40 pointer-events-none text-gray-500" : ""
      } ${className}`}
      {...props}
      aria-disabled={props.disabled}
    >
      {loading ? <Loader2 className="animate-spin size-6" /> : text}
    </button>
  );
};

export const RedTransparentButton: React.FC<TButtons> = ({
  className,
  text,
  loading,
  ...props
}) => {
  return (
    <button
      type="submit"
      className={`h-[48px] rounded-[6px] bg-transparent text-[#DC2625] text-[14px] leading-[24px] font-semibold text-center py-3 `}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin size-6" /> : text}
    </button>
  );
};

export const WhiteTransparentButton: React.FC<TButtons> = ({
  size,
  className,
  text,
  loading,
  ...props
}) => {
  return (
    <Button
      variant={"outline"}
      type="submit"
      className={cn(
        "bg-transparent text-[#525C76] hover:text-[#525C76]/90",
        size === "sm"
          ? "h-[32px] text-[12px] py-0.5 px-3"
          : "h-[48px] text-[14px] py-3",
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin size-6" /> : text}
    </Button>
  );
};
