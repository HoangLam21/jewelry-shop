// "use client";
// import TableNoSort from "@/components/shared/table/TableNoSort";
// import { formatPrice } from "@/lib/utils";
// import Link from "next/link";
// import React from "react";

// const columns = [
//   { header: "ID", accessor: "id" },
//   {
//     header: "Fullname",
//     accessor: "fullName",
//     className: "hidden md:table-cell",
//   },

//   {
//     header: "Total",
//     accessor: "invoice",
//     className: "hidden lg:table-cell",
//   },
// ];

// const TopSeller = ({ orderData }: { orderData: Order[] | null }) => {
//   if (!orderData || orderData === null) {
//     return (
//       <div className="overflow-x-auto shadow-md rounded-lg bg-white flex items-center justify-center min-h-[400px]">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   const getTopEmployeesByRevenue = (orders: any[], top: number = 5) => {
//     // Bước 1: Nhóm doanh thu theo nhân viên
//     const revenueByStaff: Record<
//       string,
//       { fullName: string; revenue: number }
//     > = {};

//     orders.forEach((order) => {
//       const staffId = order.staff?._id;
//       const staffName = order.staff?.fullName || "Unknown";
//       const orderRevenue = order.cost || 0;

//       if (staffId) {
//         if (!revenueByStaff[staffId]) {
//           revenueByStaff[staffId] = { fullName: staffName, revenue: 0 };
//         }
//         revenueByStaff[staffId].revenue += orderRevenue;
//       }
//     });

//     // Bước 2: Sắp xếp theo doanh thu giảm dần
//     const sortedStaff = Object.entries(revenueByStaff)
//       .map(([id, { fullName, revenue }]) => ({ id, fullName, revenue }))
//       .sort((a, b) => b.revenue - a.revenue);

//     // Bước 3: Lấy top nhân viên
//     return sortedStaff.slice(0, top);
//   };

//   // Gọi hàm và lấy kết quả
//   const topEmployees = getTopEmployeesByRevenue(orderData);

//   const renderRow = (item: any) => {
//     return (
//       <tr
//         key={item.id}
//         className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
//       >
//         <td className="px-4 py-2">
//           <Link href={`/admin/staff/${item.id}`}>
//             <p>{item.id}</p>
//           </Link>
//         </td>

//         <td className="px-4 py-2">{item.fullName || ""}</td>
//         <td className="px-4 py-2 hidden md:table-cell">
//           {formatPrice(item.revenue)}
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <div className="overflow-x-auto shadow-md rounded-lg bg-white">
//       <TableNoSort
//         columns={columns}
//         data={topEmployees}
//         renderRow={renderRow}
//       />
//     </div>
//   );
// };

// export default TopSeller;

"use client";
import { TrendingUp, Medal } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TopSellerProps {
  orderData: Order[] | null;
  loading?: boolean;
}

interface EmployeeSale {
  id: string;
  fullName: string;
  revenue: number;
  orderCount: number;
}

const TopSeller = ({ orderData, loading }: TopSellerProps) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orderData || orderData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Sellers
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Medal className="w-12 h-12 mb-3 opacity-20" />
          <p>No sales data available</p>
        </div>
      </div>
    );
  }

  const getTopEmployeesByRevenue = (
    orders: any[],
    top: number = 5
  ): EmployeeSale[] => {
    const revenueByStaffMap: Record<
      string,
      {
        fullName: string;
        revenue: number;
        orderCount: number;
      }
    > = {};

    orders.forEach((order) => {
      const staffId = order.staff?._id;
      const staffName = order.staff?.fullName || "Unknown";
      const orderRevenue = order.cost || 0;

      if (staffId) {
        if (!revenueByStaffMap[staffId]) {
          revenueByStaffMap[staffId] = {
            fullName: staffName,
            revenue: 0,
            orderCount: 0,
          };
        }
        revenueByStaffMap[staffId].revenue += orderRevenue;
        revenueByStaffMap[staffId].orderCount += 1;
      }
    });

    return Object.entries(revenueByStaffMap)
      .map(([id, data]) => ({
        id,
        fullName: data.fullName,
        revenue: data.revenue,
        orderCount: data.orderCount,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, top);
  };

  const topEmployees = getTopEmployeesByRevenue(orderData);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case 1:
        return "text-gray-400 bg-gray-50 dark:bg-gray-700/50";
      case 2:
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700/50";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Sellers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Best performing staff members
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary-100" />
        </div>
      </div>

      <div className="p-6">
        {topEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <Medal className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No staff sales data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topEmployees.map((item, index) => (
              <Link
                key={item.id}
                href={`/admin/staff/${item.id}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${getMedalColor(
                    index
                  )}`}
                >
                  {index < 3 ? <Medal className="w-5 h-5" /> : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-100 transition-colors">
                    {item.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.orderCount}{" "}
                    {item.orderCount === 1 ? "order" : "orders"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {(item.revenue / 1000000).toFixed(1)}M ₫
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    revenue
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSeller;
