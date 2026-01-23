"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useMemo } from "react";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import Format from "@/components/shared/card/ConfirmCard";
import { Schedule } from "@/dto/ScheduleDTO";
import { deleteSchedule } from "@/lib/service/schedule.service";
import { Calendar, Clock, User, Edit2, Trash2 } from "lucide-react";

const columns = [
  { header: "Staff", accessor: "staff" },
  { header: "Shift", accessor: "shift" },
  { header: "Date", accessor: "date" },
  { header: "Actions", accessor: "action" },
];

type SortableKeys = "staff" | "shift" | "date";

interface ScheduleListProps {
  schedules: Schedule[] | null;
  setSchedules: any;
  loading?: boolean;
  openEditForm: (schedule: Schedule) => void;
}

const ScheduleList = ({
  schedules,
  setSchedules,
  loading,
  openEditForm,
}: ScheduleListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "staff",
    direction: "ascending",
  });

  // Helper function to convert shift number to name
  const getShiftName = (shiftNumber: number): string => {
    const shiftNames: { [key: number]: string } = {
      1: "Morning",
      2: "Afternoon",
      3: "Evening",
      4: "Night",
    };
    return shiftNames[shiftNumber] || `Shift ${shiftNumber}`;
  };

  const getValueByKey = (item: Schedule, key: SortableKeys) => {
    switch (key) {
      case "staff":
        return item.staff.fullName;
      case "shift":
        return item.shift;
      case "date":
        return item.date.substring(0, 10);
      default:
        return "";
    }
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!schedules || schedules.length === 0) return [];

    return [...schedules].sort((a, b) => {
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
  }, [schedules, sortConfig]);

  // Memoized filtered data
  const filterData = useMemo(() => {
    return sortedData.filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const shiftName = getShiftName(item.shift).toLowerCase();
      return (
        item.staff.fullName.toLowerCase().includes(lowerCaseQuery) ||
        shiftName.includes(lowerCaseQuery) ||
        item.shift.toString().includes(lowerCaseQuery) ||
        item.date.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [sortedData, searchQuery]);

  const totalPages = Math.ceil(filterData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filterData.slice(startIndex, endIndex);

  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem: endIndex,
    indexOfFirstItem: startIndex,
    totalPages,
    dataLength: filterData.length,
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!schedules || schedules.length === 0) {
    return (
      <div className="w-full flex flex-col p-12 items-center justify-center min-h-[500px]">
        <div className="p-6 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-6">
          <Calendar className="w-16 h-16 text-purple-300 dark:text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Schedules Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          There are no schedules to display. Create your first schedule to get
          started.
        </p>
      </div>
    );
  }

  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const result = await deleteSchedule(id);
      if (result) {
        setSchedules((prev: Schedule[]) =>
          prev.filter((item: Schedule) => item._id !== id)
        );
        setDeleteScheduleId(null);
        alert("Schedule deleted successfully!");
      } else {
        alert("Failed to delete schedule.");
      }
    } catch (err: any) {
      console.error("Error deleting schedule:", err);
      alert(`Error: ${err?.message || "An unexpected error occurred."}`);
    }
  };

  const getShiftConfig = (
    shiftNumber: number
  ): { bg: string; text: string; icon: string; name: string } => {
    const configs: {
      [key: number]: { bg: string; text: string; icon: string; name: string };
    } = {
      1: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        icon: "tabler:sun",
        name: "Morning",
      },
      2: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        icon: "tabler:sun-high",
        name: "Afternoon",
      },
      3: {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-700 dark:text-indigo-400",
        icon: "tabler:moon",
        name: "Evening",
      },
      4: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: "tabler:moon-stars",
        name: "Night",
      },
    };

    return (
      configs[shiftNumber] || {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        icon: "tabler:clock",
        name: `Shift ${shiftNumber}`,
      }
    );
  };

  const renderRow = (item: Schedule) => {
    const shiftConfig = getShiftConfig(item.shift);

    return (
      <tr
        key={item._id}
        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {item.staff.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.staff.fullName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ID: #00{item._id.slice(-6)}
              </span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div
            className={`inline-flex items-center gap-2 ${shiftConfig.bg} ${shiftConfig.text} px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <Icon icon={shiftConfig.icon} width={16} height={16} />
            <span>{shiftConfig.name}</span>
            <span className="text-xs opacity-75">({item.shift})</span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditForm(item)}
              className="group p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all duration-200"
              title="Edit schedule"
            >
              <Edit2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setDeleteScheduleId(item._id)}
              className="group p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200"
              title="Delete schedule"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </td>

        {deleteScheduleId === item._id && (
          <td colSpan={columns.length} className="absolute inset-0 z-50">
            <Format
              onClose={() => setDeleteScheduleId(null)}
              content={`Are you sure you want to delete schedule for ${
                item.staff.fullName
              } (${shiftConfig.name} shift) on ${new Date(
                item.date
              ).toLocaleDateString()}? This action cannot be undone.`}
              label="Delete Schedule"
              userName={item.staff.fullName}
              onConfirmDelete={() => handleDeleteSchedule(item._id)}
            />
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Schedule List
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filterData.length} schedule{filterData.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        </div>

        <TableSearch
          onSearch={setSearchQuery}
          onSort={() => requestSort("staff")}
        />

        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Found {filterData.length} result{filterData.length !== 1 ? "s" : ""}{" "}
            for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={currentData}
          renderRow={renderRow}
          onSort={(key: string) => requestSort(key as SortableKeys)}
        />
      </div>

      {/* Pagination Section */}
      {filterData.length > 0 && (
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filterData.length)} of {filterData.length}{" "}
              schedules
            </p>
          </div>
          <PaginationUI paginationUI={paginationUI} />
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
