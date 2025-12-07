"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import Format from "@/components/shared/card/ConfirmCard";
import { Schedule } from "@/dto/ScheduleDTO";
import { deleteSchedule } from "@/lib/service/schedule.service";
import TableSearchNoFilter from "@/components/shared/table/TableSearchNoFilter";

const columns = [
  { header: "Staff", accessor: "staff" },
  { header: "Shift", accessor: "shift" },
  { header: "Date", accessor: "date" },
  { header: "Action", accessor: "action" },
];

const ScheduleList = ({
  schedules,
  setSchedules,
  openEditForm,
}: {
  schedules: Schedule[];
  setSchedules: any;
  openEditForm: (schedule: Schedule) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [filterOption, setFilterOption] = useState("");
  const [onDelete, setOnDelete] = useState(false);
  const totalResult = schedules.length;
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "staff", // Cập nhật key cho sắp xếp theo staff
    direction: "ascending",
  });
  type SortableKeys = "staff" | "shift" | "date";

  const getValueByKey = (item: (typeof schedules)[0], key: SortableKeys) => {
    switch (key) {
      case "staff":
        return item.staff.fullName; // Cập nhật để lấy tên staff
      case "shift":
        return item.shift;
      case "date":
        return item.date.substring(0, 10);
      default:
        return "";
    }
  };

  const sorted = [...schedules].sort((a, b) => {
    const aValue = getValueByKey(a, sortConfig.key);
    const bValue = getValueByKey(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filterData = sorted.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    // Lọc theo searchQuery
    const matchesSearch =
      item.staff.fullName.toLowerCase().includes(lowerCaseQuery) ||
      item.shift.toString().toLowerCase().includes(lowerCaseQuery) ||
      item.date.toLowerCase().includes(lowerCaseQuery);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filterData.length / rowsPerPage); // Sử dụng filterData thay vì schedules
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filterData.slice(startIndex, endIndex); // Lấy dữ liệu của trang hiện tại


  const dataLength = schedules.length;
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages,
    dataLength,
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const result = await deleteSchedule(id);
      if (result) {
        setOnDelete(false);
        setSchedules((prev: Schedule[]) =>
          prev.filter((item: Schedule) => item._id !== id)
        );
        () => setDeleteScheduleId(null);
        alert("Delete schedule successfully.");
      } else {
        alert("Can't delete schedule.");
      }
    } catch (err: any) {
      console.error("Error delete data:", err);
      const errorMessage = err?.message || "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
  };

  const renderRow = (item: Schedule) => (
    <tr
      key={item._id}
      className="border-t border-gray-300 my-4 text-sm dark:text-dark-360 h-full flex-1"
    >
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <p>{item.staff.fullName}</p>
          <p>#00{item._id}</p>
        </div>
      </td>
      <td className="px-4 py-2">{item.shift}</td>
      <td className="px-4 py-2">{item.date.substring(0, 10)}</td>

      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full"
            onClick={() => openEditForm(item)}
          >
            <Icon
              icon="tabler:edit"
              width={24}
              height={24}
              className="text-white  dark:bg-dark-150 bg-dark-green rounded-md  p-1 hover:cursor-pointer"
            />
          </div>
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full"
            onClick={() => handleDeleteSchedule(item._id)}
          >
            <Icon
              icon="tabler:trash"
              width={24}
              height={24}
              className=" dark:text-red-950 font-bold bg-light-red text-red-600 dark:bg-dark-110 rounded-md p-1 hover:cursor-pointer"
            />
          </div>
        </div>
      </td>
      {deleteScheduleId === item._id && (
        <td colSpan={columns.length}>
          <Format
            onClose={() => setDeleteScheduleId(null)}
            content={`delete: `}
            label={"Delete schedule"}
            userName={item.staff.fullName}
            onConfirmDelete={() => handleDeleteSchedule(item._id)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-md shadow-sm justify-between">
      <TableSearchNoFilter onSearch={setSearchQuery} />
      <div className="flex-1">
        {" "}
        <Table
          columns={columns}
          data={currentData}
          renderRow={renderRow}
          onSort={(key: string) => requestSort(key as SortableKeys)}
        />
      </div>
      <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
        <PaginationUI paginationUI={paginationUI} />
      </div>
      {schedules ? null : (
        <div className="flex-1 flex items-center justify-center ">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
