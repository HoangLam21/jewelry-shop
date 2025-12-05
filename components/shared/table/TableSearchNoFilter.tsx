"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const TableSearchNoFilter = ({
  onSearch,
}: {
  onSearch: (searchQuery: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Truyền giá trị tìm kiếm lên component cha
  };

  return (
    <div className="w-full flex gap-4">
      <div className="flex-1 h-[35px]  flex sm:w-auto items-center text-xs rounded-lg px-2 border-2">
        <Icon
          icon="solar:magnifer-linear"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white"
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default TableSearchNoFilter;
