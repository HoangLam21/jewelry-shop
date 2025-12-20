"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import classNames from "classnames";

type MyButtonProps = {
  event?: () => void; // onClick event handler
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string; // Button title text
  icon?: string; // Icon to display with the button
  text_color?: string; // Text color
  border_color?: string; // Border color
  border_radius?: string; // Border radius for rounded corners
  background?: string; // Button background color
  width: string;
  height?: string;
  px?: string;
  py?: string;
  text?: string;
  rounded?: string;
};

const MyButton: React.FC<MyButtonProps> = ({
  event,
  onClick,
  title,
  icon,
  text_color = "text-primary-100",
  border_color = "border-primary-100",
  border_radius = "rounded-xl",
  background = "bg-white",
  width,
  height = "h-35px",
  px = "px-4",
  py = "py-[8px]",
  text = "text-[14px]",
  rounded = "none"
}) => {
  return (
    <div
      className={classNames(
        "flex justify-center items-center border shadow-md",
        border_color, // Border color
        background, // Background color
        border_radius,
        width,
        height,
        px,
        py, // Padding
        rounded
      )}
      style={{
        borderWidth: "0.5px" // Set border width if necessary
      }}
    >
      <button
        className={classNames(
          "flex items-center gap-[4px] rounded-lg",
          text,
          text_color // Apply dynamic text color class
        )}
        onClick={event || onClick}
        //fdprocessedid="8jupze"
      >
        {/* Conditionally render icon if it's provided */}
        {icon && <Icon icon={icon} className="text-[18px]" />}
        {title}
      </button>
    </div>
  );
};

export default MyButton;
