"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { format } from "date-fns";
import { deleteOrder, updatedStatusOrder } from "@/lib/service/order.service";
import Format from "@/components/shared/card/ConfirmCard";
import { formatPrice } from "@/lib/utils";
import { Package, Calendar, User, DollarSign, Trash2, Eye } from "lucide-react";

const columns = [
  { header: "Order ID", accessor: "id" },
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
    header: "Customer",
    accessor: "customer",
    className: "hidden lg:table-cell",
  },
  {
    header: "Total Amount",
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

type SortableKeys = "id" | "createBy" | "total" | "status" | "number";

interface OrderListProps {
  orderData: any[] | null;
  setOrderData: any;
  loading?: boolean;
}

const OrderList = ({ orderData, setOrderData, loading }: OrderListProps) => {
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

  // Helper function for getting values
  const getValueByKey = (item: any, key: SortableKeys) => {
    switch (key) {
      case "id":
        return item._id;
      case "createBy":
        return item.staff?.fullName || "";
      case "status":
        return item.status;
      case "total":
        return item.cost;
      default:
        return "";
    }
  };

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!orderData || orderData.length === 0) return [];

    return [...orderData].sort((a, b) => {
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
  }, [orderData, sortConfig]);

  // Memoized filtered data
  const filterData = useMemo(() => {
    return sortedData.filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        item.staff?.fullName?.toLowerCase().includes(lowerCaseQuery) ||
        item.customer?.fullName?.toLowerCase().includes(lowerCaseQuery) ||
        item.createAt?.toLowerCase().includes(lowerCaseQuery) ||
        item.cost?.toString().toLowerCase().includes(lowerCaseQuery) ||
        item._id?.toLowerCase().includes(lowerCaseQuery) ||
        item.status?.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [sortedData, searchQuery]);

  // Pagination calculations
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

  // NOW EARLY RETURNS ARE AFTER ALL HOOKS
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
  if (!orderData || orderData.length === 0) {
    return (
      <div className="w-full flex flex-col p-12 items-center justify-center min-h-[500px]">
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          There are no orders to display. Create your first order to get
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

  const handleDeleteOrder = async (id: string) => {
    try {
      const result = await deleteOrder(id);
      if (result) {
        setOrderData((prev: any[]) =>
          prev.filter((item: any) => item._id !== id)
        );
        setDeleteOrderId(null);
        alert("Order deleted successfully!");
      } else {
        alert("Failed to delete order.");
      }
    } catch (err: any) {
      console.error("Error deleting order:", err);
      alert(`Error: ${err?.message || "An unexpected error occurred."}`);
    }
  };

  const handleUpdateStatusOrder = async (id: string, status: string) => {
    try {
      const result = await updatedStatusOrder(id, status);
      if (result) {
        return true;
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      throw err;
    }
  };

  const getStatusConfig = (
    status: string
  ): { bg: string; text: string; icon: string } => {
    const configs: {
      [key: string]: { bg: string; text: string; icon: string };
    } = {
      ordered: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        icon: "tabler:clock",
      },
      paid: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: "tabler:circle-check",
      },
      confirmed: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: "tabler:check",
      },
      preparing: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: "tabler:package",
      },
      shipping: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: "tabler:truck-delivery",
      },
      delivered: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: "tabler:circle-check-filled",
      },
    };

    return configs[status] || configs.ordered;
  };

  const renderRow = (item: any) => {
    const handleStatusChange = async (
      event: React.ChangeEvent<HTMLSelectElement>,
      orderId: string
    ) => {
      const newStatus = event.target.value;
      const previousStatus = item.status;

      // Optimistic update
      setOrderData((prevOrders: any[]) =>
        prevOrders.map((order: any) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      try {
        await handleUpdateStatusOrder(orderId, newStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Unable to update status. Please try again.");
        // Revert on error
        setOrderData((prevOrders: any[]) =>
          prevOrders.map((order: any) =>
            order._id === orderId ? { ...order, status: previousStatus } : order
          )
        );
      }
    };

    const statusConfig = getStatusConfig(item.status);

    return (
      <tr
        key={item._id}
        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100/10 rounded-lg">
              <Package className="w-4 h-4 text-primary-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Order ID
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
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
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.customer?.fullName || "N/A"}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(item.cost)}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="relative">
            <select
              value={item.status}
              onChange={(event) => handleStatusChange(event, item._id)}
              className={`${statusConfig.bg} ${statusConfig.text} border-0 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium appearance-none cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2`}
            >
              <option value="ordered">Ordered</option>
              <option value="paid">Paid</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
            </select>
            <Icon
              icon={statusConfig.icon}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width={16}
            />
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href={`/admin/order/${item._id}`}>
              <button
                className="group p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
                title="View details"
              >
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </button>
            </Link>

            <button
              onClick={() => {
                if (item.status === "shipping" || item.status === "delivered") {
                  alert(
                    "Cannot delete orders with 'shipping' or 'delivered' status."
                  );
                  return;
                }
                setDeleteOrderId(item._id);
              }}
              className="group p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200"
              title="Delete order"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </td>

        {deleteOrderId === item._id && (
          <td colSpan={columns.length} className="absolute inset-0 z-50">
            <Format
              onClose={() => setDeleteOrderId(null)}
              content={`Are you sure you want to delete order #00${item._id.slice(
                -6
              )}? This action cannot be undone.`}
              label="Delete Order"
              userName={`#00${item._id.slice(-6)}`}
              onConfirmDelete={() => handleDeleteOrder(item._id)}
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
              orders
            </p>
          </div>
          <PaginationUI paginationUI={paginationUI} />
        </div>
      )}
    </div>
  );
};

export default OrderList;
