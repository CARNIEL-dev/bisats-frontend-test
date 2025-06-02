// import { useOutsideClick } from "@/hooks";
import { useState } from "react";
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
	label: string;
	scrollHeight?: string;
	handleChange: (prop: string) => void;
}

export const MultiSelectDropDown = ({
	parentId,
	title,
	choices = [], // Default to empty array to prevent undefined
	label,
	error,
	touched,
	handleChange,
	scrollHeight,
	...props
}: IMultiSelectDropDownProps) => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [selected, setSelected] = useState<string | React.ReactNode>("");

	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

	// const root = useOutsideClick(() => {
	//     setDropdownOpen(false);
	// });

	return (
		<div className="w-full relative">
			{label && (
				<div className="mb-2">
					<Label text={label} css="" />
				</div>
			)}

			<button
				id={`${parentId}Btn`}
				data-dropdown-toggle={parentId}
				className={`text-[#515B6E] p-2.5 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] inline-flex items-center w-full justify-between font-[600] text-[14px] leading-[24px] ${
					error && touched
						? "border-[#EF4444] outline-0 focus:border-[#EF4444]"
						: ""
				}`}
				type="button"
				onClick={toggleDropdown}
			>
				{selected ? selected : title}

				<svg
					width="12"
					height="8"
					viewBox="0 0 12 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`transition-transform duration-200 ${
						isDropdownOpen ? "rotate-180" : ""
					}`}
				>
					<path
						d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
						fill="#525C76"
					/>
				</svg>
			</button>

			<div
				// ref={root}
				id={parentId}
				className={`absolute mt-2 z-10 transition-all duration-150 ease ${
					isDropdownOpen
						? "visible translate-y-0 opacity-100"
						: "invisible -translate-y-3 opacity-0"
				} bg-white rounded w-full shadow-lg border border-gray-200`}
			>
				<ul
					className={`p-1 space-y-1 text-xs font-secondary ${
						scrollHeight ? "h-[300px]" : "h-fit"
					} overflow-y-auto`}
					aria-labelledby={`${parentId}Btn`}
				>
					<div className="w-full gap-4 px-3">
						{choices && choices.length > 0 ? (
							choices.map((data, index) => (
								<div
									key={data.value || index} // Use data.value as key, fallback to index
									className="flex items-center my-2 cursor-pointer text-gray-700 bg-[#f5f5f5] hover:bg-[#EEEFF2] rounded-md transition-colors duration-150"
									onClick={() => {
										toggleDropdown();
										setSelected(data.labelDisplay ?? data?.label);
										handleChange(data.value);
									}}
								>
									<p className="mx-2 text-[14px] p-3">{data.label}</p>
								</div>
							))
						) : (
							<div className="flex items-center justify-center py-4">
								<p className="text-gray-500 text-sm">No options available</p>
							</div>
						)}
					</div>
				</ul>
			</div>

			{/* Error message */}
			{error && touched && (
				<div className="mt-1">
					<p className="text-[#EF4444] text-xs">{error}</p>
				</div>
			)}
		</div>
	);
};
