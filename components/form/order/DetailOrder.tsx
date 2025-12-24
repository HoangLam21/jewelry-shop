// import React, { useState } from "react";
// import MyButton from "@/components/shared/button/MyButton";

// const OrderDetailModal = ({ order, isOpen, onClose, onCancelOrder }: any) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="background-light800_dark400 text-dark100_light500 p-6 rounded shadow-lg w-1/2">
//         <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//         <p>
//           <strong>Order ID:</strong> {order._id}
//         </p>
//         <p>
//           <strong>Status:</strong> {order.status}
//         </p>
//         <p>
//           <strong>Cost:</strong> {order.cost.toLocaleString()}
//         </p>
//         <p>
//           <strong>Discount:</strong> {order.discount}
//         </p>
//         <p>
//           <strong>Shipping Method:</strong> {order.shippingMethod}
//         </p>
//         <p>
//           <strong>ETD:</strong> {new Date(order.ETD).toLocaleDateString()}
//         </p>

//         {order.status === "pending" && (
//           <MyButton
//             title="Cancel Order"
//             background="bg-red-500"
//             rounded="none"
//             text_color="text-white"
//             text="text-sm"
//             onClick={() => onCancelOrder(order._id)}
//             width={""}
//           />
//         )}

//         <button
//           className="mt-4 bg-gray-200 text-white px-4 py-2 rounded"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };
// export default OrderDetailModal;

import React from "react";
import MyButton from "@/components/shared/button/MyButton";

const OrderDetailModal = ({ order, isOpen, onClose, onCancelOrder }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="background-light800_dark400 text-dark100_light500 p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        <p>
          <strong>Order ID:</strong> {order?._id}
        </p>
        <p>
          <strong>Status:</strong> {order?.status}
        </p>
        <p>
          <strong>Cost:</strong> {order?.cost.toLocaleString()}
        </p>
        <p>
          <strong>Discount:</strong> {order?.discount}
        </p>
        <p>
          <strong>Shipping Method:</strong> {order?.shippingMethod}
        </p>
        <p>
          <strong>ETD:</strong> {new Date(order?.ETD).toLocaleDateString()}
        </p>

        {/* Hiển thị các sản phẩm */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Products</h3>
          {order.products && order.products.length > 0 ? (
            order.products.map((detail: any, index: number) => (
              <div key={index} className="mb-3 flex">
                <img
                  src={detail?.product.files[0].url}
                  width={100}
                  height={50}
                ></img>
                <div className="ml-3">
                  <p>
                    <strong>Product:</strong> {detail?.product.name}
                  </p>
                  <p>
                    <strong>Material:</strong> {detail?.material}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {detail?.quantity}
                  </p>
                  <p>
                    <strong>Size:</strong> {detail?.size}
                  </p>
                  {/* <p>
                  <strong>Discount:</strong> {detail?.discount}
                </p> */}
                  <p>
                    <strong>Price:</strong>{" "}
                    {(detail?.product.cost * detail?.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No products found for this order.</p>
          )}
        </div>

        {order.status === "pending" && (
          <MyButton
            title="Cancel Order"
            background="bg-red-500"
            rounded="none"
            text_color="text-white"
            text="text-sm"
            onClick={() => onCancelOrder(order._id)}
            width={""}
          />
        )}

        <button
          className="mt-4 flex ml-auto bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;