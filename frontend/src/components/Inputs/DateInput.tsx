import React, { useRef, useState } from "react";
import Label from "./Label";

interface TDateType {
    parentId?: string;
    title: string;
    label: string;
    name: string;
    error?: string | undefined | null,
    touched?: boolean | string| undefined
    handleChange: React.ChangeEventHandler<HTMLInputElement>

}

const DateInput = ({ parentId, title, label, touched, error, handleChange, name, ...props }: TDateType) => {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Function to trigger the date input click
    const openCalendar = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker(); // Programmatically trigger the date picker
        }
    };

    // Function to handle date selection
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value); // Update the state with the selected date
        handleChange(e)
    };
console.log(error,touched)
    return (
        <div className="w-full cursor-pointer">
            <div className="w-full relative cursor-pointer">
                {label && (
                    <div className="mb-2">
                        <Label text={label} css="" />
                    </div>
                )}
                <div className="relative w-full cursor-pointer "
                    onClick={openCalendar}
                >
                    {/* Hidden Date Input */}
                    <input
                        ref={dateInputRef}
                        type="date"
                        name={name}
                        className="absolute inset-0 w-full h-full opacity-0 appearance-none"
                        onChange={handleDateChange} // Handle date selection
                        {...props}

                    />

                    <div className={` cursor-pointer text-[#515B6E] p-3 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] inline-flex items-center w-full font-[600] text-[14px] leading-[24px] placeholder-[#515B6E] focus:outline-none  ${error && touched ? "border-[#EF4444] outline-0 focus:border-[#EF4444]" : ""}`}
                        onClick={openCalendar}
                    >
                        <span className="text-[#858FA5] text-[14px] leading-[24px]">
                            {selectedDate  || "Select date"}
                        </span>
                        <div
                            className="ml-auto cursor-pointer flex items-center"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className="cursor-pointer"
                            >
                                <path d="M6.66797 1.66602V4.16602" stroke="#606C82" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.332 1.66602V4.16602" stroke="#606C82" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.91797 7.57422H17.0846" stroke="#606C82" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.5 7.08268V14.166C17.5 16.666 16.25 18.3327 13.3333 18.3327H6.66667C3.75 18.3327 2.5 16.666 2.5 14.166V7.08268C2.5 4.58268 3.75 2.91602 6.66667 2.91602H13.3333C16.25 2.91602 17.5 4.58268 17.5 7.08268Z" stroke="#606C82" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0801 11.4167H13.0875" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0801 13.9167H13.0875" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99803 11.4167H10.0055" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99803 13.9167H10.0055" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91209 11.4167H6.91957" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91209 13.9167H6.91957" stroke="#606C82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* {error && touched ? <span className="text-[#EF4444] text-[12px]">Please select a date</span>:<></>} */}
        </div>
    );
};

export default DateInput;
