import { cn } from "@/utils";
import { Check, Loader } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PinInput } from "react-input-pin-code";
import {
  buildSyntheticEvent,
  formatNumberDisplay,
  resolveValue,
  sanitizeNumberString,
} from "@/helpers";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: string | undefined | null | boolean;
  touched: boolean | undefined;
  info?: string;
  format?: boolean;
  maxFnc?: () => void;
  loading?: boolean;
  maxText?: string;
  otpLength?: number;
  secretMode?: boolean;
  infoSuccess?: boolean;
  loadingLeft?: boolean;
}

const PrimaryInput: React.FC<TInput> = ({
  className,
  label,
  error,
  touched,
  info,
  loading,
  maxFnc,
  maxText,
  format,
  otpLength = 6,
  secretMode = true,
  infoSuccess,
  ...props
}) => {
  const {
    onChange,
    onBlur,
    value,
    defaultValue,
    type = "text",
    inputMode,
    style,
    name,
    loadingLeft,
    ...inputProps
  } = props;

  const initialRaw = format
    ? sanitizeNumberString(resolveValue(value ?? defaultValue))
    : "";

  const [rawValue, setRawValue] = useState(initialRaw);
  const [formattedValue, setFormattedValue] = useState(
    format ? formatNumberDisplay(initialRaw) : "",
  );

  useEffect(() => {
    if (!format) return;

    const nextRaw = sanitizeNumberString(resolveValue(value ?? defaultValue));
    const nextFormatted = formatNumberDisplay(nextRaw);

    // Always update to ensure sync with form values
    setRawValue(nextRaw);
    setFormattedValue(nextFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, defaultValue]);

  const handleFormattedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    const sanitized = sanitizeNumberString(rawInput);
    const formatted = formatNumberDisplay(sanitized);

    setRawValue(sanitized);
    setFormattedValue(formatted);

    if (onChange) {
      onChange(buildSyntheticEvent(event, sanitized));
    }
  };

  const handleOtpChange = (value: string) => {
    if (onChange && name) {
      // Create a proper synthetic event for Formik
      const syntheticEvent = {
        target: {
          name,
          value,
          type: "text",
        },
        currentTarget: {
          name,
          value,
          type: "text",
        },
      } as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  const handleOtpBlur = () => {
    if (onBlur && name) {
      // Create a proper synthetic blur event for Formik
      const syntheticEvent = {
        target: {
          name,
          value: value || "",
        },
        currentTarget: {
          name,
          value: value || "",
        },
      } as React.FocusEvent<HTMLInputElement>;

      onBlur(syntheticEvent);
    }
  };

  const mergedStyle = { outline: "none", ...style };

  // Helper function to get values array from value or defaultValue
  const getPinValues = () => {
    const val = resolveValue(value ?? defaultValue);
    if (!val) return Array(otpLength).fill("");

    const strVal = String(val);
    // Ensure we have exactly otpLength items, padding with empty strings if needed
    const arr = strVal.split("");
    return Array.from({ length: otpLength }, (_, i) => arr[i] || "");
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-1.5 ",
        type === "code" && className && className,
      )}
    >
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
      <div className="relative w-full">
        {type === "code" ? (
          <InputOTP
            maxLength={otpLength}
            value={String(value || "")}
            onChange={handleOtpChange}
            onBlur={handleOtpBlur}
            name={name}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              {Array.from({ length: otpLength }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        ) : type === "pin" ? (
          <>
            <PinInput
              values={getPinValues()}
              onChange={(value, index, values) =>
                handleOtpChange(values.join(""))
              }
              onBlur={handleOtpBlur}
              mask={secretMode}
              type="number"
              inputMode="numeric"
              size="lg"
              placeholder=""
              inputStyle={{
                border: "1px solid #D6DAE1",
                borderColor: error ? "#EF4444" : "#D6DAE1",
                borderRadius: "100%",
                padding: "10px",
                margin: "2px",
                fontSize: "22px",
              }}
            />
          </>
        ) : (
          <input
            {...inputProps}
            name={name}
            type={format ? "text" : (type ?? "text")}
            inputMode={format ? (inputMode ?? "decimal") : inputMode}
            style={mergedStyle}
            className={cn(
              `rounded-sm placeholder:text-sm text-base font-normal border border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] w-full text-[#606C82]  p-2.5 no-spinner  px-3 `,
              error && "border-[#EF4444] outline-0 focus:border-[#EF4444] ",
              className,
            )}
            data-raw-value={format ? rawValue : undefined}
            {...(format
              ? {
                  value: formattedValue,
                  onChange: handleFormattedChange,
                  onBlur,
                }
              : {
                  onChange,
                  onBlur,
                  ...(value !== undefined
                    ? { value }
                    : defaultValue !== undefined
                      ? { defaultValue }
                      : {}),
                })}
          />
        )}
        {loading && (
          <p
            className={cn(
              "text-sm  absolute right-5 top-1/2 -translate-y-1/2",
              loadingLeft && "left-5 right-auto",
            )}
          >
            <Loader className="animate-spin text-gray-400" />
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex items-center  gap-1",
          type === "pin" ? "justify-center" : "justify-between",
        )}
      >
        <span className="text-red-500 text-xs ">{error}</span>

        {maxFnc && (
          <button
            type="button"
            className="flex justify-end px-3 py-1 rounded-md  text-xs text-[#C49600] text-[12px w-fit ml-auto hover:bg-primary-light ease transition-all duration-300"
            onClick={() => maxFnc && maxFnc()}
          >
            {maxText || "Max"}
          </button>
        )}
      </div>
      {info && (
        <div className="flex items-center gap-1">
          {infoSuccess ? (
            <span className="size-4 grid place-content-center bg-green-600 rounded-full text-white ">
              <Check className="size-3" />
            </span>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z"
                stroke="#858FA5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.33301V8.66634"
                stroke="#858FA5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.99609 10.667H8.00208"
                stroke="#858FA5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <small
            className={cn(
              "text-[#606C82] text-xs text-left",
              infoSuccess && "text-green-600 font-semibold text-sm",
            )}
          >
            {info}
          </small>
        </div>
      )}
    </div>
  );
};

export default PrimaryInput;
