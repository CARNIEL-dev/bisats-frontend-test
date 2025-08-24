/** @format */
import Label from "@/components/Inputs/Label";
import { buttonVariants } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import dayjs from "dayjs";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

export interface DateInputProps {
  title?: string;
  label?: string;
  name: string;
  error?: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
  value?: string;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  title,
  label,
  name,
  error,
  handleChange,
  value,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const onSelect = (selected: Date | undefined) => {
    setDate(selected);
    setOpen(false);
    handleChange({
      target: { name, value: selected && dayjs(selected).format("YYYY-MM-DD") },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label text={label} className="" />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center text-sm justify-between bg-neutral-100 font-medium text-gray-600 h-12 ",
            error && "!border-red-500"
          )}
          disabled={disabled}
        >
          {date ? date.toLocaleDateString() : title || "Select date"}
          <ChevronsUpDown className="opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="overflow-hidden p-0" align="start">
          <Calendar
            className="w-full"
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={onSelect}
            disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
          />
        </PopoverContent>
      </Popover>

      {/* keep a hidden input so Formik "sees" the value */}
      <input type="hidden" name={name} value={date ? date.toISOString() : ""} />

      {error && <p className=" text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DateInput;
