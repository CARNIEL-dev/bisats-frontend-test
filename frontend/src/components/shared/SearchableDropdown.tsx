import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { buttonVariants } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePreventScroll from "@/hooks/use-preventScroll";
import { cn } from "@/utils";
import Label from "../Inputs/Label";

export interface SearchableDropdownItem {
  value: string;
  label: string | JSX.Element;
}

export interface SearchableDropdownProps {
  items: SearchableDropdownItem[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  widthClass?: string; // e.g. "w-[200px]" or "w-full"
  error?: boolean | string;
  align?: "center" | "end" | "start";
  inputPlaceholder?: string;
  disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = "Select…",
  inputPlaceholder = "Search…",
  label,
  widthClass = "md:w-[500px] w-[350px]",
  error,
  align = "center",
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);

  usePreventScroll(open);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <Label className="text-sm font-medium" text={label} />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center w-full text-sm justify-between bg-neutral-100 font-medium text-gray-600 h-12 ",
            error && "!border-red-500"
          )}
          disabled={disabled}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </PopoverTrigger>

        <PopoverContent align={align} className={cn("p-0", widthClass)}>
          <Command>
            <CommandInput
              placeholder={`${inputPlaceholder}`}
              className="h-9 outline-0"
              style={{ outline: "none" }}
            />
            <CommandList className="">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableDropdown;
