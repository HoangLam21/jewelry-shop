"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { deleteProvider } from "@/lib/service/provider.service";
import { Provider } from "@/dto/ProviderDTO";
import Format from "@/components/shared/card/ConfirmCard";
import { Eye, Pencil, Trash2, Phone, MapPin } from "lucide-react";
const columns = [
  { header: "Provider", accessor: "_id" },
  {
    header: "Name",
    accessor: "name",
    className: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  { header: "Contact", accessor: "contact", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ProviderList = ({
  provider,
  setProvider,
}: {
  provider: Provider[] | null;
  setProvider: any;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteProviderId, setDeleteProviderId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "name" | "contact" | "address";

  if (!provider || provider === null) {
    return (
      <div className="w-full flex flex-col p-8 rounded-xl shadow-sm items-center justify-center min-h-[400px] bg-white dark:bg-dark-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading providers...
        </p>
      </div>
    );
  }

  const getValueByKey = (item: (typeof provider)[0], key: SortableKeys) => {
    switch (key) {
      case "id":
        return item._id;
      case "name":
        return item.name;
      case "address":
        return item.address;
      case "contact":
        return item.contact;
      default:
        return "";
    }
  };

  const sorted = [...provider].sort((a, b) => {
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
    return (
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.address.toLowerCase().includes(lowerCaseQuery) ||
      item.contact.toString().toLowerCase().includes(lowerCaseQuery)
    );
  });

  const totalPages = Math.ceil(filterData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filterData.slice(startIndex, endIndex);

  const dataLength = filterData.length;
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

  const handleSort = () => {
    console.log("this is sort");
  };

  const handleDeleteProvider = async (id: string) => {
    try {
      const result = await deleteProvider(id);
      if (result) {
        setProvider((prev: Provider[]) =>
          prev.filter((item: Provider) => item._id !== id)
        );
        setDeleteProviderId(null);
        alert("Delete provider successfully.");
      } else {
        alert("Can't delete provider.");
      }
    } catch (error) {
      console.error("Error delete data:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
  };

  const renderRow = (item: Provider) => (
    <tr
      key={item._id}
      className="hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors"
    >
      {/* Provider Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-dark100_light500">{item.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{item._id.substring(0, 8)}
            </p>
          </div>
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4 hidden md:table-cell">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
          {item.name}
        </span>
      </td>

      {/* Address */}
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon icon="solar:map-point-linear" width={16} height={16} />
          <span className="max-w-xs truncate">{item.address}</span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:phone-calling-linear"
            width={16}
            height={16}
            className="text-primary-100"
          />
          <span className="text-gray-600 dark:text-gray-400">
            {item.contact}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/admin/provider/${item._id}`}>
            <button className="p-2 rounded-lg hover:bg-blue-50">
              <Eye size={18} className="text-blue-600" />
            </button>
          </Link>

          <Link href={`/admin/provider/edit/${item._id}`}>
            <button className="p-2 rounded-lg hover:bg-green-50">
              <Pencil size={18} className="text-green-600" />
            </button>
          </Link>

          <button
            onClick={() => setDeleteProviderId(item._id)}
            className="p-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </td>
      {/* Delete Confirmation Modal */}
      {deleteProviderId === item._id && (
        <td colSpan={columns.length} className="absolute inset-0">
          <Format
            onClose={() => setDeleteProviderId(null)}
            content="delete:"
            label="Delete provider"
            userName={item.name}
            onConfirmDelete={() => handleDeleteProvider(item._id)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <div className="w-full flex flex-col gap-6 p-6 rounded-xl bg-gray-50 dark:bg-dark-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark100_light500">
            Provider Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your suppliers and business partners
          </p>
        </div>
      </div>

      {/* Search */}
      <TableSearch onSearch={setSearchQuery} onSort={handleSort} />

      {/* Table */}
      <Table
        columns={columns}
        data={currentData}
        renderRow={renderRow}
        onSort={(key: string) => requestSort(key as SortableKeys)}
      />

      {/* Pagination */}
      <PaginationUI paginationUI={paginationUI} />
    </div>
  );
};

export default ProviderList;
