import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";

interface Option {
  name: string;
  value: number;
}

interface InputNumberSelectionProps {
  titleInput: string;
  options: Option[]; // Định nghĩa lại options là mảng các đối tượng Option
  width: string;
  value?: number | null; // Giá trị hiện tại
  onChange?: (value: number) => void; // Callback khi thay đổi giá trị
}

const InputNumberSelection: React.FC<InputNumberSelectionProps> = ({
  titleInput,
  options,
  width,
  value,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    value || null
  );
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleOptionSelect = (option: { name: string; value: number }) => {
    setSelectedOption(option.value);
    onChange?.(option.value);
    setShowOptions(false);
  };

  return (
    <div className={`flex flex-col gap-2 text-text-dark-500 ${width}`}>
      <p>{titleInput}:</p>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={
            options.find((option) => option.value === selectedOption)?.name ||
            ""
          }
          placeholder="Select a voucher"
          className="h-[34px] w-full border px-3 bg-white cursor-pointer"
          onClick={() => setShowOptions((prev) => !prev)}
          readOnly
        />
        {showOptions && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full bg-white border mt-2 rounded shadow-lg"
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputNumberSelection;
