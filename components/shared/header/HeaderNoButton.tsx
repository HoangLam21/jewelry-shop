import React from "react";
import MyButton from "../button/MyButton";

const HeaderNoButton = ({ title }: { title: string }) => {
  const noop = () => {}; // Hàm rỗng để tránh lỗi
  return (
    <div className="flex w-full  flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col ">
        <h1 className="text-[24px] font-medium  leading-[31.2px] text-headerTiltle ">
          {title}
        </h1>
        <p className="text-primary-100 font-medium text-[14px] hidden sm:block">
          Let's check your update today!
        </p>
      </div>
    </div>
  );
};

export default HeaderNoButton;
