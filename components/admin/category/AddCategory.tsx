"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LabelInformation from "@/components/shared/label/LabelInformation";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import InputDate from "@/components/shared/input/InputDate";
import {
  CategoryResponse,
  CreateCategory,
  ProductAdditionToCategory,
} from "@/dto/CategoryDTO";
import { defaultCategory } from "./CategoryList";
import { ProductResponse } from "@/dto/ProductDTO";
import { fetchProduct } from "@/lib/service/product.service";
import { ProductData } from "../product/ProductList";
import { formatCurrency } from "@/lib/utils";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { PaginationProps } from "@/types/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  addProductToCategory,
  createCategory,
} from "@/lib/service/category.service";
import ConfirmModal, { ConfirmModalProps } from "../product/ConfirmModal";

const columns = [
  { header: "Product ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Collection", accessor: "collection" },
  { header: "Price", accessor: "price" },
];

const AddCategoryInformation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newDetail, setNewDetail] = useState<CategoryResponse>(defaultCategory);
  const [quantity, setQuantity] = useState(0);
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: ProductResponse[] = await fetchProduct();
        if (result) {
          const data: ProductData[] = result.map((item) => ({
            id: item._id,
            image: item.files[0].url,
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider ? item.provider._id : "",
            category: item.category,
            variants: item.variants,
            categoryId: "",
          }));

          setProductList(data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newDetail) {
      setNewDetail({
        ...newDetail,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSelect = (isChecked: CheckedState, id: string) => {
    const checked = Boolean(isChecked);

    setSelectedIds((prev) => {
      const updatedIds = checked
        ? [...prev, id] // Thêm ID nếu được chọn
        : prev.filter((selectedId) => selectedId !== id); // Loại bỏ ID nếu bỏ chọn

      // Cập nhật quantity dựa trên danh sách mới
      setQuantity(updatedIds.length);

      return updatedIds;
    });
  };

  const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : "";
  };
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });

  type SortableKeys = "id" | "name" | "price" | "collection";

  const getValueByKey = (item: ProductData, key: SortableKeys) => {
    switch (key) {
      case "id":
        return item.id;
      case "name":
        return item.productName;
      case "price":
        return item.price;
      case "collection":
        return item.collection;
      default:
        return "";
    }
  };

  const sorted = [...productList].sort((a, b) => {
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
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery) ||
      item.collection.toLowerCase().includes(lowerCaseQuery);

    return matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
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
    dataLength: filterData.length,
  };

  const renderRow = (item: ProductData) => (
    <tr key={item.id} className=" my-4 border-t border-gray-300  text-sm ">
      <td className="px-4 py-2">
        <h3 className="text-base">{item.id}</h3>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        <p className="text-base ">{item.productName}</p>
      </td>
      <td className="hidden px-4 py-2 md:table-cell">
        <div className="flex w-full flex-col ">
          <p className="text-base">{item.collection}</p>
        </div>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        <p className="text-base text-gray-500">{item.price}</p>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell">
        <Checkbox
          value={item.id}
          id={item.id}
          onCheckedChange={(isChecked) => handleSelect(isChecked, item.id)}
          className="data-[state=checked]:bg-primary-100 border-light-600 dark:border-dark-100 border data-[state=checked]:text-light-800 data-[state=checked]:border-none h-5 w-5 rounded-full dark:data-[state=checked]:bg-primary-100 dark:data-[state=checked]:text-light-800"
        />
      </td>
    </tr>
  );
  const handleCreate = async () => {
    try {
      const params: CreateCategory = {
        name: newDetail.name,
        hot: newDetail.hot,
      };
      const result = await createCategory(params);
      if (result) {
        const param: ProductAdditionToCategory = {
          categoryId: result._id,
          productId: selectedIds,
        };
        const addedProduct = await addProductToCategory(param);
        console.log("Added product:", addedProduct.product);
        alert("Create category successfully.");
      } else {
        alert("Can't create category.");
      }
    } catch (error) {
      console.error("Error create data:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      alert(`Error create data: ${errorMessage}`);
    }
  };
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: "",
  });
  const handleConfirmCreate = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: () => handleCreate(),
      name: "new category",
      action: "create",
    });
  };

  return (
    <>
      <div className="w-full flex flex-col p-4 rounded-md shadow-md">
        {/* General Information */}
        <TitleSession icon="" title="General Information" />

        <div className="w-full p-6 flex flex-col gap-6">
          <div className="flex w-full">
            <div className="flex-1 flex flex-col justify-between">
              <LabelInformation
                content={newDetail ? `#${newDetail._id}` : ""}
                title="ID"
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
            <InputEdit
              titleInput="Name"
              width="w-full"
              name="name"
              onChange={handleChange}
              placeholder="Enter name"
            />

            <InputDate
              titleInput="Create At"
              width="w-full"
              value={formatDate(newDetail.createAt)}
            />
          </div>
          {/* <div className="flex w-full h-fit">
            <InputEdit
              titleInput="Description"
              width="w-full"
              onChange={handleChange}
              placeholder="Enter description..."
            />
          </div> */}
        </div>

        {/* Product Information */}
        <TitleSession icon="" title="Product List" />

        <div className="w-full p-6 flex flex-col gap-2">
          <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
            <LabelInformation content={quantity.toString()} title="Quantity" />
          </div>
          <div className="w-full flex flex-col p-2 rounded-md shadow-sm">
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
        </div>

        {/* Footer */}
        <div className="w-full flex justify-end p-6 ">
          <MyButton
            event={handleConfirmCreate}
            width="w-28"
            background="bg-primary-100"
            text_color="text-white"
            title="Update"
          />
        </div>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default AddCategoryInformation;
