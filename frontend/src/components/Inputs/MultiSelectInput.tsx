import useClickOutside from "@/hooks/use-clickOutside";
import usePreventScroll from "@/hooks/use-preventScroll";
import { cn } from "@/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Label from "./Label";

interface IMultiSelectDropDownProps {
  parentId?: string;
  title: string;
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
}

export const MultiSelectDropDown = ({
  parentId,
  title,
  choices = [],
  label,
  error,
  touched,
  handleChange,
  scrollHeight,
}: IMultiSelectDropDownProps) => {
  const { ref, visible, setVisible } = useClickOutside(false);

  const [selected, setSelected] = useState<string | React.ReactNode>("");
  usePreventScroll(visible);

  useEffect(() => {
    setSelected("");
  }, [choices]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} css="" />
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
            selected ? "text-black" : "text-muted-foreground"
          )}
          type="button"
          onClick={() => setVisible((prev) => !prev)}
        >
          <div className="truncate w-[100%] text-left">
            {selected ? selected : title}
          </div>

          <ChevronDown className="size-4" />
        </button>

        <div
          id={parentId}
          className={cn(
            `absolute mt-1 z-10 transition-all duration-150 ease
         bg-white rounded-md w-full shadow-md border `,
            visible
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-3 opacity-0"
          )}
        >
          <ul
            className={cn(
              `p-3 space-y-2 text-xs font-secondary h-fit w-full `,
              scrollHeight && "overflow-y-scroll max-h-[300px]"
            )}
            aria-labelledby={`${parentId}Btn`}
          >
            <>
              {choices && choices.length > 0 ? (
                choices.map((data, index) => (
                  <li
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
                <li className="text-center text-sm text-gray-500 py-4">
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
