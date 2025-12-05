"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

const TableSearch = ({
  onSearch,
  onSort,
}: {
  onSearch: (searchQuery: string) => void;
  onSort?: (filterOption: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <div className="w-full flex gap-4">
      <div className="flex-1 h-[38px] ml-4 flex sm:w-auto items-center gap-2 text-xs rounded-full px-2 border-2">
        <Icon
          icon="solar:magnifer-linear"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white"
        />
        <input
          type="text"
          placeholder=""
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 bg-transparent outline-none"
          //fdprocessedid="rgnhgt"
        />
      </div>
      {/* <Menubar className="relative border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2">
            <div className="flex text-sm items-center py-2 px-4 border-2 dark:border-light100_dark400 gap-1 dark:text-dark-360 h-[35px] text-dark360_light360 shadow-md hover:opacity-75 transition-opacity duration-300 rounded-lg">
              <Icon
                icon="tabler:adjustments-horizontal"
                width={14}
                height={14}
                className="text-gray-800 dark:text-white"
              />
              Filter
            </div>
          </MenubarTrigger>
          <MenubarContent className="text-dark100_light500 bg-gray-50 absolute top-full right-[-3rem] z-50 mt-3 h-auto w-40 font-sans text-sm shadow-md">
            <MenubarItem
              className=" flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
              onSelect={() => setFilterOption("number")}
            >
              <p className="p-1 pt-2">Số lượng học sinh</p>
            </MenubarItem>
            <MenubarItem
              className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
              onSelect={() => setFilterOption("online")}
            >
              <p className="p-1 pb-2">Học sinh online</p>
            </MenubarItem>
            <MenubarItem
              className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
              onSelect={() => setFilterOption("offline")}
            >
              <p className="p-1 pb-2">Học sinh offline</p>
            </MenubarItem>
            <MenubarSeparator />
          </MenubarContent>
        </MenubarMenu>
      </Menubar> */}
    </div>
  );
};

export default TableSearch;
