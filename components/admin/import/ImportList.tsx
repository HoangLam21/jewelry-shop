"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { format } from "date-fns";
import { deleteImport } from "@/lib/service/import.service";
import { formatPrice } from "@/lib/utils";
import Format from "@/components/shared/card/ConfirmCard";
import {
  PackageOpen,
  Calendar,
  User,
  DollarSign,
  Eye,
  Trash2,
} from "lucide-react";

const columns = [
  { header: "Import ID", accessor: "id" },
  {
    header: "Date Created",
    accessor: "createAt",
    className: "hidden md:table-cell",
  },
  {
    header: "Created By",
    accessor: "createBy",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Cost",
    accessor: "invoice",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden md:table-cell",
  },
  { header: "Actions", accessor: "action" },
];

type SortableKeys = "id" | "createBy" | "total" | "status" | "createAt";

interface ImportListProps {
  importData: any[] | null;
  setImportData: any;
  loading?: boolean;
}

const ImportList = ({
  importData,
  setImportData,
  loading,
}: ImportListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteImportId, setDeleteImportId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });

  const getValueByKey = (item: any, key: SortableKeys) => {
    switch (key) {
      case "id":
        return item._id;
      case "createBy":
        return item.staff?.fullName || "";
      case "status":
        return item.status;
      case "total":
        return item.totalCost;
      case "createAt":
        return new Date(item.createAt).getTime();
      default:
        return "";
    }
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!importData || importData.length === 0) return [];

    return [...importData].sort((a, b) => {
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
  }, [importData, sortConfig]);

  // Memoized filtered data
  const filterData = useMemo(() => {
    return sortedData.filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        item.staff?.fullName?.toLowerCase().includes(lowerCaseQuery) ||
        item.createAt?.toLowerCase().includes(lowerCaseQuery) ||
        item.totalCost?.toString().toLowerCase().includes(lowerCaseQuery) ||
        item._id?.toLowerCase().includes(lowerCaseQuery)
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
  if (!importData || importData.length === 0) {
    return (
      <div className="w-full flex flex-col p-12 items-center justify-center min-h-[500px]">
        <div className="p-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-6">
          <PackageOpen className="w-16 h-16 text-indigo-300 dark:text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Imports Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          There are no imports to display. Create your first import to get
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

  const handleDeleteImport = async (id: string) => {
    try {
      const result = await deleteImport(id);
      if (result) {
        setImportData((prev: any[]) =>
          prev.filter((item: any) => item._id !== id)
        );
        setDeleteImportId(null);
        alert("Import deleted successfully!");
      } else {
        alert("Failed to delete import.");
      }
    } catch (err: any) {
      console.error("Error deleting import:", err);
      alert(`Error: ${err?.message || "An unexpected error occurred."}`);
    }
  };

  const getStatusConfig = (
    status: boolean
  ): { bg: string; text: string; icon: string; label: string } => {
    const configs: {
      [key: string]: { bg: string; text: string; icon: string; label: string };
    } = {
      delivered: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: "tabler:circle-check-filled",
        label: "Delivered",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: "tabler:clock",
        label: "Pending",
      },
    };

    return status ? configs.delivered : configs.pending;
  };

  const renderRow = (item: any) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <tr
        key={item._id}
        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <PackageOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Import ID
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                #00{item._id.slice(-6)}
              </span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {format(new Date(item.createAt), "MMM dd, yyyy")}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 hidden md:table-cell">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {item.staff?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.staff?.fullName || "N/A"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Staff
              </span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(item.totalCost)}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div
            className={`inline-flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text} px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <Icon icon={statusConfig.icon} width={16} height={16} />
            <span>{statusConfig.label}</span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href={`/admin/import/${item._id}`}>
              <button
                className="group p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
                title="View details"
              >
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </button>
            </Link>

            <button
              onClick={() => setDeleteImportId(item._id)}
              className="group p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200"
              title="Delete import"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </td>

        {deleteImportId === item._id && (
          <td colSpan={columns.length} className="absolute inset-0 z-50">
            <Format
              onClose={() => setDeleteImportId(null)}
              content={`Are you sure you want to delete import #00${item._id.slice(-6)}? This action cannot be undone.`}
              label="Delete Import"
              userName={`#00${item._id.slice(-6)}`}
              onConfirmDelete={() => handleDeleteImport(item._id)}
            />
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Search Section */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <TableSearch
          onSearch={setSearchQuery}
          onSort={() => requestSort("id")}
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
              imports
            </p>
          </div>
          <PaginationUI paginationUI={paginationUI} />
        </div>
      )}
    </div>
  );
};

export default ImportList;
