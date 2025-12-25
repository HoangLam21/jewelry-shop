"use client";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { PaginationProps } from "@/types/pagination";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { Customer, defaultDetail, OrderCustomer } from "./CustomerList";
import { getCustomerById } from "@/lib/actions/customer.action";
import { getDetailCustomer } from "@/lib/service/customer.service";

const columns = [
  {
    header: "ID",
    accessor: "id",
    className: "hidden md:table-cell"
  },
  {
    header: "Create Date",
    accessor: "createAt",
    className: "hidden md:table-cell"
  },
  { header: "Total", accessor: "total", className: "hidden lg:table-cell" },
  {
    header: "Create By",
    accessor: "createBy",
    className: "hidden md:table-cell"
  }
];

const CustomerInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string }; // Ensure id is typed
  const [detail, setDetail] = useState<Customer>(defaultDetail);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending"
  });
  type SortableKeys = "id" | "cost" | "createBy" | "createAt";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDetailCustomer(id);
        if (result) {
          const totalCost = result.orders.reduce(
            (total, order) => total + order.cost,
            0
          );
          const data: Customer = {
            id: result._id,
            fullName: result.fullName,
            phoneNumber: result.phoneNumber,
            email: result.email,
            address: result.address,
            avatar: "",
            point: result.point,
            sales: totalCost,
            orders: result.orders.map((order) => ({
              id: order._id,
              createAt: order.createAt,
              createBy: order.staff,
              cost: order.cost
            }))
          };
          setDetail(data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
      }
    };
    fetchData();
  }, [id]);

  // Render nothing if Customer is not loaded yet
  if (!detail) {
    return <p>Loading Customer information...</p>;
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN").format(value) + " vnd";
  };

  const getValueByKey = (item: OrderCustomer, key: SortableKeys) => {
    switch (key) {
      case "id":
        return item.id;
      case "cost":
        return item.cost;
      case "createBy":
        return item.createBy.toLowerCase();
      case "createAt":
        return new Date(item.createAt).getTime();
      default:
        return "";
    }
  };

  const sorted = [...detail.orders].sort((a, b) => {
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

  const filteredOrders = sorted.filter((orders) => {
    const query = searchQuery.toLowerCase();
    return (
      orders.createBy.toLowerCase().includes(query) ||
      orders.id.toLowerCase().includes(query) ||
      orders.cost.toString().includes(query)
    );
  });

  const dataLength = filteredOrders.length;
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedorderss = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages,
    dataLength
  };

  const renderRow = (orders: OrderCustomer) => (
    <tr
      key={orders.id}
      className="border-t border-gray-300 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">{orders.id}</td>
      <td className="hidden px-4 py-2 md:table-cell">
        {format(new Date(orders.createAt), "PPP")}
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        {formatCurrency(orders.cost)}
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">{orders.createBy}</td>
    </tr>
  );

  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-md">
      {/* General Information */}

      <TitleSession
        icon="flowbite:profile-card-outline"
        title="General Information"
      />

      <div className="w-full p-6 flex flex-col gap-6 ">
        <div className="w-full flex">
          <div className="w-1/5">
            <Image
              alt="avatar"
              src={detail.avatar || "/assets/images/avatar.jpg"}
              width={115}
              height={130}
              className="rounded-md"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <LabelInformation content={detail.fullName} title="Fullname" />
              <LabelInformation
                content={detail.point.toString()}
                title="Point"
              />
              <LabelInformation
                content={formatCurrency(detail.sales)}
                title="Sales"
              />
            </div>
            <div className="flex flex-col gap-5">
              <LabelInformation content={detail.id} title="ID" />
              <LabelInformation content={detail.email} title="Email" />
              <LabelInformation
                content={detail.phoneNumber}
                title="Phone Number"
              />
            </div>
          </div>
        </div>

        <div className="w-full ">
          <LabelInformation content={detail.address} title="Address" />
        </div>
      </div>
      {/* Number of sales orderss */}

      <TitleSession icon="humbleicons:money" title="Number of sales orders" />

      <div className="flex flex-col w-full pt-6">
        <TableSearch
          onSearch={setSearchQuery}
          onSort={(searchQuery: string) =>
            handleSort(searchQuery as SortableKeys)
          }
        />
        <div className="flex flex-col w-full p-6">
          <Table
            columns={columns}
            data={paginatedorderss}
            renderRow={renderRow}
            onSort={(searchQuery: string) =>
              handleSort(searchQuery as SortableKeys)
            }
          />
          <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
            <PaginationUI paginationUI={paginationUI} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
