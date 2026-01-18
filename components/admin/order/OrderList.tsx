"use client";
import TableSearch from "@/components/shared/table/TableSearch";

import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { format } from "date-fns";
import LabelStatus from "@/components/shared/label/LabelStatus";
import { Order } from "@/dto/OrderDTO";
import { deleteOrder, updatedStatusOrder } from "@/lib/service/order.service";
import Format from "@/components/shared/card/ConfirmCard";
import { formatPrice } from "@/lib/utils";

const columns = [
  { header: "ID", accessor: "id" },
  {
    header: "CreateAt",
    accessor: "createAt",
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

const OrderList = ({
  orderData,
  setOrderData,
}: {
  orderData: any[] | null;
  setOrderData: any;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "createBy" | "total" | "status" | "number";

  if (!orderData || orderData === null) {
    return (
      <div className="w-full flex flex-col p-4 rounded-md shadow-sm items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  const getValueByKey = (item: (typeof orderData)[0], key: SortableKeys) => {
    switch (key) {
      case "id":
        return item._id;
      case "createBy":
        return item.createBy;
      case "status":
        return item.status;
      case "total":
        return item.cost;
      default:
        return "";
    }
  };

  const sorted = [...orderData].sort((a, b) => {
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
      item.cost.toString().toLowerCase().includes(lowerCaseQuery);

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

  const handleDeleteOrder = async (id: string) => {
    console.log("davo");
    try {
      const result = await deleteOrder(id);
      if (result) {
        setOrderData((prev: any[]) =>
          prev.filter((item: any) => item._id !== id)
        );
        () => setDeleteOrderId(null);
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

  const handleUpdateStatusOrder = async (id: string, status: string) => {
    console.log("davo");
    try {
      const result = await updatedStatusOrder(id, status);
      if (result) {
        alert("Update order successfully.");
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
    const handleStatusChange = async (
      event: React.ChangeEvent<HTMLSelectElement>,
      orderId: string
    ) => {
      const newStatus = event.target.value;

      // Cập nhật trạng thái ngay lập tức trong danh sách orders

      try {
        // Gửi API để cập nhật trạng thái
        await handleUpdateStatusOrder(orderId, newStatus);
        setOrderData((prevOrders: any) =>
          prevOrders.map((order: any) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } catch (error) {
        // Xử lý lỗi API
        console.error("Failed to update status:", error);
        alert("Unable to update status. Please try again.");
        // Khôi phục trạng thái cũ nếu cần
        setOrderData((prevOrders: any) =>
          prevOrders.map((order: any) =>
            order._id === orderId ? { ...order, status: order.status } : order
          )
        );
      }
    };

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
          {formatPrice(item.cost)}
        </td>
        <td className="px-4 py-2">
          <select
            value={item.status}
            onChange={(event) => handleStatusChange(event, item._id)}
            className={`border rounded px-2 py-1 text-sm appearance-none
      ${
        item.status === "ordered"
          ? "bg-gray-200 text-gray-800"
          : item.status === "confirmed"
          ? "bg-blue-200 text-blue-800"
          : item.status === "preparing"
          ? "bg-yellow-200 text-yellow-800"
          : item.status === "shipping"
          ? "bg-purple-200 text-purple-800"
          : item.status === "delivered"
          ? "bg-green-200 text-green-800"
          : "bg-white text-black"
      } focus:bg-white focus:text-black`}
          >
            <option value="ordered" className="bg-white text-black">
              Ordered
            </option>
            <option value="paid" className="bg-white text-black">
              Paid
            </option>
            <option value="confirmed" className="bg-white text-black">
              Confirmed
            </option>
            <option value="preparing" className="bg-white text-black">
              Preparing
            </option>
            <option value="shipping" className="bg-white text-black">
              Shipping
            </option>
            <option value="delivered" className="bg-white text-black">
              Delivered
            </option>
          </select>
        </td>

        <td className="px-4 py-2 hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <Link href={`/admin/order/${item._id}`}>
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
              onClick={() => {
                if (item.status === "shipping" || item.status === "delivered") {
                  alert(
                    "Cannot delete orders that are in 'shipping' or 'delivered' status."
                  );
                  return;
                }
                setDeleteOrderId(item._id);
              }}
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
              onClose={() => setDeleteOrderId(null)}
              content={`delete: `}
              label={"Delete order"}
              userName={item._id}
              onConfirmDelete={() => handleDeleteOrder(item._id)}
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

export default OrderList;
