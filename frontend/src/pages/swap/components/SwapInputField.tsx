/**
 * SwapInputField
 *
 * Reusable input field for the swap form.
 * Renders a numeric input with an optional token button or slot on the right.
 */

import PrimaryInput from "@/components/Inputs/PrimaryInput";
import React from "react";

export type SwapInputFieldProps = {
  label: string;
  id: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  maxFunc?: () => void;
  onFocus?: () => void;
  value: string;
  error: string | boolean | undefined | null;
  tokenData?: {
    logo: React.ReactElement;
    logoName: string;
  };
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

const SwapInputField = ({
  label,
  id,
  onChange,
  tokenData,
  maxFunc,
  value,
  onFocus,
  error,
  children,
  disabled = false,
  loading = false,
}: SwapInputFieldProps) => {
  return (
    <div className="relative h-32">
      <PrimaryInput
        className={"w-full h-[58px] no-spinner"}
        label={label}
        type="number"
        inputMode="decimal"
        error={error}
        id={id}
        touched={undefined}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        maxFnc={maxFunc ? maxFunc : undefined}
        disabled={disabled}
        loading={loading}
        loadingLeft
      />

      <div className="absolute right-1 top-1/2 -translate-y-[63%]">
        {tokenData && (
          <button
            className="text-gray-600 p-2.5 px-4 border cursor-default h-[48px] rounded-md items-center bg-neutral-100 flex justify-center gap-2 font-semibold text-sm"
            type="button"
          >
            <span className="shrink-0">{tokenData.logo}</span>
            <div>{tokenData.logoName}</div>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default SwapInputField;
