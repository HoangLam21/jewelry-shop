"use client";
import React from "react";
import classNames from "classnames";

type LabelStatusProps = {
  title: string; // Text to display
  text_color: string; // Text color
  background: string; // Background color
  width?: string;
};

const LabelStatus: React.FC<LabelStatusProps> = ({
  title,
  text_color,
  background,
  width = "w-24",
}) => {
  return (
    <div
      className={classNames(
        "inline-flex items-center justify-center px-[8px] py-[4px] rounded-md",
        text_color,
        background,
        width
      )}
    >
      <span className="text-sm">{title}</span>
    </div>
  );
};

export default LabelStatus;
