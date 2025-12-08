import { FailCheck, PassCheck } from "@/assets/icons";
import Label from "@/components/Inputs/Label";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/utils";
import {
  characterLength,
  CheckRegex,
  lowerCaseRegex,
  numberRegex,
  specialCharcterRegex,
  upperCaseRegex,
} from "@/utils/passwordChecks";
import { Eye, EyeOff } from "lucide-react";
import React, { InputHTMLAttributes, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  check: boolean;
  text: string;
  error?: string | undefined | null;
  touched?: boolean | undefined;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordChecks = [
  {
    title: "characterLength",
    check: "8 - 30 Characters",
  },
  {
    title: "upperCaseRegex",
    check: "At least one uppercase character",
  },
  {
    title: "lowerCaseRegex",
    check: "At least one lowercase character",
  },
  {
    title: "numberRegex",
    check: "At least one number",
  },
  {
    title: "specialCharcterRegex",
    check: "At least one symbol",
  },
];
const AuthPasswordInput: React.FC<TInput> = ({
  className,
  handleChange,
  text,
  check,
  error,
  touched,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordString, setPasswordString] = useState("");

  // --- Start Reveal Handlers ---
  const handleStartReveal = (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
  ) => {
    // Prevent default actions like form submission when using Enter key
    e.preventDefault();
    setShowPassword(true);
  };

  // --- End Reveal Handlers ---
  const handleEndReveal = () => {
    setShowPassword(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check for the Enter key press
    if (e.key === "Enter") {
      handleStartReveal(e);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    // Check for the Enter key release
    if (e.key === "Enter") {
      handleEndReveal();
    }
  };

  return (
    <div className=" py-2 w-full">
      <div className="w-full  ">
        <div className="mb-2">
          <Label text={text} className="" />
        </div>
        <div className="relative">
          <input
            style={{ outline: "none" }}
            type={showPassword ? "text" : "password"}
            className={cn(
              "rounded-[6px] border border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82] p-3 ring-0 w-full",
              className,
              error && "border-[#EF4444] outline-0 focus:border-[#EF4444]"
            )}
            {...props}
            onChange={(e) => {
              handleChange(e);
              setPasswordString(e.target.value);
            }}
            autoComplete="off"
          />
          <Tooltip>
            <TooltipTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "absolute right-3 top-1/2 -translate-y-1/2 !p-2 text-neutral-500"
              )}
              type="button"
              // --- MOUSE & TOUCH HANDLERS (Click and Hold) ---
              onMouseDown={handleStartReveal}
              onMouseUp={handleEndReveal}
              onMouseLeave={handleEndReveal}
              onTouchStart={handleStartReveal}
              onTouchEnd={handleEndReveal}
              // --- KEYBOARD HANDLERS (Focus and Hold Enter) ---
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            >
              {!showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[8rem]" align="end">
              <p>Click and hold to reveal password</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {check && passwordString && (
        <div className="text-[#515B6E] text-[12px] leading-[16px] font-normal flex justify-between flex-wrap mt-5">
          {PasswordChecks.map((item, idx) => (
            <div className="flex items-center w-full lg:w-1/2 my-1" key={idx}>
              {CheckRegex(
                passwordString,
                item?.title === "characterLength"
                  ? characterLength
                  : item?.title === "upperCaseRegex"
                  ? upperCaseRegex
                  : item?.title === "lowerCaseRegex"
                  ? lowerCaseRegex
                  : item?.title === "numberRegex"
                  ? numberRegex
                  : specialCharcterRegex
              ) ? (
                <PassCheck />
              ) : (
                <FailCheck />
              )}
              <p className="ml-2">{item?.check}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AuthPasswordInput;
