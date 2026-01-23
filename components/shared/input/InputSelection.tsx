import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";

interface Option {
  name: string;
  value: string;
}

interface InputSelectionProps {
  titleInput: string;
  options: string[] | Option[]; // Options for selection - can be string array or object array
  width: string;
  value?: string | null; // Current value selected
  onChange?: (value: string) => void; // Callback for handling value change
}

const InputSelection: React.FC<InputSelectionProps> = ({
  titleInput,
  options,
  width,
  value,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    value || null
  );
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Update selectedOption when value changes externally
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = () => {
    setShowOptions((prev) => !prev);
  };

  // Check if options are objects or strings
  const isObjectOptions = (opts: string[] | Option[]): opts is Option[] => {
    return opts.length > 0 && typeof opts[0] === "object" && "name" in opts[0] && "value" in opts[0];
  };

  const handleOptionSelect = (option: string | Option) => {
    const selectedValue = typeof option === "string" ? option : option.value;
    const displayValue = typeof option === "string" ? option : option.name;
    setSelectedOption(selectedValue);
    onChange?.(selectedValue);
    setShowOptions(false);
  };

  // Get display value for selected option
  const getDisplayValue = (): string => {
    if (!selectedOption) return "";
    if (isObjectOptions(options)) {
      const option = options.find((opt) => opt.value === selectedOption);
      return option?.name || "";
    }
    return selectedOption;
  };

  return (
    <div
      className={classNames(
        "flex flex-col gap-[8px] text-text-dark-500",
        width
      )}
    >
      <p className="text-text-dark-400">{titleInput}:</p>
      <div className="relative z-10">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          placeholder="Select an option"
          className="h-[34px] w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none cursor-pointer"
          onClick={handleDropdownClick}
          readOnly
        />
        <span
          onClick={handleDropdownClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dark-500 cursor-pointer z-10"
        >
          <Icon icon="uil:angle-down" className="text-2xl text-dark-500" />
        </span>

        {showOptions && (
          <div
            ref={dropdownRef}
            className={classNames(
              "absolute left-0 right-0 top-full mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl z-[10000] min-w-full max-h-60 overflow-auto"
            )}
          >
            <ul>
              {isObjectOptions(options)
                ? options.map((option, index) => (
                    <li
                      key={index}
                      className="px-6 py-1 text-gray-700 hover:bg-primary-100 hover:text-white rounded-lg cursor-pointer"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option.name}
                    </li>
                  ))
                : options.map((option, index) => (
                    <li
                      key={index}
                      className="px-6 py-1 text-gray-700 hover:bg-primary-100 hover:text-white rounded-lg cursor-pointer"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSelection;
