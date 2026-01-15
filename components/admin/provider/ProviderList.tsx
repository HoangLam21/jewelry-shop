"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { deleteProvider, fetchProvider } from "@/lib/service/provider.service";
import { Provider } from "@/dto/ProviderDTO";
import Format from "@/components/shared/card/ConfirmCard";

const columns = [
  { header: "ID", accessor: "_id" },
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

  { header: "Phone", accessor: "contact", className: "hidden lg:table-cell" },
  { header: "Action", accessor: "action" },
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
  const [onDelete, setOnDelete] = useState(false);
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
      <div className="w-full flex flex-col p-4 rounded-md shadow-sm items-center justify-center min-h-[400px]">
        <div className="loader"></div>
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
    // Lọc theo searchQuery
    const matchesSearch =
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.address.toLowerCase().includes(lowerCaseQuery) ||
      item.contact.toString().toLowerCase().includes(lowerCaseQuery);

    return matchesSearch;
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

  const handleDeleteprovider = async (id: string) => {
    try {
      const result = await deleteProvider(id);
      if (result) {
        setOnDelete(false);
        setProvider((prev: Provider[]) =>
          prev.filter((item: Provider) => item._id !== id)
        );
        () => setDeleteProviderId(null);
        alert("Delete provider successfully.");
      } else {
        alert("Can't delete provider.");
      }
    } catch (err: any) {
      console.error("Error delete data:", err);
      const errorMessage = err?.message || "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
  };

  const renderRow = (item: Provider) => (
    <tr
      key={item._id}
      className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <p>{item._id}</p>
        </div>
      </td>
      <td className="px-4 py-2">{item.name}</td>
      <td className="px-4 py-2">{item.address}</td>

      <td className="px-4 py-2">{item.contact}</td>

      <td className="px-4 py-2 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Link href={`/admin/provider/${item._id}`}>
            <div className="w-7 h-7 flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:eye"
                width={24}
                height={24}
                className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1 hover:cursor-pointer"
              />
            </div>
          </Link>
          <Link href={`/admin/provider/edit/${item._id}`}>
            <div className="w-7 h-7 flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:edit"
                width={24}
                height={24}
                className="text-white  dark:bg-dark-150 bg-dark-green rounded-md  p-1 hover:cursor-pointer"
              />
            </div>
          </Link>
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full"
            onClick={() => setDeleteProviderId(item._id)}
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
      {deleteProviderId === item._id && (
        <td colSpan={columns.length}>
          <Format
            onClose={() => setDeleteProviderId(null)}
            content={`delete: `}
            label={"Delete provider"}
            userName={item.name}
            onConfirmDelete={() => handleDeleteprovider(item._id)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-sm">
      <TableSearch onSearch={setSearchQuery} onSort={handleSort} />
      <Table
        columns={columns}
        data={currentData}
        renderRow={renderRow}
        onSort={(key: string) => requestSort(key as SortableKeys)}
      />
      <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
        <PaginationUI paginationUI={paginationUI} />
      </div>
    </div>
  );
};

export default ProviderList;
