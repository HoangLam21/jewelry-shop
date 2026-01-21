// "use client";
// import TableSearch from "@/components/shared/table/TableSearch";
// import { PaginationProps } from "@/types/pagination";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Table from "@/components/shared/table/Table";
// import PaginationUI from "@/types/pagination/Pagination";
// import { Staff } from "@/dto/StaffDTO";
// import { deleteStaff } from "@/lib/service/staff.service";
// import Format from "@/components/shared/card/ConfirmCard";

// const columns = [
//   { header: "ID", accessor: "id" },
//   {
//     header: "Gender",
//     accessor: "gender",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Position",
//     accessor: "position",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Earning",
//     accessor: "salary",
//     className: "hidden lg:table-cell",
//   },
//   { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
//   { header: "Action", accessor: "action" },
// ];

// const StaffList = ({
//   staffs,
//   setStaffs,
// }: {
//   staffs: Staff[] | null;
//   setStaffs: any;
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 8;
//   const [filterOption, setFilterOption] = useState("");
//   const [onDelete, setOnDelete] = useState(false);
//   const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null);
//   const [sortConfig, setSortConfig] = useState<{
//     key: SortableKeys;
//     direction: "ascending" | "descending";
//   }>({
//     key: "_id",
//     direction: "ascending",
//   });
//   type SortableKeys = "_id" | "gender" | "salary" | "position";

//   if (!staffs || staffs === null) {
//     return (
//       <div className="w-full flex flex-col p-4 rounded-md shadow-sm items-center justify-center min-h-[400px]">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   const totalResult = staffs.length;

//   const getValueByKey = (item: (typeof staffs)[0], key: SortableKeys) => {
//     switch (key) {
//       case "_id":
//         return item._id;
//       case "gender":
//         return item.gender;
//       case "position":
//         return item.position;
//       case "salary":
//         return item.salary;
//       default:
//         return "";
//     }
//   };

//   const sorted = [...staffs].sort((a, b) => {
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

//   const filterData = sorted.filter((item) => {
//     const lowerCaseQuery = searchQuery.toLowerCase();
//     // Lọc theo searchQuery
//     const matchesSearch =
//       item.fullName.toLowerCase().includes(lowerCaseQuery) ||
//       item.gender.toLowerCase().includes(lowerCaseQuery) ||
//       item.position.toLowerCase().includes(lowerCaseQuery) ||
//       item.salary.toString().toLowerCase().includes(lowerCaseQuery) ||
//       item.phoneNumber.toLowerCase().includes(lowerCaseQuery);

//     return matchesSearch;
//   });

//   const totalPages = Math.ceil(filterData.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const currentData = filterData.slice(startIndex, endIndex);

//   const dataLength = filterData.length;
//   const itemsPerPage = 8;
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

//   const handleSort = () => {
//     console.log("this is sort");
//   };

//   const handleDeleteStaff = async (id: string) => {
//     try {
//       const result = await deleteStaff(id);
//       if (result) {
//         setOnDelete(false);
//         setStaffs((prev: Staff[]) =>
//           prev.filter((item: Staff) => item._id !== id)
//         );
//         () => setDeleteStaffId(null);
//         alert("Delete staff successfully.");
//       } else {
//         alert("Can't delete staff.");
//       }
//     } catch (err: any) {
//       console.error("Error delete data:", err);
//       const errorMessage = err?.message || "An unexpected error occurred.";
//       alert(`Error delete data: ${errorMessage}`);
//     }
//   };

//   const renderRow = (item: Staff) => (
//     <tr
//       key={item._id}
//       className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
//     >
//       <td className="px-4 py-2">
//         <div className="flex flex-col">
//           <p>{item.fullName}</p>
//           <p>#00{item._id}</p>
//         </div>
//       </td>
//       <td className="px-4 py-2">{item.gender}</td>
//       <td className="px-4 py-2">{item.position}</td>

//       <td className="px-4 py-2 hidden md:table-cell">
//         {" "}
//         {`${item.salary} VND`}
//       </td>
//       <td className="px-4 py-2">{item.phoneNumber}</td>

//       <td className="px-4 py-2 hidden lg:table-cell">
//         <div className="flex items-center gap-2">
//           <Link href={`/admin/staff/${item._id}`}>
//             <div className="w-7 h-7 flex items-center justify-center rounded-full">
//               <Icon
//                 icon="tabler:eye"
//                 width={24}
//                 height={24}
//                 className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1 hover:cursor-pointer"
//               />
//             </div>
//           </Link>
//           <Link href={`/admin/staff/edit/${item._id}`}>
//             <div className="w-7 h-7 flex items-center justify-center rounded-full">
//               <Icon
//                 icon="tabler:edit"
//                 width={24}
//                 height={24}
//                 className="text-white  dark:bg-dark-150 bg-dark-green rounded-md  p-1 hover:cursor-pointer"
//               />
//             </div>
//           </Link>
//           <div
//             className="w-7 h-7 flex items-center justify-center rounded-full"
//             onClick={() => setDeleteStaffId(item._id)}
//           >
//             <Icon
//               icon="tabler:trash"
//               width={24}
//               height={24}
//               className=" dark:text-red-950 font-bold bg-light-red text-red-600 dark:bg-dark-110 rounded-md p-1 hover:cursor-pointer"
//             />
//           </div>
//         </div>
//       </td>
//       {deleteStaffId === item._id && (
//         <td colSpan={columns.length}>
//           <Format
//             onClose={() => setDeleteStaffId(null)}
//             content={`delete: `}
//             label={"Delete staff"}
//             userName={item.fullName}
//             onConfirmDelete={() => handleDeleteStaff(item._id)}
//           />
//         </td>
//       )}
//     </tr>
//   );
//   return (
//     <div className="w-full flex flex-col p-4 rounded-md shadow-sm">
//       <TableSearch onSearch={setSearchQuery} onSort={handleSort} />
//       <Table
//         columns={columns}
//         data={filterData}
//         renderRow={renderRow}
//         onSort={(key: string) => requestSort(key as SortableKeys)}
//       />
//       <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
//         <PaginationUI paginationUI={paginationUI} />
//       </div>
//     </div>
//   );
// };

// export default StaffList;

"use client";
import TableSearch from "@/components/shared/table/TableSearch";
import { PaginationProps } from "@/types/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Link from "next/link";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { Staff } from "@/dto/StaffDTO";
import { deleteStaff } from "@/lib/service/staff.service";
import Format from "@/components/shared/card/ConfirmCard";

const columns = [
  { header: "Staff", accessor: "id" },
  {
    header: "Gender",
    accessor: "gender",
    className: "hidden md:table-cell",
  },
  {
    header: "Position",
    accessor: "position",
    className: "hidden md:table-cell",
  },
  {
    header: "Salary",
    accessor: "salary",
    className: "hidden lg:table-cell",
  },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StaffList = ({
  staffs,
  setStaffs,
}: {
  staffs: Staff[] | null;
  setStaffs: any;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "_id",
    direction: "ascending",
  });
  type SortableKeys = "_id" | "gender" | "salary" | "position";

  if (!staffs || staffs === null) {
    return (
      <div className="w-full flex flex-col p-8 rounded-xl shadow-sm items-center justify-center min-h-[400px] bg-white dark:bg-dark-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading staff...
        </p>
      </div>
    );
  }

  const getValueByKey = (item: (typeof staffs)[0], key: SortableKeys) => {
    switch (key) {
      case "_id":
        return item._id;
      case "gender":
        return item.gender;
      case "position":
        return item.position;
      case "salary":
        return item.salary;
      default:
        return "";
    }
  };

  const sorted = [...staffs].sort((a, b) => {
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
    return (
      item.fullName.toLowerCase().includes(lowerCaseQuery) ||
      item.gender.toLowerCase().includes(lowerCaseQuery) ||
      item.position.toLowerCase().includes(lowerCaseQuery) ||
      item.salary.toString().toLowerCase().includes(lowerCaseQuery) ||
      item.phoneNumber.toLowerCase().includes(lowerCaseQuery)
    );
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

  const handleDeleteStaff = async (id: string) => {
    try {
      const result = await deleteStaff(id);
      if (result) {
        setStaffs((prev: Staff[]) =>
          prev.filter((item: Staff) => item._id !== id)
        );
        setDeleteStaffId(null);
        alert("Delete staff successfully.");
      } else {
        alert("Can't delete staff.");
      }
    } catch (err: any) {
      console.error("Error delete data:", err);
      const errorMessage = err?.message || "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
  };

  const renderRow = (item: Staff) => (
    <tr
      key={item._id}
      className="hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors"
    >
      {/* Staff Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-white font-semibold">
            {item.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-dark100_light500">{item.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{item._id.substring(0, 8)}
            </p>
          </div>
        </div>
      </td>

      {/* Gender */}
      <td className="px-6 py-4 hidden md:table-cell">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            item.gender.toLowerCase() === "male"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              : "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400"
          }`}
        >
          {item.gender}
        </span>
      </td>

      {/* Position */}
      <td className="px-6 py-4 hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
          {item.position}
        </span>
      </td>

      {/* Salary */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <span className="font-semibold text-green-600 dark:text-green-400">
          {item.salary.toLocaleString()} VND
        </span>
      </td>

      {/* Phone */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Icon icon="solar:phone-linear" width={16} height={16} />
          {item.phoneNumber}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/admin/staff/${item._id}`}>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group">
              <Icon
                icon="solar:eye-linear"
                width={20}
                height={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </button>
          </Link>
          <Link href={`/admin/staff/edit/${item._id}`}>
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
            onClick={() => setDeleteStaffId(item._id)}
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
      {deleteStaffId === item._id && (
        <td colSpan={columns.length} className="absolute inset-0">
          <Format
            onClose={() => setDeleteStaffId(null)}
            content="delete:"
            label="Delete staff"
            userName={item.fullName}
            onConfirmDelete={() => handleDeleteStaff(item._id)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <div className="w-full flex flex-col gap-6 p-6 rounded-xl bg-gray-50 dark:bg-dark-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark100_light500">
            Staff Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members and their information
          </p>
        </div>
      </div>

      {/* Search */}
      <TableSearch onSearch={setSearchQuery} onSort={handleSort} />

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

export default StaffList;
