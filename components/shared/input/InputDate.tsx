"use client";
import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface InputDateProps {
  titleInput: string;
  width: string;
  value?: string; // Add value prop
  onChange?: (date: string) => void; // Optional onChange prop to update parent component
  position?: 0 | 1; // Vị trí lịch: 0 (bên dưới), 1 (bên trên)
}

const InputDate: React.FC<InputDateProps> = ({
  titleInput,
  width,
  value,
  onChange,
  position = 0,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Ensure that the client side handles the date after mounting
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value)); // Convert string value to Date object
    }
  }, [value]);

  const handleIconClick = () => {
    setShowCalendar((prev) => !prev); // Toggle calendar visibility
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(e.target as Node)
    ) {
      setShowCalendar(false); // Close calendar when clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log("data: ", date);
    if (onChange) {
      console.log("pick ", date?.toLocaleDateString());
      onChange(date?.toLocaleDateString()!); // Call onChange if provided
    }
  };

  return (
    <div className={classNames("flex flex-col gap-[8px]", width)}>
      <p>{titleInput}:</p>
      <div className="relative">
        {/* Displaying selected date in the input */}
        <input
          type="text"
          value={selectedDate ? selectedDate.toLocaleDateString() : ""}
          placeholder="Select a date"
          className="h-[34px] w-full border border-gray-300 rounded-lg px-3 text-gray-700 bg-white focus:outline-none"
          onClick={handleIconClick}
          readOnly // Set to readonly since DatePicker is handling input changes
          aria-label="Select a date"
        />
        <span
          onClick={handleIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          aria-label="Open calendar"
        >
          <Icon icon="uil:calender" className="text-2xl text-dark-500" />
        </span>

        {/* Calendar dropdown */}
        {showCalendar && (
          <div
            ref={calendarRef}
            className={classNames(
              "absolute w-[240px] h-[236px] rounded-lg border border-gray-300 shadow-lg z-50",
              {
                "top-full mt-4 ml-72": position === 0, // Hiển thị bên dưới
                "bottom-full mb-4": position === 1, // Hiển thị bên trên
              }
            )}
          >
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange} // DatePicker's onChange updates the selectedDate
              inline
              dateFormat="dd/MM/yyyy"
              aria-label="Date picker"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputDate;
