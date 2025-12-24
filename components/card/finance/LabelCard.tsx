"use client";
import React from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { formatCurrency } from "@/lib/utils";

type LabelAnalyticsProps = {
  icon: string;
  title: string; // Title text
  value: number; // Numeric value
  width: string;
};
type Props = {
  param: LabelAnalyticsProps; // Truyền một đối tượng 'param' chứa tất cả các giá trị
};

const LabelAnalytics: React.FC<Props> = ({ param }) => {
  const { icon, title, value, width } = param;
  return (
    <div
      className={classNames(
        "flex flex-col justify-between h-[120px] w-auto border border-gray-300 rounded-lg drop-shadow p-4",
        width
      )}
      style={{
        borderWidth: "0.5px" // Adjust border width
      }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="text-2xl text-primary-100" />
        <h3 className="text-[16px]">{title}</h3>
      </div>

      {/* Value and Status */}
      <div className="mt-4">
        <p className="text-[24px] font-semibold">
          {formatCurrency(value)} {/* Explicit locale */}
        </p>
      </div>

      {/* Time Period */}
    </div>
  );
};

export default LabelAnalytics;