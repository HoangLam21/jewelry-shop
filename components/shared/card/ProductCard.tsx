import { Product } from "@/components/admin/order/AddOrder";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const ProductFrame = ({
  param,
  onDelete,
  onEdit,
  onDetail,
}: {
  param: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void; // Nhận toàn bộ sản phẩm
  onDetail: (product: Product) => void; // Nhận toàn bộ sản phẩm
}) => {
  return (
    <div className="flex flex-col w-[152px] h-[276px] bg-import-bg-blue rounded-md px-4 py-2 gap-2 shadow-lg">
      <p className="truncate overflow-hidden whitespace-nowrap">#{param.id}</p>
      <div className="flex items-center justify-center pb-2">
        <div
          className="w-[120px] h-[120px] relative  hover:cursor-pointer"
          onClick={() => onDetail(param)}
        >
          <Image
            alt="product-img"
            src={param.image}
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
      <p className="font-semibold text-[14px] truncate overflow-hidden whitespace-nowrap">
        {param.productName}
      </p>
      <p className="font-semibold text-[14px] text-light-500 truncate overflow-hidden whitespace-nowrap">
        {param.price}
      </p>
      <div className="flex justify-end items-center">
        <Icon
          icon="fluent:edit-16-regular"
          width={20}
          height={20}
          className="text-[16px] text-light-500 cursor-pointer"
          onClick={() => onEdit(param)}
        />
        <p className="px-2 text-[16px]">|</p>
        <Icon
          icon="gg:trash"
          width={20}
          height={20}
          className="text-[16px] text-light-500 cursor-pointer"
          onClick={() => onDelete(param.id)} // Trigger the delete action
        />
      </div>
    </div>
  );
};

export default ProductFrame;
