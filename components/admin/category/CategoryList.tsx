"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/shared/header/Headers";
import TableSearch from "@/components/shared/table/TableSearch";
import { format } from "date-fns";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from "@radix-ui/react-menubar";
// import {Pagination} from "@/components/ui/pagination";
import { PaginationProps } from "@/types/pagination";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { Button } from "@/components/ui/button";
import {
  deleteCategoryById,
  fetchCategory
} from "@/lib/service/category.service";
import { CategoryResponse } from "@/dto/CategoryDTO";
import Format from "@/components/shared/card/ConfirmCard";

const columns = [
  { header: "Category ID", accessor: "categoryId" },
  { header: "Name", accessor: "name" },
  { header: "created At", accessor: "createAt" },
  { header: "Hot", accessor: "hot" },
  { header: "Action", accessor: "action" }
];
export const defaultCategory: CategoryResponse = {
  _id: "default_id",
  name: "Default Category",
  hot: false,
  description: "",
  products: [
    {
      _id: "product_1",
      fullName: "Default Product 1",
      cost: 0
    }
  ],
  createAt: new Date()
};

const CategoryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [onDelete, setOnDelete] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDataCategory = async () => {
      const data = await fetchCategory();
      if (isMounted) {
        setCategoryList(data);
      }
    };
    fetchDataCategory();
    return () => {
      isMounted = false;
    };
  }, []);

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "_id",
    direction: "ascending"
  });

  type SortableKeys = "_id" | "name" | "hot" | "createdAt";

  const getValueByKey = (item: CategoryResponse, key: SortableKeys) => {
    switch (key) {
      case "_id":
        return item._id;
      case "name":
        return item.name;
      case "hot":
        return item.hot;
      case "createdAt":
        return item.createAt;
      default:
        return "";
    }
  };

  const sorted = [...categoryList].sort((a, b) => {
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

  const filterData = sorted.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item._id.toLowerCase().includes(lowerCaseQuery);

    return matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filterData.slice(indexOfFirstItem, indexOfLastItem);
  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages: Math.ceil(filterData.length / itemsPerPage),
    dataLength: filterData.length
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCategoryById(id);
      if (result) {
        setOnDelete(false);
        setCategoryList((prev) => prev.filter((item) => item._id !== id));
        alert("Delete customer successfully.");
      } else {
        alert("Can't delete customer.");
      }
    } catch (err: any) {
      console.error("Error delete data:", err);
      const errorMessage = err?.message || "An unexpected error occurred.";
      alert(`Error delete data: ${errorMessage}`);
    }
    const detail = categoryList.filter((item) => item._id !== id);
    if (detail) setCategoryList(detail);
    setOnDelete(false);
  };
  const [detailItem, setDetailItem] =
    useState<CategoryResponse>(defaultCategory);
  const handleConfirmDelete = (id: string) => {
    const detail = categoryList.find((item) => item._id === id);
    if (detail) setDetailItem(detail);
    setOnDelete(true);
  };
  const handleCancelConfirm = () => {
    setOnDelete(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderRow = (item: CategoryResponse) => (
    <tr key={item._id} className=" my-4 border-t border-gray-300  text-sm ">
      <td className="px-4 py-2">
        <h3 className="text-base">#{item._id}</h3>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        <p className="text-base ">{item.name}</p>
      </td>
      <td className="hidden px-4 py-2 md:table-cell">
        <div className="flex w-full flex-col ">
          <p className="text-base">{format(item.createAt, "PPP")}</p>
        </div>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        <p className="text-base text-gray-500">{item.hot && "Best Category"}</p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Link href={`/admin/category/${item._id}`}>
            <div className="w-7 h-7 flex items-center justify-center rounded-full">
              <Icon
                icon="tabler:eye"
                width={24}
                height={24}
                className="text-accent-blue bg-light-blue dark:bg-blue-800 dark:text-dark-360 rounded-md p-1"
              />
            </div>
          </Link>
          <Link href={`/admin/category/edit/${item._id}`}>
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
            onClick={() => handleConfirmDelete(item._id)}
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
        {/* LIST */}
        <div className="w-full px-4">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={currentData}
            onSort={(key: string) => requestSort(key as SortableKeys)}
          />
        </div>
        {/* PAGINATION */}
        <div className=" mt-4 flex items-center justify-center p-4 text-sm text-gray-500 md:justify-between">
          <PaginationUI paginationUI={paginationUI} />
        </div>
      </div>
      {onDelete && (
        <Format
          onClose={handleCancelConfirm}
          label="Delete"
          content="delete"
          userName={detailItem.name}
          onConfirmDelete={() => handleDelete(detailItem._id)}
          type="delete"
        />
      )}
    </>
  );
};

export default CategoryList;
