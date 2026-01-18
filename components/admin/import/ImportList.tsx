"use client";
import TableSearch from "@/components/shared/table/TableSearch";
// import { ImportData } from "@/constants/data";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { format } from "date-fns";
import MyButton from "@/components/shared/button/MyButton";
import LabelStatus from "@/components/shared/label/LabelStatus";
import { Import } from "@/dto/ImportDTO";
import { deleteImport } from "@/lib/service/import.service";
import { formatPrice } from "@/lib/utils";
import Format from "@/components/shared/card/ConfirmCard";

const columns = [
  { header: "ID", accessor: "id" },
  {
    header: "Supplier",
    accessor: "suplier",
    className: "hidden md:table-cell",
  },
  {
    header: "CreateBy",
    accessor: "createBy",
    className: "hidden md:table-cell",
  },
  {
    header: "Total",
    accessor: "invoice",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden md:table-cell",
  },

  { header: "Action", accessor: "action" },
];

const ImportList = ({
  importData,
  setImportData,
}: {
  importData: any[] | null;
  setImportData: any;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteOrderId, setDeleteImportId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "createBy" | "total" | "status" | "number";

  if (!importData || importData === null) {
    return (
      <div className="w-full flex flex-col p-4 rounded-md shadow-sm items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  const getValueByKey = (item: (typeof importData)[0], key: SortableKeys) => {
    switch (key) {
      case "id":
        return item.id;
      case "createBy":
        return item.createBy;
      case "status":
        return item.status;
      // case "total":
      //   return item.;
      default:
        return "";
    }
  };

  const sorted = [...importData].sort((a, b) => {
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
      item.staff?.fullName.toLowerCase().includes(lowerCaseQuery) ||
      item.createAt.toLowerCase().includes(lowerCaseQuery) ||
      item.totalCost.toString().toLowerCase().includes(lowerCaseQuery);

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

  const handleDeleteImport = async (id: string) => {
    console.log("davo");
    try {
      const result = await deleteImport(id);
      if (result) {
        setImportData((prev: any[]) =>
          prev.filter((item: any) => item._id !== id)
        );
        () => setDeleteImportId(null);
        alert("Delete order successfully.");
      } else {
        alert("Can't delete order.");
      }
    } catch (err: any) {
      console.error("Error delete data:", err);
      const errorMessage = err?.message || "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
  };

  const renderRow = (item: any) => {
    return (
      <tr
        key={item._id}
        className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
      >
        <td className="px-4 py-2">
          <div className="flex flex-col">
            <p>Order Id</p>
            <p>#00{item._id}</p>
          </div>
        </td>
        <td className="px-4 py-2">{format(item.createAt, "PPP")}</td>
        <td className="px-4 py-2">{item.staff?.fullName || ""}</td>
        <td className="px-4 py-2 hidden md:table-cell">
          {formatPrice(item.totalCost)}
        </td>
        <td className="px-4 py-2">{item.status ? "Delivered" : "Pending"}</td>
        <td className="px-4 py-2 hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <Link href={`/admin/import/${item._id}`}>
              <div className="w-7 h-7 flex items-center justify-center rounded-full">
                <Icon
                  icon="tabler:eye"
                  width={24}
                  height={24}
                  className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1"
                />
              </div>
            </Link>
            <div
              className="w-7 h-7 flex items-center justify-center rounded-full"
              onClick={() => setDeleteImportId(item._id)}
            >
              <Icon
                icon="tabler:trash"
                width={24}
                height={24}
                className="dark:text-red-950 font-bold bg-light-red text-red-600 dark:bg-dark-110 rounded-md p-1 hover:cursor-pointer"
              />
            </div>
          </div>
        </td>
        {deleteOrderId === item._id && (
          <td colSpan={columns.length}>
            <Format
              onClose={() => setDeleteImportId(null)}
              content={`delete: `}
              label={"Delete import"}
              userName={item._id}
              onConfirmDelete={() => handleDeleteImport(item._id)}
            />
          </td>
        )}
      </tr>
    );
  };
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

export default ImportList;
