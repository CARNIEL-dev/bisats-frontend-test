import { InputHTMLAttributes, useState } from "react";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  css?: string;
  label: string;
  error: string | undefined | null | boolean;
  touched: boolean | undefined;
  info?: string;
  format?: boolean;
  maxFnc?: () => void;
}
const PrimaryInput: React.FC<TInput> = ({
  css,
  label,
  error,
  touched,
  info,
  maxFnc,
  onBlur,
  onFocus,
  format,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  function formatNumberInput(value: string): string {
    if (!value) return "";
    const [integer, decimal] = value.split(".");
    const formatted = Number(integer.replace(/,/g, "")).toLocaleString();
    return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
  }

  return (
    <div className="w-full flex flex-col gap-1.5 ">
      <div className="">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-semibold text-[#606C82]  "
          >
            {label}
          </label>
        )}
      </div>
      <input
        type={props.type ?? "text"}
        style={{ outline: "none" }}
        className={`rounded-sm text-base font-normal border border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82]  p-2.5  px-3 ${css} ${
          error ? "border-[#EF4444] outline-0 focus:border-[#EF4444]" : ""
        }`}
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        value={
          format && typeof props.value === "string" && !isFocused
            ? formatNumberInput(props.value)
            : props.value
        }
      />

      <div className="flex items-center justify-between gap-1">
        <span className="text-red-500 text-xs">{error}</span>
        {info && (
          <div className="flex items-center mt-2 gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[25px] h-[25px] shrink-0"
            >
              <path
                d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z"
                stroke="#858FA5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 5.33301V8.66634"
                stroke="#858FA5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.99609 10.667H8.00208"
                stroke="#858FA5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <small className="text-[#606C82] text-xs text-left">{info}</small>
          </div>
        )}
        {maxFnc && (
          <button
            type="button"
            className="flex justify-end px-3 py-1 rounded-md  text-xs text-[#C49600] text-[12px w-fit ml-auto hover:bg-primary-light ease transition-all duration-300"
            onClick={() => maxFnc && maxFnc()}
          >
            {" "}
            Max{" "}
          </button>
        )}
      </div>
    </div>
  );
};
export default PrimaryInput;
