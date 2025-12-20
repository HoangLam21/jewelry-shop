import React from "react";
import classNames from "classnames";

interface InputEditProps {
  titleInput: string;
  width: string;
  height?: string;
  value?: string | number;
  name?: string;
}

const InputEdit = ({
  titleInput,
  width,
  value,
  name,
  height
}: InputEditProps) => {
  return (
    <div
      className={classNames(
        "flex flex-col gap-[8px] text-text-dark-500",
        width
      )}
    >
      <p className="text-text-dark-400">{titleInput}:</p>
      <input
        type="text"
        name={name} // Ensure each input has a unique name attribute
        className={classNames(
          "border border-border-color rounded-lg px-2 focus:outline-none focus:ring-0 cursor-default",
          height ? height : "h-[34px]",
          "text-start align-text-top"
        )}
        value={value} // Allow dynamic value binding
        disabled
      />
    </div>
  );
};

export default InputEdit;
