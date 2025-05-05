import React, { useRef, useState } from "react";
import Label from "./Label";

interface TTimeType {
    parentId?: string;
    title: string;
    label: string;
    name: string;
    error?: string | undefined | null;
    touched?: boolean | string | undefined;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const TimePicker = ({
    parentId,
    title,
    label,
    touched,
    error,
    handleChange,
    name,
    ...props
}: TTimeType) => {
    const timeInputRef = useRef<HTMLInputElement>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");

    const openTimePicker = () => {
        if (timeInputRef.current) {
            timeInputRef.current.showPicker();
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTime(e.target.value);
        handleChange(e);
    };

    return (
        <div className="w-full cursor-pointer">
            <div className="w-full relative cursor-pointer">
                {label && (
                    <div className="mb-2">
                        <Label text={label} css="" />
                    </div>
                )}
                <div className="relative w-full cursor-pointer" onClick={openTimePicker}>
                    <input
                        ref={timeInputRef}
                        type="time"
                        name={name}
                        className="absolute inset-0 w-full h-full opacity-0 appearance-none"
                        onChange={handleTimeChange}
                        {...props}
                    />

                    <div
                        className={`cursor-pointer text-[#515B6E] p-3 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] inline-flex items-center w-full font-[600] text-[14px] leading-[24px] placeholder-[#515B6E] focus:outline-none ${error && touched ? "border-[#EF4444]" : ""
                            }`}
                    >
                        <span className="text-[#858FA5] text-[14px] leading-[24px]">
                            {selectedTime  || "Select time"}
                        </span>

                        <div className="ml-auto cursor-pointer flex items-center">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 6V10L12.5 12.5"
                                    stroke="#606C82"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    stroke="#606C82"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
