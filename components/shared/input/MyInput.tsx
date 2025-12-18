import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface MyInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  rounded?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  height?: string;
  textAlign?: string;
  fontFamily?: string;
  isShadow?: boolean;
  icon?: IconDefinition;
  color?: string;
  iconPosition?: "left" | "right";
}

const MyInput: React.FC<MyInputProps> = ({
  value,
  onChange,
  placeholder = "Enter text",
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  rounded = "rounded-lg",
  borderWidth = "border",
  borderColor = "border-gray-300",
  fontSize = "text-base",
  fontWeight = "font-normal",
  width = "w-full",
  height = "h-12",
  textAlign = "text-left",
  fontFamily = "font-sans",
  isShadow = false,
  icon,
  backgroundColor,
  iconPosition = "left",
  color = "text-black",
}) => {
  return (
    <div
      className={classNames(
        "relative", // To position the icon inside
        // padding,
        // paddingTop,
        // paddingBottom,
        // paddingLeft,
        // paddingRight,
        // borderWidth,
        borderColor,
        fontSize,
        fontWeight,
        textAlign,
        fontFamily,
        width,
        height,
        { "shadow-lg": isShadow },
        backgroundColor
      )}
    >
      {icon && iconPosition === "left" && (
        <FontAwesomeIcon
          icon={icon}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        />
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(
          "w-full h-full",
          rounded,
          fontSize,
          fontWeight,
          padding,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          textAlign,
          fontFamily,
          borderWidth,
          borderColor,
          backgroundColor,
          color,
          { "shadow-lg": isShadow }
        )}
      />
      {icon && iconPosition === "right" && (
        <FontAwesomeIcon
          icon={icon}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        />
      )}
    </div>
  );
};

export default MyInput;
