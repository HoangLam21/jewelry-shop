"use client";
import React from "react";

type LabelInformationProps = {
  title: string; // Title text for the account overview
  content: string; // Content or description
};

const LabelInformation: React.FC<LabelInformationProps> = ({
  title,
  content,
}) => {
  return (
    <div className="flex text-[16px] gap-[10px] items-center">
      <h3 className="">{title}:</h3>
      <p className="text-text-colo font-bold">{content}</p>
    </div>
  );
};

export default LabelInformation;
