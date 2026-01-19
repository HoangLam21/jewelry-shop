"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import Format from "@/components/shared/card/ConfirmCard";
import { deleteCustomer, fetchCustomer } from "@/lib/service/customer.service";

export interface OrderCustomer {
  id: string;
  createAt: string;
  createBy: string;
  cost: number;
}
export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
  point: number;
  sales: number;
  orders: OrderCustomer[];
}
export const defaultDetail: Customer = {
  id: "",
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
  avatar: "",
  point: 0,
  sales: 0,
  orders: [],
};

const columns = [
  { header: "Customer Name", accessor: "name" },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Sales",
    accessor: "sales",
    className: "hidden lg:table-cell",
  },
  { header: "Point", accessor: "point", className: "hidden lg:table-cell" },
  { header: "Action", accessor: "action" },
];

const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onDelete, setOnDelete] = useState(false);
  const [filterOption, setFilterOption] = useState("");
  const [displayedList, setDisplayedList] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CustomerResponse[] = await fetchCustomer();
        console.log(result, "check");
        if (result) {
          const data: Customer[] = result.map((item) => {
            const totalCost = item.orders.reduce(
              (total, order) => total + order.cost,
              0
            );
            return {
              id: item._id,
              fullName: item.fullName,
              phoneNumber: item.phoneNumber,
              email: item.email,
              address: item.address,
              avatar: "",
              point: item.point,
              sales: totalCost,
              orders: item.orders.map((order) => ({
                id: order._id,
                createAt: order.createAt,
                createBy: order.staff,
                cost: order.cost,
              })),
            };
          });

          setDisplayedList(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        alert(`Error fetching data: ${errorMessage}`);
      }
    };

    fetchData();
  }, []);

  //SEARCH
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "fullname" | "point" | "sales" | "email";
  const getValueByKey = (
    item: (typeof displayedList)[0],
    key: SortableKeys
  ) => {
    switch (key) {
      case "id":
        return item.id;
      case "fullname":
        return item.fullName.toLowerCase();
      case "point":
        return item.point;
      case "sales":
        return item.sales;
      case "email":
        return item.email.toLowerCase();
      default:
        return "";
    }
  };
  const sorted = [...displayedList].sort((a, b) => {
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
  const handleSort = (key: SortableKeys) => {
    requestSort(key);
  };

  //SEARCH
  const filteredData = sorted.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.phoneNumber.includes(query)
    );
  });

  //PAGINATION
  const dataLength = filteredData.length;
  const itemsPerPage = 8;
  const totalPages = Math.ceil(dataLength / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
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

  //DELETE
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCustomer(id);
      if (result) {
        setOnDelete(false);
        setDisplayedList((prev) => prev.filter((item) => item.id !== id));
        alert("Delete customer successfully.");
      } else {
        alert("Can't delete customer.");
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
  const [detailItem, setDetailItem] = useState<Customer>(defaultDetail);
  const handleConfirmDelete = (id: string) => {
    const detail = displayedList.find((item) => item.id === id);
    if (detail) setDetailItem(detail);
    setOnDelete(true);
  };
  const handleCancelConfirm = () => {
    setOnDelete(false);
  };

  //RENDER TABLE
  const renderRow = (item: Customer) => (
    <tr
      key={item.id}
      className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <p>{item.fullName}</p>
          <p>#00{item.id}</p>
        </div>
      </td>
      <td className="px-4 py-2">{item.phoneNumber}</td>
      <td className="px-4 py-2">{item.email}</td>

      <td className="px-4 py-2 hidden md:table-cell">
        {" "}
        {`${item.sales.toLocaleString("vi-VN")} VND`}
      </td>
      <td className="px-4 py-2">{item.point}</td>

      <td className="px-4 py-2 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Link href={`/admin/customer/${item.id}`}>
            <div className="w-7 h-7 flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:eye"
                width={24}
                height={24}
                className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1"
              />
            </div>
          </Link>
          <Link href={`/admin/customer/edit/${item.id}`}>
            <div className="w-7 h-7 flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:edit"
                width={24}
                height={24}
                className="text-white  dark:bg-dark-150 bg-dark-green rounded-md  p-1"
              />
            </div>
          </Link>
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => handleConfirmDelete(item.id)}
          >
            <Icon
              icon="tabler:trash"
              width={24}
              height={24}
              className=" dark:text-red-950 font-bold bg-light-red text-red-600 dark:bg-dark-110 rounded-md p-1"
            />
          </div>
        </div>
      </td>
    </tr>
  );
  return (
    <>
      <div className="w-full flex flex-col p-4 rounded-md shadow-sm">
        <TableSearch
          onSearch={(query) => setSearchQuery(query)}
          onSort={(searchQuery: string) =>
            handleSort(searchQuery as SortableKeys)
          }
        />
        <Table
          columns={columns}
          data={currentData}
          renderRow={renderRow}
          onSort={(searchQuery: string) =>
            handleSort(searchQuery as SortableKeys)
          }
        />
        <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
          <PaginationUI paginationUI={paginationUI} />
        </div>
      </div>

      {onDelete && (
        <Format
          onClose={handleCancelConfirm}
          label="Delete"
          content="delete customer"
          userName={detailItem.fullName}
          onConfirmDelete={() => handleDelete(detailItem.id)}
          type="delete"
        />
      )}
    </>
  );
};

export default CustomerList;
