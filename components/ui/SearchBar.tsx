import Image from "next/image";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
const SearchBar = ({
  placeHolder,
  width,
  height,
  padding,
  paddingX,
  paddingY,
  fontSize,
  borderRadius,
  searchQuery,
  setSearchQuery,
}: any) => {
  return (
    <div className={` flex items-center w-full ${borderRadius? borderRadius:"rounded-full"}  border-2`}>
      <Icon
        icon="solar:magnifer-linear"
        width={20}
        height={20}
        className="text-gray-500 dark:text-white mx-[10px]"
      />
      <input
        type="text"
        placeholder={placeHolder}
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery?.(e.target.value)}
        className=" bg-transparent outline-none text-dark400_light650"
        style={{
          width: width,
          height: height,
          padding: padding,
          paddingRight: paddingX,
          paddingLeft: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          fontSize:fontSize,
          borderRadius:borderRadius
        }}
      />
    </div>
  );
};

export default SearchBar;
