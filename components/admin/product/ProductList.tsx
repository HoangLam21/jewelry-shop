"use client";
import ProductFrame from "@/components/shared/card/ProductCard";
import TableSearch from "@/components/shared/table/TableSearch";
import React, { useEffect, useState } from "react";
import ProductDetail from "./ProductDetail";
import ProductEdit from "./ProductEdit";
import Format from "@/components/shared/card/ConfirmCard";
import { deleteProductById, fetchProduct } from "@/lib/service/product.service";
import { FileContent } from "@/dto/ProductDTO";
import { formatCurrency } from "@/lib/utils";
import { fetchProvider } from "@/lib/service/provider.service";
import {
  SelectionListProduct,
  useProductManageContext,
} from "@/contexts/ProductManageContext";
import { fetchVoucher } from "@/lib/service/voucher.service";

export interface Sizes {
  size: string;
  stock: number;
  _id?: string;
}

export interface Variant {
  material: string;
  sizes: Sizes[];
  addOn: number;
  _id?: string;
}

export interface ProductData {
  id: string;
  image: string;
  imageInfo: FileContent[];
  productName: string;
  price: string;
  collection: string;
  description: string;
  vouchers: string;
  provider: string;
  category: string;
  categoryId: string;
  variants: Variant[];
}

interface Provider {
  _id: string;
  name: string;
}

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductResponse {
  _id: string;
  files: FileContent[];
  name: string;
  cost: number;
  collections: string;
  description: string;
  vouchers?: Voucher[];
  provider?: Provider;
  category?: Category;
  variants: Variant[];
}

export const defaultDetailProduct: ProductData = {
  id: "",
  image: "/assets/images/avatar.jpg",
  imageInfo: [],
  productName: "",
  price: "0",
  collection: "",
  description: "",
  vouchers: "",
  provider: "",
  category: "",
  categoryId: "",
  variants: [
    {
      material: "",
      sizes: [
        {
          size: "",
          stock: 0,
        },
      ],
      addOn: 0,
    },
  ],
};

interface ProductListProps {
  list: ProductData[];
  setList: React.Dispatch<React.SetStateAction<ProductData[]>>;
}

const ProductList = ({ list, setList }: ProductListProps) => {
  const { setProviderList, setVoucherList } = useProductManageContext();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [onDetail, setOnDetail] = useState<boolean>(false);
  const [detailItem, setDetailItem] =
    useState<ProductData>(defaultDetailProduct);

  useEffect(() => {
    const fetchDataProvider = async () => {
      try {
        const result = await fetchProvider();

        if (result) {
          const provider: SelectionListProduct[] = result.map(
            (item: Provider) => ({
              id: item._id,
              name: item.name,
            })
          );

          setProviderList(provider);
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        alert(`Error fetching provider data: ${errorMessage}`);
      }
    };

    const fetchDataVoucher = async () => {
      try {
        const result = await fetchVoucher();

        if (result) {
          const voucher: SelectionListProduct[] = result.map(
            (item: Voucher) => ({
              id: item._id,
              name: item.name,
            })
          );
          setVoucherList(voucher);
        }
      } catch (error) {
        console.error("Error fetching voucher data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        alert(`Error fetching voucher data: ${errorMessage}`);
      }
    };

    fetchDataProvider();
    fetchDataVoucher();
  }, [setProviderList, setVoucherList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProduct();
        console.log(result, "check");

        if (result) {
          const data: ProductData[] = result.map((item: ProductResponse) => ({
            id: item._id,
            image: item.files[0]?.url || "/assets/images/avatar.jpg",
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider?._id || "",
            category: item.category?.name || "No category",
            categoryId: item.category?._id || "",
            variants: item.variants,
          }));
          setList(data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        alert(`Error fetching product data: ${errorMessage}`);
      }
    };

    fetchData();
  }, [setList]);

  const filterData: ProductData[] = list.filter((item: ProductData) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery) ||
      item.price.toLowerCase().includes(lowerCaseQuery);

    return matchesSearch;
  });

  const handleConfirmDelete = (id: string) => {
    const detail = filterData.find((item: ProductData) => item.id === id);
    if (detail) setDetailItem(detail);
    setOnDelete(true);
  };

  const handleCancelConfirm = () => {
    setOnDelete(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteProductById(id);
      if (result) {
        const detail = filterData.find((item: ProductData) => item.id === id);
        if (detail)
          setList((prev: ProductData[]) =>
            prev.filter((item: ProductData) => item.id !== detail.id)
          );
        setOnDelete(false);
        alert("Delete product successfully.");
      } else {
        alert("Can't delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      alert(`Error deleting product: ${errorMessage}`);
    }
  };

  const handleEdit = (id: string) => {
    const detail = filterData.find((item: ProductData) => item.id === id);
    if (detail) {
      const item: ProductData = {
        id: detail.id,
        image: detail.image,
        imageInfo: detail.imageInfo,
        productName: detail.productName,
        price: detail.price,
        collection: detail.collection,
        description: detail.description,
        vouchers: detail.vouchers,
        provider: detail.provider,
        category: detail.category,
        categoryId: detail.categoryId,
        variants: detail.variants,
      };
      setDetailItem(item);
    }
    console.log("edit");
    setOnDetail(false);
    setOnEdit(true);
  };

  const handleDetail = (id: string) => {
    const detail = filterData.find((item: ProductData) => item.id === id);
    if (detail) setDetailItem(detail);
    console.log(detail, "detail");
    setOnDetail(true);
  };

  const handleBack = (value: boolean) => {
    setOnDelete(value);
    setOnDetail(value);
    setOnEdit(value);
  };

  return (
    <>
      <div className="flex w-full flex-col p-4 rounded-md shadow-sm">
        <TableSearch onSearch={setSearchQuery} onSort={() => {}} />
        <div className="flex flex-row flex-wrap items-start justify-items-stretch gap-7 mt-6 max-h-[550px] h-[550px] overflow-x-auto container">
          {filterData.map((item: ProductData) => (
            <ProductFrame
              key={item.id}
              param={item}
              onDelete={() => handleConfirmDelete(item.id)}
              onDetail={() => handleDetail(item.id)}
              onEdit={() => handleEdit(item.id)}
            />
          ))}
        </div>
      </div>

      {onDetail && (
        <ProductDetail
          detailProduct={detailItem}
          onBack={(value: boolean) => handleBack(value)}
          onEdit={(id: string) => handleEdit(id)}
        />
      )}

      {onEdit && (
        <ProductEdit
          detailProduct={detailItem}
          setList={setList}
          onBack={(value: boolean) => handleBack(value)}
        />
      )}

      {onDelete && (
        <Format
          onClose={handleCancelConfirm}
          label="Delete"
          content="delete"
          userName={detailItem.productName}
          onConfirmDelete={() => handleDelete(detailItem.id)}
          type="delete"
        />
      )}
    </>
  );
};

export default ProductList;
