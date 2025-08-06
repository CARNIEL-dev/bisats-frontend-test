// import { useOutsideClick } from "@/hooks";
import { useMemo, useState } from "react";
import Label from "./Label";
import Flag from "react-world-flags";
import { countries } from "../../utils/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";
import SearchableDropdown from "@/components/shared/SearchableDropdown";

interface TCountrySelectProps {
  label: string;
  error: string | undefined | null;
  touched: boolean | undefined;
  handleChange: (prop: string) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  allCountries?: boolean;
}
export const CountrySelect = ({
  label,
  error,
  touched,
  placeholder,
  handleChange,
  value,
  disabled,
  allCountries,
}: TCountrySelectProps) => {
  const listOptions = useMemo(() => {
    return countries
      .slice(0, allCountries ? countries.length : 1)
      .map((country) => ({
        value: country.country,
        label: (
          <>
            <div className="flex items-center gap-2 w-full">
              {country.key && (
                <Flag
                  code={country.key}
                  style={{
                    width: "18px",
                    height: "20px",
                  }}
                />
              )}
              {country.country}
            </div>
          </>
        ),
      }));
  }, [allCountries]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} css="" />
        </div>
      )}

      <div>
        <SearchableDropdown
          items={listOptions}
          value={value}
          onChange={handleChange}
          align="start"
          placeholder={placeholder || "Select option"}
          inputPlaceholder="Search your country"
          error={Boolean(error)}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-2.5">{error}</p>}
    </div>
  );
};

const Test = ({
  label,
  error,
  touched,
  placeholder,
  handleChange,
  value,
  disabled,
  allCountries,
}: TCountrySelectProps) => {
  return (
    <Select
      onValueChange={(val) => {
        handleChange(val);
      }}
      defaultValue={value || ""}
      //   value={title || ""}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full ", error && "border-red-500")}>
        <SelectValue placeholder={placeholder || "Select option"} />
      </SelectTrigger>
      <SelectContent className="!w-full !max-h-[18rem] ">
        {[{ flag: "NG", value: "Nigeria" }].map((item, idx) => (
          <SelectItem key={idx} value={item.value}>
            <div className="flex items-center gap-2 w-full">
              {item.flag && (
                <Flag
                  code={item.flag}
                  style={{
                    width: "18px",
                    height: "20px",
                  }}
                />
              )}
              {item.value}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
