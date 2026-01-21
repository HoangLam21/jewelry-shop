// import { Product } from "@/components/admin/order/AddOrder";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Image from "next/image";
// import React from "react";

// const ProductFrame = ({
//   param,
//   onDelete,
//   onEdit,
//   onDetail,
// }: {
//   param: Product;
//   onDelete: (id: string) => void;
//   onEdit: (product: Product) => void; // Nhận toàn bộ sản phẩm
//   onDetail: (product: Product) => void; // Nhận toàn bộ sản phẩm
// }) => {
//   return (
//     <div className="flex flex-col w-[152px] h-[276px] bg-import-bg-blue rounded-md px-4 py-2 gap-2 shadow-lg">
//       <p className="truncate overflow-hidden whitespace-nowrap">#{param.id}</p>
//       <div className="flex items-center justify-center pb-2">
//         <div
//           className="w-[120px] h-[120px] relative  hover:cursor-pointer"
//           onClick={() => onDetail(param)}
//         >
//           <Image
//             alt="product-img"
//             src={param.image}
//             fill
//             className="object-cover rounded-md"
//           />
//         </div>
//       </div>
//       <p className="font-semibold text-[14px] truncate overflow-hidden whitespace-nowrap">
//         {param.productName}
//       </p>
//       <p className="font-semibold text-[14px] text-light-500 truncate overflow-hidden whitespace-nowrap">
//         {param.price}
//       </p>
//       <div className="flex justify-end items-center">
//         <Icon
//           icon="fluent:edit-16-regular"
//           width={20}
//           height={20}
//           className="text-[16px] text-light-500 cursor-pointer"
//           onClick={() => onEdit(param)}
//         />
//         <p className="px-2 text-[16px]">|</p>
//         <Icon
//           icon="gg:trash"
//           width={20}
//           height={20}
//           className="text-[16px] text-light-500 cursor-pointer"
//           onClick={() => onDelete(param.id)} // Trigger the delete action
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductFrame;
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const ProductFrame = ({
  param,
  onDelete,
  onEdit,
  onDetail,
}: {
  param: any;
  onDelete: (id: string) => void;
  onEdit: (product: any) => void;
  onDetail: (product: any) => void;
}) => {
  return (
    <div className="flex flex-col w-[152px] h-[276px] bg-import-bg-blue rounded-xl px-3 py-3 gap-2 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* ID */}
      <p className="text-xs text-light-500 truncate">#{param.id}</p>

      {/* Image */}
      <div className="flex items-center justify-center pb-1">
        <div
          className="w-[120px] h-[120px] relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => onDetail(param)}
        >
          <Image
            alt="product-img"
            src={param.image}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </div>
      </div>

      {/* Name */}
      <p className="font-semibold text-[14px] truncate">{param.productName}</p>

      {/* Price */}
      <p className="font-medium text-[14px] text-light-500 truncate">
        {param.price}
      </p>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3 mt-auto">
        <button
          onClick={() => onEdit(param)}
          className="p-1 rounded hover:bg-white/40 transition"
        >
          <Icon
            icon="fluent:edit-16-regular"
            width={18}
            height={18}
            className="text-light-500 hover:text-primary-100 transition"
          />
        </button>

        <button
          onClick={() => onDelete(param.id)}
          className="p-1 rounded hover:bg-red-100 transition"
        >
          <Icon
            icon="gg:trash"
            width={18}
            height={18}
            className="text-light-500 hover:text-red-500 transition"
          />
        </button>
      </div>
    </div>
  );
};

export default ProductFrame;
