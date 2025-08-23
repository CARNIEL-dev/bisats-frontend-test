import Label from "@/components/Inputs/Label";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import { countries } from "@/utils/data";
import { useMemo } from "react";
import Flag from "react-world-flags";

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
          <Label text={label} className="" />
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
