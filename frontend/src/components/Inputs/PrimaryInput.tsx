import { cn } from "@/utils";
import { Loader } from "lucide-react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: string | undefined | null | boolean;
  touched: boolean | undefined;
  info?: string;
  format?: boolean;
  maxFnc?: () => void;
  loading?: boolean;
  maxText?: string;
}

const resolveValue = (
  val: InputHTMLAttributes<HTMLInputElement>["value"]
): string => {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) {
    return val[0] ?? "";
  }

  return String(val);
};

const sanitizeNumberString = (value: string): string => {
  if (!value) return "";

  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const firstDot = cleaned.indexOf(".");
  const integerRaw =
    firstDot === -1 ? cleaned : cleaned.slice(0, firstDot).replace(/[.]/g, "");
  const decimalRaw =
    firstDot === -1 ? "" : cleaned.slice(firstDot + 1).replace(/[.]/g, "");

  let integerPart =
    integerRaw.length > 1 ? integerRaw.replace(/^0+(?=\d)/, "") : integerRaw;

  if (integerPart === "" && cleaned.startsWith("0") && decimalRaw.length > 0) {
    integerPart = "0";
  }

  if (firstDot === 0) {
    integerPart = "";
  }

  if (integerPart === "" && !decimalRaw && cleaned.startsWith("0")) {
    integerPart = "0";
  }

  let normalized = integerPart;

  if (decimalRaw.length > 0) {
    normalized = integerPart
      ? `${integerPart}.${decimalRaw}`
      : `.${decimalRaw}`;
  }

  if (firstDot !== -1 && cleaned.endsWith(".")) {
    normalized = integerPart ? `${integerPart}.` : ".";
  }

  return normalized;
};

const formatNumberDisplay = (value: string): string => {
  if (!value) return "";

  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  if (decimalPart !== undefined) {
    return decimalPart === ""
      ? `${formattedInteger}.`
      : `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
};

const buildSyntheticEvent = (
  event: ChangeEvent<HTMLInputElement>,
  nextValue: string
): ChangeEvent<HTMLInputElement> => {
  const numericValue =
    nextValue === "" || nextValue === "." ? NaN : Number(nextValue);

  const originalTarget = event.target as HTMLInputElement;
  const originalCurrentTarget = event.currentTarget as HTMLInputElement;

  const target = {
    ...originalTarget,
    value: nextValue,
    valueAsNumber: numericValue,
    dataset: {
      ...originalTarget.dataset,
      rawValue: nextValue,
    },
  } as EventTarget & HTMLInputElement;
  Object.setPrototypeOf(target, Object.getPrototypeOf(originalTarget));

  const currentTarget = {
    ...originalCurrentTarget,
    value: nextValue,
    valueAsNumber: numericValue,
  } as EventTarget & HTMLInputElement;
  Object.setPrototypeOf(
    currentTarget,
    Object.getPrototypeOf(originalCurrentTarget)
  );

  const syntheticEvent = {
    ...event,
    target,
    currentTarget,
  };

  Object.setPrototypeOf(syntheticEvent, Object.getPrototypeOf(event));

  return syntheticEvent as ChangeEvent<HTMLInputElement>;
};

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
  ...props
}) => {
  const {
    onChange,
    value,
    defaultValue,
    type = "text",
    inputMode,
    style,
    ...inputProps
  } = props;

  const initialRaw = format
    ? sanitizeNumberString(resolveValue(value ?? defaultValue))
    : "";

  const [rawValue, setRawValue] = useState(initialRaw);
  const [formattedValue, setFormattedValue] = useState(
    format ? formatNumberDisplay(initialRaw) : ""
  );

  useEffect(() => {
    if (!format) return;

    const nextRaw = sanitizeNumberString(resolveValue(value ?? defaultValue));
    const nextFormatted = formatNumberDisplay(nextRaw);

    setRawValue((prev) => (prev === nextRaw ? prev : nextRaw));
    setFormattedValue((prev) =>
      prev === nextFormatted ? prev : nextFormatted
    );
  }, [defaultValue, format, value]);

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

  const mergedStyle = { outline: "none", ...style };

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
      <div className="relative w-full">
        <input
          {...inputProps}
          type={format ? "text" : type ?? "text"}
          inputMode={format ? inputMode ?? "decimal" : inputMode}
          style={mergedStyle}
          className={cn(
            `rounded-sm placeholder:text-sm text-base font-normal border border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] w-full text-[#606C82]  p-2.5 no-spinner  px-3 `,
            error && "border-[#EF4444] outline-0 focus:border-[#EF4444] ",
            className
          )}
          data-raw-value={format ? rawValue : undefined}
          {...(format
            ? { value: formattedValue, onChange: handleFormattedChange }
            : {
                onChange,
                ...(value !== undefined
                  ? { value }
                  : defaultValue !== undefined
                  ? { defaultValue }
                  : {}),
              })}
        />
        {loading && (
          <p className="text-sm  absolute right-5 top-1/2 -translate-y-1/2">
            <Loader className="animate-spin text-gray-400" />
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className="text-red-500 text-xs">{error}</span>

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
          <small className="text-[#606C82] text-xs text-left">{info}</small>
        </div>
      )}
    </div>
  );
};

export default PrimaryInput;
