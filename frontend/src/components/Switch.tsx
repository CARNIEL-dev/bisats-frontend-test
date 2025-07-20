interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
}: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
				relative inline-flex h-[16px] w-[30px] shrink-0 cursor-pointer rounded-full border-2 border-transparent 
				transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 
				focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
				disabled:opacity-50 ${checked ? "bg-[#22C55D]" : "bg-[#ADB5C3]"} ${className}
		`}
    >
      <span
        className={`
					pointer-events-none inline-block h-[13px] w-[13px] transform rounded-full bg-white shadow-lg 
					ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-3" : "translate-x-0"
          }
				`}
      />
    </button>
  );
};

export default Switch;
