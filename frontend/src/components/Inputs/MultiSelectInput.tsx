// import { useOutsideClick } from "@/hooks";
import { useState } from "react";
import Label from "./Label";

interface IMultiSelectDropDownProps {
    parentId: string;
    title: string;
    choices: Array<{ value: string; label: string }> | [];
    label: string
}

export const MultiSelectDropDown = ({ parentId, title, choices, label }: IMultiSelectDropDownProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // const root = useOutsideClick(() => {
    //     setDropdownOpen(false);
    // });

    return (
        <div className="w-full relative">
            {label && (
                <div className="mb-5">
                    <Label text={label} css="" />
                </div>

            )}


            <button
                id={`${parentId}Btn`}
                data-dropdown-toggle={parentId}
                className="text-[#515B6E] p-2.5 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-full flex justify-between font-[600] text-[14px] leading-[24px]"
                type="button"
                onClick={toggleDropdown}
            >
                {/* <Typography.Text> */}

                {title}
                {/* </Typography.Text> */}

                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97 656Z" fill="#525C76" />
                </svg>

            </button>

            <div
                // ref={root}
                id={parentId}
                className={`absolute mt-2 z-10 transition-all duration-150 ease ${isDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
                    } bg-white rounded w-fit shadow`}
            >
                <ul
                    className="p-1 space-y-1 text-xs font-secondary h-[150px] overflow-y-scroll"
                    aria-labelledby={`${parentId}Btn`}
                >
                    {choices.map((choice, idx) => {
                        const { value, label } = choice;
                        return (
                            <li key={idx}>
                                <div className="flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        id={label}
                                        type="checkbox"
                                        value={value}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 accent-auxiliary rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor={label}
                                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded cursor-pointer"
                                    >
                                        {label}
                                    </label>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
