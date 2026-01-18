"use client";
import TableNoSort from "@/components/shared/table/TableNoSort";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const columns = [
  { header: "ID", accessor: "id" },
  {
    header: "Fullname",
    accessor: "fullName",
    className: "hidden md:table-cell",
  },

  {
    header: "Total",
    accessor: "invoice",
    className: "hidden lg:table-cell",
  },
];

const TopSeller = ({ orderData }: { orderData: Order[] | null }) => {
  if (!orderData || orderData === null) {
    return (
      <div className="overflow-x-auto shadow-md rounded-lg bg-white flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  const getTopEmployeesByRevenue = (orders: any[], top: number = 5) => {
    // Bước 1: Nhóm doanh thu theo nhân viên
    const revenueByStaff: Record<
      string,
      { fullName: string; revenue: number }
    > = {};

    orders.forEach((order) => {
      const staffId = order.staff?._id;
      const staffName = order.staff?.fullName || "Unknown";
      const orderRevenue = order.cost || 0;

      if (staffId) {
        if (!revenueByStaff[staffId]) {
          revenueByStaff[staffId] = { fullName: staffName, revenue: 0 };
        }
        revenueByStaff[staffId].revenue += orderRevenue;
      }
    });

    // Bước 2: Sắp xếp theo doanh thu giảm dần
    const sortedStaff = Object.entries(revenueByStaff)
      .map(([id, { fullName, revenue }]) => ({ id, fullName, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Bước 3: Lấy top nhân viên
    return sortedStaff.slice(0, top);
  };

  // Gọi hàm và lấy kết quả
  const topEmployees = getTopEmployeesByRevenue(orderData);

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
      >
        <td className="px-4 py-2">
          <Link href={`/admin/staff/${item.id}`}>
            <p>{item.id}</p>
          </Link>
        </td>

        <td className="px-4 py-2">{item.fullName || ""}</td>
        <td className="px-4 py-2 hidden md:table-cell">
          {formatPrice(item.revenue)}
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <TableNoSort
        columns={columns}
        data={topEmployees}
        renderRow={renderRow}
      />
    </div>
  );
};

export default TopSeller;
