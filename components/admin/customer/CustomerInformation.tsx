// "use client";
// import LabelInformation from "@/components/shared/label/LabelInformation";
// import TitleSession from "@/components/shared/label/TitleSession";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import { useParams } from "next/navigation";
// import { PaginationProps } from "@/types/pagination";
// import TableSearch from "@/components/shared/table/TableSearch";
// import Table from "@/components/shared/table/Table";
// import PaginationUI from "@/types/pagination/Pagination";
// import { getDetailCustomer } from "@/lib/service/customer.service";

// const columns = [
//   {
//     header: "ID",
//     accessor: "id",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Create Date",
//     accessor: "createAt",
//     className: "hidden md:table-cell",
//   },
//   { header: "Total", accessor: "total", className: "hidden lg:table-cell" },
//   {
//     header: "Create By",
//     accessor: "createBy",
//     className: "hidden md:table-cell",
//   },
// ];

// const CustomerInformation = () => {
//   const { id } = useParams<{ id: string }>() as { id: string }; // Ensure id is typed
//   const [detail, setDetail] = useState<Customer>(defaultDetail);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState<{
//     key: SortableKeys;
//     direction: "ascending" | "descending";
//   }>({
//     key: "id",
//     direction: "ascending",
//   });
//   type SortableKeys = "id" | "cost" | "createBy" | "createAt";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getDetailCustomer(id);
//         if (result) {
//           const totalCost = result.orders.reduce(
//             (total, order) => total + order.cost,
//             0
//           );
//           const data: Customer = {
//             id: result._id,
//             fullName: result.fullName,
//             phoneNumber: result.phoneNumber,
//             email: result.email,
//             address: result.address,
//             avatar: "",
//             point: result.point,
//             sales: totalCost,
//             orders: result.orders.map((order) => ({
//               id: order._id,
//               createAt: order.createAt,
//               createBy: order.staff,
//               cost: order.cost,
//             })),
//           };
//           setDetail(data);
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
//   }, [id]);

//   // Render nothing if Customer is not loaded yet
//   if (!detail) {
//     return <p>Loading Customer information...</p>;
//   }

//   const formatCurrency = (value: number): string => {
//     return new Intl.NumberFormat("vi-VN").format(value) + " vnd";
//   };

//   const getValueByKey = (item: OrderCustomer, key: SortableKeys) => {
//     switch (key) {
//       case "id":
//         return item.id;
//       case "cost":
//         return item.cost;
//       case "createBy":
//         return item.createBy.toLowerCase();
//       case "createAt":
//         return new Date(item.createAt).getTime();
//       default:
//         return "";
//     }
//   };

//   const sorted = [...detail.orders].sort((a, b) => {
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

//   const filteredOrders = sorted.filter((orders) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       orders.createBy.toLowerCase().includes(query) ||
//       orders.id.toLowerCase().includes(query) ||
//       orders.cost.toString().includes(query)
//     );
//   });

//   const dataLength = filteredOrders.length;
//   const itemsPerPage = 8;
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedorderss = filteredOrders.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   const paginationUI: PaginationProps = {
//     currentPage,
//     setCurrentPage,
//     indexOfLastItem,
//     indexOfFirstItem,
//     totalPages,
//     dataLength,
//   };

//   const renderRow = (orders: OrderCustomer) => (
//     <tr
//       key={orders.id}
//       className="border-t border-gray-300 text-sm dark:text-dark-360"
//     >
//       <td className="px-4 py-2">{orders.id}</td>
//       <td className="hidden px-4 py-2 md:table-cell">
//         {format(new Date(orders.createAt), "PPP")}
//       </td>
//       <td className="hidden px-4 py-2 lg:table-cell">
//         {formatCurrency(orders.cost)}
//       </td>
//       <td className="hidden px-4 py-2 lg:table-cell">{orders.createBy}</td>
//     </tr>
//   );

//   return (
//     <div className="w-full flex flex-col p-4 rounded-md shadow-md">
//       {/* General Information */}

//       <TitleSession
//         icon="flowbite:profile-card-outline"
//         title="General Information"
//       />

//       <div className="w-full p-6 flex flex-col gap-6 ">
//         <div className="w-full flex">
//           <div className="w-1/5">
//             <Image
//               alt="avatar"
//               src={detail.avatar || "/assets/images/avatar.jpg"}
//               width={115}
//               height={130}
//               className="rounded-md"
//             />
//           </div>

//           <div className="w-full grid grid-cols-2 gap-5">
//             <div className="flex flex-col gap-5">
//               <LabelInformation content={detail.fullName} title="Fullname" />
//               <LabelInformation
//                 content={detail.point.toString()}
//                 title="Point"
//               />
//               <LabelInformation
//                 content={formatCurrency(detail.sales)}
//                 title="Sales"
//               />
//             </div>
//             <div className="flex flex-col gap-5">
//               <LabelInformation content={detail.id} title="ID" />
//               <LabelInformation content={detail.email} title="Email" />
//               <LabelInformation
//                 content={detail.phoneNumber}
//                 title="Phone Number"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="w-full ">
//           <LabelInformation content={detail.address} title="Address" />
//         </div>
//       </div>
//       {/* Number of sales orderss */}

//       <TitleSession icon="humbleicons:money" title="Number of sales orders" />

//       <div className="flex flex-col w-full pt-6">
//         <TableSearch
//           onSearch={setSearchQuery}
//           onSort={(searchQuery: string) =>
//             handleSort(searchQuery as SortableKeys)
//           }
//         />
//         <div className="flex flex-col w-full p-6">
//           <Table
//             columns={columns}
//             data={paginatedorderss}
//             renderRow={renderRow}
//             onSort={(searchQuery: string) =>
//               handleSort(searchQuery as SortableKeys)
//             }
//           />
//           <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
//             <PaginationUI paginationUI={paginationUI} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerInformation;
"use client";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { PaginationProps } from "@/types/pagination";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { getDetailCustomer } from "@/lib/service/customer.service";

// Types Definition
interface OrderCustomer {
  id: string;
  createAt: string;
  createBy: string;
  cost: number;
}

interface Customer {
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

const defaultDetail: Customer = {
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
  {
    header: "ID",
    accessor: "id",
    className: "hidden md:table-cell",
  },
  {
    header: "Create Date",
    accessor: "createAt",
    className: "hidden md:table-cell",
  },
  { header: "Total", accessor: "total", className: "hidden lg:table-cell" },
  {
    header: "Create By",
    accessor: "createBy",
    className: "hidden md:table-cell",
  },
];

const CustomerInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [detail, setDetail] = useState<Customer>(defaultDetail);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
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
              cost: order.cost,
            })),
          };
          setDetail(data);
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
  }, [id]);

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
    dataLength,
  };

  const renderRow = (orders: OrderCustomer) => (
    <tr
      key={orders.id}
      className="border-t border-gray-300 text-sm dark:text-dark-360 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200"
    >
      <td className="px-4 py-3 font-medium text-gray-900 dark:text-dark-360">
        {orders.id}
      </td>
      <td className="hidden px-4 py-3 md:table-cell text-gray-600 dark:text-dark-360">
        {format(new Date(orders.createAt), "PPP")}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell font-semibold text-green-600 dark:text-green-400">
        {formatCurrency(orders.cost)}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell text-gray-700 dark:text-dark-360">
        {orders.createBy}
      </td>
    </tr>
  );

  return (
    <div className="w-full flex flex-col p-6 rounded-2xl shadow-xl bg-white dark:bg-dark-100 border border-gray-100 dark:border-dark-200">
      {/* General Information */}
      <div className="mb-8">
        <TitleSession
          icon="flowbite:profile-card-outline"
          title="General Information"
        />
      </div>

      <div className="w-full p-8 flex flex-col gap-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-dark-200 dark:to-dark-300 rounded-xl border border-blue-100 dark:border-dark-400">
        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Avatar Section with enhanced styling */}
          <div className="lg:w-1/5 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                <Image
                  alt="avatar"
                  src={detail.avatar || "/assets/images/avatar.jpg"}
                  width={140}
                  height={160}
                  className="rounded-2xl shadow-lg ring-4 ring-white dark:ring-dark-100 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Information Grid with cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                <LabelInformation content={detail.fullName} title="Fullname" />
              </div>
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                <LabelInformation
                  content={detail.point.toString()}
                  title="Point"
                />
              </div>
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                <LabelInformation
                  content={formatCurrency(detail.sales)}
                  title="Sales"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
                <LabelInformation content={detail.id} title="ID" />
              </div>
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-pink-500">
                <LabelInformation content={detail.email} title="Email" />
              </div>
              <div className="bg-white dark:bg-dark-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-cyan-500">
                <LabelInformation
                  content={detail.phoneNumber}
                  title="Phone Number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address section with enhanced styling */}
        <div className="w-full bg-white dark:bg-dark-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500">
          <LabelInformation content={detail.address} title="Address" />
        </div>
      </div>

      {/* Number of sales orders */}
      <div className="mt-12 mb-8">
        <TitleSession icon="humbleicons:money" title="Number of sales orders" />
      </div>

      <div className="flex flex-col w-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-dark-200 dark:to-dark-300 rounded-xl border border-green-100 dark:border-dark-400 p-6">
        <div className="mb-6">
          <TableSearch
            onSearch={setSearchQuery}
            onSort={(searchQuery: string) =>
              handleSort(searchQuery as SortableKeys)
            }
          />
        </div>
        <div className="flex flex-col w-full bg-white dark:bg-dark-100 rounded-xl shadow-lg overflow-hidden">
          <Table
            columns={columns}
            data={paginatedorderss}
            renderRow={renderRow}
            onSort={(searchQuery: string) =>
              handleSort(searchQuery as SortableKeys)
            }
          />
          <div className="p-6 mt-2 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360 bg-gray-50 dark:bg-dark-200 border-t border-gray-200 dark:border-dark-400">
            <PaginationUI paginationUI={paginationUI} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
