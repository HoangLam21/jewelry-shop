// "use client";
// import TableSearch from "@/components/shared/table/TableSearch";
// import { PaginationProps } from "@/types/pagination";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Table from "@/components/shared/table/Table";
// import PaginationUI from "@/types/pagination/Pagination";
// import Format from "@/components/shared/card/ConfirmCard";
// import { deleteCustomer, fetchCustomer } from "@/lib/service/customer.service";

// export interface OrderCustomer {
//   id: string;
//   createAt: string;
//   createBy: string;
//   cost: number;
// }
// export interface Customer {
//   id: string;
//   fullName: string;
//   phoneNumber: string;
//   email: string;
//   address: string;
//   avatar: string;
//   point: number;
//   sales: number;
//   orders: OrderCustomer[];
// }
// export const defaultDetail: Customer = {
//   id: "",
//   fullName: "",
//   phoneNumber: "",
//   email: "",
//   address: "",
//   avatar: "",
//   point: 0,
//   sales: 0,
//   orders: [],
// };

// const columns = [
//   { header: "Customer Name", accessor: "name" },
//   {
//     header: "Phone",
//     accessor: "phone",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Email",
//     accessor: "email",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Sales",
//     accessor: "sales",
//     className: "hidden lg:table-cell",
//   },
//   { header: "Point", accessor: "point", className: "hidden lg:table-cell" },
//   { header: "Action", accessor: "action" },
// ];

// const CustomerList = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [onDelete, setOnDelete] = useState(false);
//   const [filterOption, setFilterOption] = useState("");
//   const [displayedList, setDisplayedList] = useState<Customer[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result: CustomerResponse[] = await fetchCustomer();
//         console.log(result, "check");
//         if (result) {
//           const data: Customer[] = result.map((item) => {
//             const totalCost = item.orders.reduce(
//               (total, order) => total + order.cost,
//               0
//             );
//             return {
//               id: item._id,
//               fullName: item.fullName,
//               phoneNumber: item.phoneNumber,
//               email: item.email,
//               address: item.address,
//               avatar: "",
//               point: item.point,
//               sales: totalCost,
//               orders: item.orders.map((order) => ({
//                 id: order._id,
//                 createAt: order.createAt,
//                 createBy: order.staff,
//                 cost: order.cost,
//               })),
//             };
//           });

//           setDisplayedList(data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);

//         const errorMessage =
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred.";

//         alert(`Error fetching data: ${errorMessage}`);
//       }
//     };

//     fetchData();
//   }, []);

//   //SEARCH
//   const [sortConfig, setSortConfig] = useState<{
//     key: SortableKeys;
//     direction: "ascending" | "descending";
//   }>({
//     key: "id",
//     direction: "ascending",
//   });
//   type SortableKeys = "id" | "fullname" | "point" | "sales" | "email";
//   const getValueByKey = (
//     item: (typeof displayedList)[0],
//     key: SortableKeys
//   ) => {
//     switch (key) {
//       case "id":
//         return item.id;
//       case "fullname":
//         return item.fullName.toLowerCase();
//       case "point":
//         return item.point;
//       case "sales":
//         return item.sales;
//       case "email":
//         return item.email.toLowerCase();
//       default:
//         return "";
//     }
//   };
//   const sorted = [...displayedList].sort((a, b) => {
//     const aValue = getValueByKey(a, sortConfig.key);
//     const bValue = getValueByKey(b, sortConfig.key);

//     if (aValue < bValue) {
//       return sortConfig.direction === "ascending" ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === "ascending" ? 1 : -1;
//     }
//     return 0;
//   });
//   const requestSort = (key: SortableKeys) => {
//     let direction: "ascending" | "descending" = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };
//   const handleSort = (key: SortableKeys) => {
//     requestSort(key);
//   };

//   //SEARCH
//   const filteredData = sorted.filter((item) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       item.fullName.toLowerCase().includes(query) ||
//       item.email.toLowerCase().includes(query) ||
//       item.id.toLowerCase().includes(query) ||
//       item.phoneNumber.includes(query)
//     );
//   });

//   //PAGINATION
//   const dataLength = filteredData.length;
//   const itemsPerPage = 8;
//   const totalPages = Math.ceil(dataLength / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = filteredData.slice(startIndex, endIndex);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginationUI: PaginationProps = {
//     currentPage,
//     setCurrentPage,
//     indexOfLastItem,
//     indexOfFirstItem,
//     totalPages,
//     dataLength,
//   };

//   //DELETE
//   const handleDelete = async (id: string) => {
//     try {
//       const result = await deleteCustomer(id);
//       if (result) {
//         setOnDelete(false);
//         setDisplayedList((prev) => prev.filter((item) => item.id !== id));
//         alert("Delete customer successfully.");
//       } else {
//         alert("Can't delete customer.");
//       }
//     } catch (error) {
//       console.error("Error delete data:", error);

//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred.";

//       alert(`Error delete data: ${errorMessage}`);
//     }
//   };
//   const [detailItem, setDetailItem] = useState<Customer>(defaultDetail);
//   const handleConfirmDelete = (id: string) => {
//     const detail = displayedList.find((item) => item.id === id);
//     if (detail) setDetailItem(detail);
//     setOnDelete(true);
//   };
//   const handleCancelConfirm = () => {
//     setOnDelete(false);
//   };

//   //RENDER TABLE
//   const renderRow = (item: Customer) => (
//     <tr
//       key={item.id}
//       className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
//     >
//       <td className="px-4 py-2">
//         <div className="flex flex-col">
//           <p>{item.fullName}</p>
//           <p>#00{item.id}</p>
//         </div>
//       </td>
//       <td className="px-4 py-2">{item.phoneNumber}</td>
//       <td className="px-4 py-2">{item.email}</td>

//       <td className="px-4 py-2 hidden md:table-cell">
//         {" "}
//         {`${item.sales.toLocaleString("vi-VN")} VND`}
//       </td>
//       <td className="px-4 py-2">{item.point}</td>

//       <td className="px-4 py-2 hidden lg:table-cell">
//         <div className="flex items-center gap-2">
//           <Link href={`/admin/customer/${item.id}`}>
//             <div className="w-7 h-7 flex items-center justify-center rounded-full">
//               <Icon
//                 icon="tabler:eye"
//                 width={24}
//                 height={24}
//                 className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1"
//               />
//             </div>
//           </Link>
//           <Link href={`/admin/customer/edit/${item.id}`}>
//             <div className="w-7 h-7 flex items-center justify-center rounded-full">
//               <Icon
//                 icon="tabler:edit"
//                 width={24}
//                 height={24}
//                 className="text-white  dark:bg-dark-150 bg-dark-green rounded-md  p-1"
//               />
//             </div>
//           </Link>
//           <div
//             className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
//             onClick={() => handleConfirmDelete(item.id)}
//           >
//             <Icon
//               icon="tabler:trash"
//               width={24}
//               height={24}
//               className=" dark:text-red-950 font-bold bg-light-red text-red-600 dark:bg-dark-110 rounded-md p-1"
//             />
//           </div>
//         </div>
//       </td>
//     </tr>
//   );
//   return (
//     <>
//       <div className="w-full flex flex-col p-4 rounded-md shadow-sm">
//         <TableSearch
//           onSearch={(query) => setSearchQuery(query)}
//           onSort={(searchQuery: string) =>
//             handleSort(searchQuery as SortableKeys)
//           }
//         />
//         <Table
//           columns={columns}
//           data={currentData}
//           renderRow={renderRow}
//           onSort={(searchQuery: string) =>
//             handleSort(searchQuery as SortableKeys)
//           }
//         />
//         <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
//           <PaginationUI paginationUI={paginationUI} />
//         </div>
//       </div>

//       {onDelete && (
//         <Format
//           onClose={handleCancelConfirm}
//           label="Delete"
//           content="delete customer"
//           userName={detailItem.fullName}
//           onConfirmDelete={() => handleDelete(detailItem.id)}
//           type="delete"
//         />
//       )}
//     </>
//   );
// };

// export default CustomerList;
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

// DTO Interfaces
interface Order {
  _id: string;
  cost: number;
  discount: number;
  details: {
    additionalProp1?: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp2?: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp3?: {
      material: string;
      size: string;
      quantity: number;
    };
  };
  status: string;
  shippingMethod: string;
  ETD: string;
  customer: string;
  staff: string;
  createAt: string;
}

interface CustomerResponse {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  point: number;
  sales: number;
  orders: Order[];
}

// Display Interface
interface CustomerDisplay {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  point: number;
  totalSales: number;
  totalOrders: number;
  orders: Order[];
}

const columns = [
  { header: "Customer", accessor: "name" },
  {
    header: "Contact",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Sales",
    accessor: "sales",
    className: "hidden lg:table-cell",
  },
  { header: "Points", accessor: "point", className: "hidden lg:table-cell" },
  { header: "Orders", accessor: "orders", className: "hidden xl:table-cell" },
  { header: "Actions", accessor: "action" },
];

const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onDelete, setOnDelete] = useState(false);
  const [displayedList, setDisplayedList] = useState<CustomerDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: CustomerResponse[] = await fetchCustomer();

        if (result) {
          const data: CustomerDisplay[] = result.map((item) => {
            // Calculate total sales from orders
            const totalSales = item.orders.reduce(
              (total, order) => total + (order.cost - order.discount),
              0
            );

            return {
              id: item._id,
              fullName: item.fullName,
              phoneNumber: item.phoneNumber,
              email: item.email,
              address: item.address,
              point: item.point,
              totalSales: totalSales,
              totalOrders: item.orders.length,
              orders: item.orders,
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // SORT
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });

  type SortableKeys =
    | "id"
    | "fullName"
    | "point"
    | "totalSales"
    | "email"
    | "totalOrders";

  const getValueByKey = (item: CustomerDisplay, key: SortableKeys) => {
    switch (key) {
      case "id":
        return item.id;
      case "fullName":
        return item.fullName.toLowerCase();
      case "point":
        return item.point;
      case "totalSales":
        return item.totalSales;
      case "totalOrders":
        return item.totalOrders;
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

  // SEARCH
  const filteredData = sorted.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.phoneNumber.includes(query)
    );
  });

  // PAGINATION
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

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCustomer(id);
      if (result) {
        setDisplayedList((prev) => prev.filter((item) => item.id !== id));
        setDeleteCustomerId(null);
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

  // LOADING STATE
  if (loading) {
    return (
      <div className="w-full flex flex-col p-8 rounded-xl shadow-sm items-center justify-center min-h-[400px] bg-white dark:bg-dark-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading customers...
        </p>
      </div>
    );
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400";
    }
  };

  // RENDER TABLE
  const renderRow = (item: CustomerDisplay) => (
    <tr
      key={item.id}
      className="hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors"
    >
      {/* Customer Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
            {item.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-dark100_light500">{item.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{item.id.substring(0, 8)}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon icon="solar:phone-linear" width={16} height={16} />
          <span>{item.phoneNumber}</span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon icon="solar:letter-linear" width={16} height={16} />
          <span className="max-w-xs truncate">{item.email}</span>
        </div>
      </td>

      {/* Total Sales */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:money-bag-linear"
            width={16}
            height={16}
            className="text-green-600 dark:text-green-400"
          />
          <span className="font-semibold text-green-600 dark:text-green-400">
            {item.totalSales.toLocaleString("vi-VN")} VND
          </span>
        </div>
      </td>

      {/* Points */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
          <Icon
            icon="solar:star-bold"
            width={14}
            height={14}
            className="mr-1"
          />
          {item.point} pts
        </span>
      </td>

      {/* Total Orders */}
      <td className="px-6 py-4 hidden xl:table-cell">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:box-linear"
            width={16}
            height={16}
            className="text-blue-600 dark:text-blue-400"
          />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {item.totalOrders} {item.totalOrders === 1 ? "order" : "orders"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/admin/customer/${item.id}`}>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group">
              <Icon
                icon="solar:eye-linear"
                width={20}
                height={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </button>
          </Link>
          <Link href={`/admin/customer/edit/${item.id}`}>
            <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors group">
              <Icon
                icon="solar:pen-linear"
                width={20}
                height={20}
                className="text-green-600 dark:text-green-400"
              />
            </button>
          </Link>
          <button
            onClick={() => setDeleteCustomerId(item.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
          >
            <Icon
              icon="solar:trash-bin-trash-linear"
              width={20}
              height={20}
              className="text-red-600 dark:text-red-400"
            />
          </button>
        </div>
      </td>

      {/* Delete Confirmation Modal */}
      {deleteCustomerId === item.id && (
        <td colSpan={columns.length} className="absolute inset-0">
          <Format
            onClose={() => setDeleteCustomerId(null)}
            label="Delete Customer"
            content="delete customer"
            userName={item.fullName}
            onConfirmDelete={() => handleDelete(item.id)}
            type="delete"
          />
        </td>
      )}
    </tr>
  );

  // Calculate total stats
  const totalStats = {
    customers: displayedList.length,
    totalSales: displayedList.reduce((sum, c) => sum + c.totalSales, 0),
    totalOrders: displayedList.reduce((sum, c) => sum + c.totalOrders, 0),
    avgOrderValue:
      displayedList.length > 0
        ? displayedList.reduce((sum, c) => sum + c.totalSales, 0) /
          displayedList.reduce((sum, c) => sum + c.totalOrders, 0)
        : 0,
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 rounded-xl bg-gray-50 dark:bg-dark-200">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark100_light500">
            Customer Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your customers and their purchase history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-dark-300 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Customers
            </p>
            <p className="text-xl font-bold text-dark100_light500">
              {totalStats.customers}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-300 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Orders
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {totalStats.totalOrders}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-300 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Sales
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {(totalStats.totalSales / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white dark:bg-dark-300 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Avg Order
            </p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {(totalStats.avgOrderValue / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <TableSearch
        onSearch={(query) => setSearchQuery(query)}
        onSort={() => {}}
      />

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

export default CustomerList;
