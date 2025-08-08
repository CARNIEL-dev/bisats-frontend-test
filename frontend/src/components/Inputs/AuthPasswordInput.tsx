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
import { FailCheck, PassCheck } from "@/assets/icons";
import { Button } from "@/components/ui/Button";
import Label from "@/components/Inputs/Label";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  check: boolean;
  text: string;
  error: string | undefined | null;
  touched: boolean | undefined;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}
const AuthPasswordInput: React.FC<TInput> = ({
  className,
  handleChange,
  text,
  check,
  error,
  touched,
  ...props
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordString, setPasswordString] = useState("");

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

  return (
    <div className=" py-2 w-full">
      <div className="w-full  ">
        <div className="mb-2">
          <Label text={text} className="" />
        </div>
        <div className="relative">
          <input
            style={{ outline: "none" }}
            type={passwordHidden ? "password" : "text"}
            className={`rounded-[6px] border border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82] p-1 ${className} ring-0 ${
              error && touched
                ? "border-[#EF4444] outline-0 focus:border-[#EF4444]"
                : ""
            }`}
            {...props}
            onChange={(e) => {
              handleChange(e);
              setPasswordString(e.target.value);
            }}
          />
          <Button
            variant="ghost"
            onClick={() => setPasswordHidden(!passwordHidden)}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 !p-2 text-neutral-500"
          >
            {passwordHidden ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </Button>
        </div>
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
