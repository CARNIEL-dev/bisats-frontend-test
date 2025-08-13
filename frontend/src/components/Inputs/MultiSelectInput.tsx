import Label from "@/components/Inputs/Label";
import useClickOutside from "@/hooks/use-clickOutside";
import usePreventScroll from "@/hooks/use-preventScroll";
import { cn } from "@/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IMultiSelectDropDownProps {
  parentId?: string;
  choices:
    | Array<{
        value: string;
        label: string | React.ReactNode;
        labelDisplay?: string | React.ReactNode;
      }>
    | [];
  error: string | undefined | null;
  touched: boolean | undefined;
  label?: string;
  scrollHeight?: string;
  handleChange: (prop: string) => void;
  value?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  defaultLabelDisplay?: boolean;
}

export const MultiSelectDropDown = ({
  parentId,

  choices = [],
  label,
  error,
  touched,
  handleChange,
  scrollHeight,
  value,
  placeholder,
  className,
  defaultLabelDisplay,
}: IMultiSelectDropDownProps) => {
  const { ref, visible, setVisible } = useClickOutside(false);

  const [selected, setSelected] = useState<string | React.ReactNode>(
    value || ""
  );
  usePreventScroll(visible);

  useEffect(() => {
    if (!defaultLabelDisplay) {
      setSelected(String(value ?? ""));
    }
  }, [value]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} className="" />
        </div>
      )}

      <div className="w-full relative" ref={ref}>
        <button
          id={`${parentId}Btn`}
          data-dropdown-toggle={parentId}
          className={cn(
            " py-2.5 px-3  bg-neutral-100 border border-input h-[48px] rounded-[8px] flex items-center w-full justify-between  text-sm  font-normal capitalize gap-2 ",
            {
              "border-[#EF4444] outline-0 focus:border-[#EF4444]":
                error && touched,
            },
            selected ? "text-black" : "text-muted-foreground",
            className
          )}
          type="button"
          onClick={() => setVisible((prev) => !prev)}
        >
          <div className="truncate w-full text-left">
            {selected ? selected : placeholder}
          </div>

          <ChevronDown className="size-4" />
        </button>

        <div
          id={parentId}
          className={cn(
            `absolute mt-1 z-10 transition-all duration-150 ease
         bg-white rounded-md w-full shadow-md border `,
            visible
              ? "visible animate-in fade-in-0  slide-in-from-top-4 opacity-100"
              : "invisible animate-out fade-in-0 slide-out-to-top-0"
          )}
        >
          <ul
            className={cn(
              `p-2 space-y-1 text-xs font-secondary h-fit w-full `,
              scrollHeight && "overflow-y-scroll max-h-[300px]"
            )}
            aria-labelledby={`${parentId}Btn`}
          >
            <>
              {choices && choices.length > 0 ? (
                choices.map((data, index) => (
                  <li
                    role="button"
                    key={data.value || index}
                    className={cn(
                      "flex items-center text-sm px-2 py-2 cursor-pointer text-gray-700  hover:bg-neutral-100 rounded-md transition-colors duration-150 capitalize",
                      selected === (data.labelDisplay ?? data.label) &&
                        "bg-neutral-200/40"
                    )}
                    onClick={() => {
                      setVisible(false);
                      setSelected(data.labelDisplay ?? data?.label);
                      handleChange(data.value);
                    }}
                  >
                    <div>{data.label}</div>
                    {selected === (data.labelDisplay ?? data.label) && (
                      <Check className="ml-auto size-4" />
                    )}
                  </li>
                ))
              ) : (
                <li className="text-center text-xs text-wrap text-gray-500 py-4 px-2">
                  No options available
                </li>
              )}
            </>
          </ul>
        </div>
      </div>

      {/* SUB: Error message */}
      {error && touched && (
        <div className="mt-1">
          <p className="text-[#EF4444] text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

type SelectDropDownProps = {
  options: { value: string; label: string | React.ReactNode }[];
  // value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};
export const SelectDropDown = ({
  onChange,
  options,
  label,
  disabled,
  error,
  placeholder,
  className,
  defaultValue,
}: SelectDropDownProps) => {
  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} className="" />
        </div>
      )}

      <div>
        <Select
          onValueChange={onChange}
          defaultValue={defaultValue}
          // value={value}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn("w-full", error && "border-red-500", className)}
          >
            <SelectValue placeholder={placeholder || "Select option"} />
          </SelectTrigger>
          <SelectContent className="!w-full">
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2 w-full">
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500 text-xs mt-2.5">{error}</p>}
    </div>
  );
};
