import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react'; // You can use any calendar icon

const DateTimePicker = ({ label, onChange }: { label: string, onChange: (timestamp: number) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            const timestamp = date.getTime(); // Unix timestamp
            onChange(timestamp);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">{label}</label>
            <div className="relative">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full p-3 pl-4 pr-10 rounded-xl bg-gray-100 text-gray-600 focus:outline-hidden"
                />
                <div className="absolute top-3 right-3 text-gray-500">
                    <Calendar size={20} />
                </div>
            </div>
        </div>
    );
};

export default DateTimePicker;
