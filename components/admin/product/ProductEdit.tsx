"use client";
import InputEdit from "@/components/shared/input/InputEdit";
import InputSelection from "@/components/shared/input/InputSelection";
import InputUnEdit from "@/components/shared/input/InputUnEdit";
import TableImport from "@/components/shared/table/TableImport";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ProductData, Variant } from "./ProductList";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import ConfirmModal, { ConfirmModalProps } from "./ConfirmModal";
import AddVariant from "./AddVariant";
import { updateInfoProduct } from "@/lib/service/product.service";
import { CreateProduct, FileContent } from "@/dto/ProductDTO";
import { fetchProvider } from "@/lib/service/provider.service";
import { fetchVoucher } from "@/lib/service/voucher.service";
import { useProductManageContext } from "@/contexts/ProductManageContext";
import InputSelectionProduct from "@/components/shared/input/InputSelectionProduct";

export interface CombinedVariant {
  material: string; // Material
  size: string;
  stock: number;
  addOn: number;
}
const defaultCombine: CombinedVariant = {
  material: "",
  size: "",
  stock: 0,
  addOn: 0
};
// 1. Hàm tổ hợp từ `variantList`
export const combineVariants = (variantList: Variant[]): CombinedVariant[] => {
  return variantList.flatMap((variant) =>
    variant.sizes.map((size) => ({
      material: variant.material,
      size: size.size,
      stock: size.stock,
      addOn: variant.addOn
    }))
  );
};
// 2. Hàm gộp lại thành `variantList`
export const groupVariants = (combinedList: CombinedVariant[]): Variant[] => {
  const grouped = combinedList.reduce((acc, item) => {
    // Tìm variant (material) đã tồn tại trong acc
    const existingVariant = acc.find((v) => v.material === item.material);
    if (existingVariant) {
      // Nếu tồn tại, thêm size vào danh sách sizes
      existingVariant.sizes.push({ size: item.size, stock: item.stock });
    } else {
      // Nếu chưa tồn tại, tạo mới variant
      acc.push({
        material: item.material,
        addOn: item.addOn,
        sizes: [{ size: item.size, stock: item.stock }]
      });
    }
    return acc;
  }, [] as Variant[]);

  return grouped;
};
interface Props {
  detailProduct: ProductData;
  setList: React.Dispatch<React.SetStateAction<ProductData[]>>;
  onBack: (value: boolean) => void;
}

const ProductEdit = ({ detailProduct, onBack, setList }: Props) => {
  const [onRemove, setOnRemove] = useState(false);
  const [imageList, setImageList] = useState<FileContent[]>(
    detailProduct.imageInfo
  );
  const [onAdd, setOnAdd] = useState(false);
  const { providerList, voucherList, collectionList } =
    useProductManageContext();
  const [combinedData, setCombinedData] = useState<CombinedVariant[]>(
    combineVariants(detailProduct.variants)
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //Images
  const [item, setItem] = useState<ProductData>(detailProduct);
  const handleAdd = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const nameProvider = item?.provider
    ? providerList.find((provider) => provider.id === item.provider)?.name ||
      "Unknown"
    : "None";
  const nameVoucher = item?.vouchers
    ? voucherList.find((voucher) => voucher.id === item.vouchers)?.name ||
      "Unknown"
    : "None";
  const nameCollection = item?.collection
    ? collectionList.find((coll) => coll.id === item.collection)?.name ||
      "Unknown"
    : "None";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: FileContent[] = Array.from(files).map((file) => ({
        _id: "", // Nếu cần thiết
        fileName: file.name,
        url: URL.createObjectURL(file),
        publicId: "",
        bytes: file.size.toString(),
        width: "",
        height: "",
        format: file.type.split("/")[1] || "",
        type: file.type
      }));
      setImageList((prevList) => [...prevList, ...newFiles]);
    }
  };

  const handleRemoveImage = (fileName: string) => {
    setImageList((prevList) =>
      prevList.filter((img) => img.fileName !== fileName)
    );
  };

  //Change Input
  const handleChangeProductInputFields = (
    field: keyof Omit<
      ProductData,
      "id" | "image" | "subImage" | "vouchers" | "provider" | "category"
    >,
    value: string
  ) => {
    setItem((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  //Handle Variant
  const handleDelete = (material: string, size: string) => {
    setCombinedData((prev) =>
      prev.filter((item) => !(item.material === material && item.size === size))
    );
  };
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const handleConfirmDelete = (material: string, size: string) => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: () => handleDelete(material, size),
      name: " this variant",
      action: "remove"
    });
  };
  const handleAddVariant = () => {
    setOnAdd(true);
  };

  //RENDER
  const columns = [
    { header: "Image", accessor: "image" },
    {
      header: "Name",
      accessor: "name"
    }
  ];
  const renderRow = (img: FileContent) => (
    <tr
      key={img.fileName}
      className="border-t border-gray-300 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">
        <Image
          src={img.url}
          alt="editImg"
          width={40}
          height={40}
          className="rounded-lg object-cover w-10 h-10"
        />
      </td>
      <td className="px-4 py-2">
        <p className="text-sm dark:text-dark-360">{img.fileName}</p>
      </td>
      <td className="px-4 py-2">
        <Icon
          icon="gg:trash"
          width={18}
          height={18}
          className="text-red-700 cursor-pointer"
          onClick={() => handleRemoveImage(img.fileName)} // Xoá ảnh khi click
        />
      </td>
    </tr>
  );

  const columnsVariant = [
    { header: "Material", accessor: "material" },
    {
      header: "Size",
      accessor: "size"
    },
    {
      header: "Stock",
      accessor: "stock"
    },
    {
      header: "Added",
      accessor: "addOn"
    }
  ];
  const renderRowVariant = (data: CombinedVariant) => {
    return (
      <tr
        key={`${data.material}-${data.size}`}
        className="border-t border-gray-300 text-sm dark:text-dark-360"
      >
        {/* Cột Material */}
        <td className="px-4 py-2">
          <p className="text-sm dark:text-dark-360">{data.material}</p>
        </td>
        {/* Cột Size */}
        <td className="px-4 py-2">
          <p className="text-sm dark:text-dark-360">{data.size}</p>
        </td>
        {/* Cột Stock */}
        <td className="px-4 py-2">
          <p className="text-sm dark:text-dark-360">{data.stock}</p>
        </td>
        {/* Cột AddOn */}
        <td className="px-4 py-2">
          <p className="text-sm dark:text-dark-360">
            {formatCurrency(data.addOn)}
          </p>
        </td>
        {/* Cột Action */}
        <td className="px-4 py-2">
          <Icon
            icon="gg:trash"
            width={18}
            height={18}
            className="text-red-700 cursor-pointer"
            onClick={() => handleConfirmDelete(data.material, data.size)}
          />
        </td>
      </tr>
    );
  };

  const handleSave = async () => {
    if (item) {
      const data: CreateProduct = Object.fromEntries(
        Object.entries({
          name: item.productName,
          cost: parseCurrency(item.price),
          description: item.description,
          images: imageList,
          vouchers: item.vouchers,
          provider: item.provider || undefined,
          category: detailProduct.categoryId || undefined,
          collections: item.collection,
          variants: groupVariants(combinedData)
        }).filter(([_, value]) => value !== undefined)
      ) as unknown as CreateProduct;
      console.log(data);
      const result = await updateInfoProduct(detailProduct.id, data);
      console.log(result);
      if (result) {
        setList((prev) =>
          prev.map((product) =>
            product.id === item.id
              ? {
                  ...product,
                  image: item.image,
                  imageInfo: imageList,
                  productName: item.productName,
                  price: formatCurrency(parseCurrency(item.price)),
                  collection: item.collection,
                  description: item.description,
                  vouchers: item.vouchers,
                  provider: item.provider,
                  category: detailProduct.category || "",
                  variants: groupVariants(combinedData)
                }
              : product
          )
        );

        alert("Update information of product");
      } else {
        alert("Can't update information of product");
      }
    } else alert("No information of product to update");
    console.log("save");
  };
  const handleConfirmSave = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleSave,
      name: " this product",
      action: "update"
    });
  };
  return (
    <>
      <div className="modal-overlay">
        <div className="w-[1200px] h-[700px] rounded-lg background-light800_dark300 items-center justify-start flex flex-col shadow-sm drop-shadow-sm shadow-zinc-700 p-2 gap-3 overflow-y-scroll overflow-x-hidden scrollable">
          <div className="flex flex-row justify-between items-start w-full h-fit">
            <InputEdit
              titleInput="Product Name"
              onChange={(e) =>
                handleChangeProductInputFields("productName", e.target.value)
              }
              width="w-[70%]"
              placeholder={detailProduct.productName}
            />
            <Icon
              icon="iconoir:cancel"
              width={24}
              height={24}
              className="text-dark100_light500 cursor-pointer"
              onClick={() => onBack(false)}
            />
          </div>

          <div className="flex flex-row justify-between items-start w-full h-full">
            <div className="flex flex-col gap-2 w-[45%]">
              <p className="text-text-dark-400">Image List:</p>
              <div className="flex border border-border-color rounded-lg w-full h-fit">
                <TableImport
                  columns={columns}
                  data={imageList}
                  renderRow={renderRow}
                />
              </div>
              <div className="flex w-full h-fit justify-end items-center mt-2">
                <Button
                  className="bg-import-bg-blue hover:bg-import-bg-blue text-primary-100 paragraph-regular p-2 rounded-[20px] gap-[2px] w-fit"
                  onClick={handleAdd}
                >
                  <Icon
                    icon="ic:round-add"
                    height={16}
                    width={16}
                    className="text-primary-100"
                  />
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col flex-grow-0 w-[50%] h-full justify-start gap-4 items-center">
              <div className="flex flex-col gap-4 items-start justify-start w-full h-fit ">
                <div className="flex flex-row gap-4 w-full h-fit">
                  <div className="w-1/2 h-fit gap-4 flex flex-col">
                    <InputUnEdit
                      titleInput="ID"
                      value={detailProduct.id}
                      width="w-full"
                    />
                    <InputUnEdit
                      titleInput="Category"
                      value={detailProduct.category || ""}
                      width="w-full"
                    />
                    {/* <InputEdit
                      titleInput="Collection"
                      onChange={(e) =>
                        handleChangeProductInputFields(
                          "collection",
                          e.target.value
                        )
                      }
                      width="w-full"
                      placeholder="Enter collection"
                    /> */}
                    <InputSelectionProduct
                      width="w-full"
                      titleInput="Collection"
                      options={collectionList}
                      value={nameCollection}
                      onChange={(value) => {
                        setItem((prev) => ({
                          ...prev!,
                          collection: value
                        }));
                      }}
                    />
                  </div>
                  <div className="w-1/2 h-fit gap-4 flex flex-col">
                    <InputSelectionProduct
                      width="w-full"
                      titleInput="Voucher"
                      options={voucherList}
                      value={nameVoucher}
                      onChange={(value) => {
                        setItem((prev) => ({
                          ...prev!,
                          vouchers: value
                        }));
                      }}
                    />

                    <InputEdit
                      titleInput="Price"
                      onChange={(e) =>
                        handleChangeProductInputFields("price", e.target.value)
                      }
                      width="w-full"
                      placeholder={detailProduct.price}
                    />
                    <InputSelectionProduct
                      width="w-full"
                      titleInput="Provider"
                      options={providerList}
                      value={nameProvider}
                      onChange={(value) => {
                        setItem((prev) => ({
                          ...prev!,
                          provider: value
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full h-fit">
                  <InputEdit
                    titleInput="Description"
                    onChange={(e) =>
                      handleChangeProductInputFields(
                        "description",
                        e.target.value
                      )
                    }
                    width="w-full"
                    placeholder={detailProduct.description}
                  />
                </div>

                <div className="flex flex-col gap-4 w-full h-fit">
                  <div className="w-full h-fit flex justify-end items-end">
                    <Button
                      onClick={handleAddVariant}
                      className="bg-primary-100 hover:bg-primary-100 text-dark-100 paragraph-regular py-2 px-3 rounded-lg w-fit"
                    >
                      Add more Material
                    </Button>
                  </div>
                  <div className="flex border border-border-color rounded-lg w-full h-fit">
                    <TableImport
                      columns={columnsVariant}
                      data={combinedData}
                      renderRow={renderRowVariant}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full items-center pr-4 pb-2">
                <Button
                  className="bg-green-600 hover:bg-green-600 text-dark-100 paragraph-regular py-2 px-3 rounded-lg w-fit"
                  onClick={handleConfirmSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Input file ẩn để chọn file */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple // Cho phép chọn nhiều file
          onChange={handleFileChange}
        />
      </div>

      {isConfirm && <ConfirmModal confirm={confirm} />}
      {onAdd && (
        <AddVariant setCombinedData={setCombinedData} setOnAdd={setOnAdd} />
      )}
    </>
  );
};

export default ProductEdit;
