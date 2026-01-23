// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import LabelInformation from "@/components/shared/label/LabelInformation";
// import TitleSession from "@/components/shared/label/TitleSession";
// import TableImport from "@/components/shared/table/TableImport";
// import { format } from "date-fns";
// import Image from "next/image";
// import { getOrderById } from "@/lib/service/order.service";
// import { DetailOrder, Order } from "@/dto/OrderDTO";

// const columns = [
//   { header: "Product Image", accessor: "productImage" },
//   { header: "Product Name", accessor: "productName" },
//   { header: "Material", accessor: "material" },
//   { header: "Size", accessor: "size" },
//   { header: "Quantity", accessor: "quantity" },
//   { header: "Unit Price", accessor: "unitPrice" },
//   { header: "Order Status", accessor: "orderStatus" },
// ];

// const OrderDetail = () => {
//   const { id } = useParams() as { id: string };
//   const [orderDetail, setOrderDetail] = useState<any | null>(null);

//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         if (id) {
//           const foundItem = await getOrderById(id);
//           console.log(foundItem, "setail order");
//           setOrderDetail(foundItem);
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy thông tin nhân viên:", error);
//       }
//     };

//     fetchStaffData();
//   }, [id]);

//   if (!orderDetail) {
//     return (
//       <div className="flex h-[90vh] items-center justify-center bg-white">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   const processedData = orderDetail.products.map((product: any) => ({
//     productImage: product.product.files[0]?.url || "",
//     productName: product.product.name,
//     material: product.material,
//     size: product.size,
//     quantity: product.quantity,
//     unitPrice: product.product.cost,
//     discount: product.discount,
//     orderId: orderDetail.order._id,
//     orderStatus: orderDetail.order.status,
//   }));

//   // const renderRow = (it: any) => (
//   //   <>
//   //     <tr
//   //       key={it.id}
//   //       className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
//   //     >
//   //       <td className="px-4 py-2">
//   //         <div className="flex items-center">
//   //           <div className="w-[50px] h-115px ">
//   //             <Image
//   //               src={it.products.product.files.url}
//   //               alt="productImage"
//   //               width={50}
//   //               height={115}
//   //               className="rounded-md object-cover w-full h-full"
//   //             />
//   //           </div>
//   //         </div>
//   //       </td>
//   //       <td className="px-4 py-2">{it.products.product.name}</td>
//   //       <td className="px-4 py-2">{it.order.details.id}</td>
//   //       <td className="px-4 py-2">{it.order.details.material}</td>
//   //       <td className="px-4 py-2">{it.order.details.size}</td>
//   //       <td className="px-4 py-2">{it.order.details.quantity}</td>
//   //       <td className="px-4 py-2">{it.order.details.unitPrice}</td>
//   //       <td className="px-4 py-2">{it.order.details.discount}</td>
//   //     </tr>
//   //   </>
//   // );

//   const renderRow = (item: any) => (
//     <tr
//       key={item.orderId + item.productName}
//       className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
//     >
//       <td className="px-4 py-2">
//         <div className="flex items-center">
//           <div className="w-[50px] h-115px">
//             <Image
//               src={item.productImage}
//               alt="productImage"
//               width={50}
//               height={115}
//               className="rounded-md object-cover w-full h-full"
//             />
//           </div>
//         </div>
//       </td>
//       <td className="px-4 py-2">{item.productName}</td>
//       <td className="px-4 py-2">{item.material}</td>
//       <td className="px-4 py-2">{item.size}</td>
//       <td className="px-4 py-2">{item.quantity}</td>
//       <td className="px-4 py-2">
//         {item.unitPrice.toLocaleString("vi-VN")} VND
//       </td>
//       <td className="px-4 py-2">{item.orderStatus}</td>
//     </tr>
//   );

//   return (
//     <div className="w-full h-full rounded-md shadow-md">
//       <div className="p-4 flex flex-col gap-4">
//         {/* Import Information */}
//         <div className="w-full flex gap-20 items-center">
//           <div className="flex-1 grid grid-cols-1">
//             <LabelInformation title="Id" content={`# ${id}`} />
//             <LabelInformation
//               title="Create At"
//               content={`${format(orderDetail.order.createAt, "PPP")}`}
//             />
//             <LabelInformation
//               title="Status"
//               content={`${orderDetail.order.status}`}
//             />
//             <LabelInformation
//               title="Created By"
//               content={`${orderDetail.order.staff._id}`}
//             />
//           </div>
//         </div>

//         {/* Supplier Information */}
//         <TitleSession title="Supplier Information" />
//         <div className="grid grid-cols-1 gap-2 ">
//           <LabelInformation
//             title="Name"
//             content={`${orderDetail.order.staff.fullName}`}
//           />
//           <LabelInformation
//             title="Phone number"
//             content={`${orderDetail.order.staff.phoneNumber}`}
//           />
//           <LabelInformation
//             title="Address"
//             content={`${orderDetail.order.staff.address}`}
//           />
//         </div>

//         {/* Invoice Detail */}

//         <TitleSession title="Order Detail" />
//         <p className="font-semibold text-[16px]">Purchased product</p>
//         <TableImport
//           columns={columns}
//           data={processedData}
//           renderRow={renderRow}
//         />

//         <div className="w-full flex flex-col justify-start items-end py-8">
//           <div className="w-1/3 flex justify-between">
//             <h3 className="font-semibold text-[20px]">
//               Sub Total (Before Discount):
//             </h3>
//             <p className="text-[16px]">
//               {(
//                 orderDetail.order.cost /
//                 (1 - orderDetail.order.discount / 100)
//               ).toLocaleString("vi-VN")}{" "}
//               VND
//             </p>
//           </div>
//           <div className="w-1/3 flex justify-between">
//             <h3 className="font-semibold text-[20px]">Discount:</h3>
//             <p className="text-[16px]">{orderDetail.order.discount}%</p>
//           </div>
//           <div className="w-1/3 flex justify-between">
//             <h3 className="font-semibold text-[20px]">
//               Total (After Discount):
//             </h3>
//             <p className="text-[16px]">
//               {orderDetail.order.cost.toLocaleString("vi-VN")} VND
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { getOrderById } from "@/lib/service/order.service";
import TableImport from "@/components/shared/table/TableImport";
import {
  ShoppingCart,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  Package,
  Tag,
  Receipt,
} from "lucide-react";

const columns = [
  { header: "Product Image", accessor: "productImage" },
  { header: "Product Name", accessor: "productName" },
  { header: "Material", accessor: "material" },
  { header: "Size", accessor: "size" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Unit Price", accessor: "unitPrice" },
  { header: "Status", accessor: "orderStatus" },
];

const OrderDetail = () => {
  const { id } = useParams() as { id: string };
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        if (id) {
          const foundItem = await getOrderById(id);
          setOrderDetail(foundItem);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        </div>
      </div>
    );
  }

  const processedData = orderDetail.products.map((product: any) => ({
    productImage: product.product.files[0]?.url || "",
    productName: product.product.name,
    material: product.material,
    size: product.size,
    quantity: product.quantity,
    unitPrice: product.product.cost,
    discount: product.discount,
    orderId: orderDetail.order._id,
    orderStatus: orderDetail.order.status,
  }));

  const statusConfig = orderDetail.order.status
    ? {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Delivered",
    }
    : {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      icon: <Clock className="w-5 h-5" />,
      label: "Pending",
    };

  const renderRow = (item: any) => (
    <tr
      key={item.orderId + item.productName}
      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900 dark:text-white">
          {item.productName}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-600 dark:text-gray-400">
          {item.material}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-600 dark:text-gray-400">{item.size}</span>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-900 dark:text-white">
          {item.quantity}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900 dark:text-white">
          {item.unitPrice.toLocaleString("vi-VN")} ₫
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </td>
    </tr>
  );

  const subTotal =
    orderDetail.order.cost / (1 - orderDetail.order.discount / 100);

  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="flex-1 grid grid-cols-1">
            <LabelInformation title="Id" content={`# ${id}`} />
            <LabelInformation
              title="Create At"
              content={`${format(orderDetail.order.createAt, "PPP")}`}
            />
            <LabelInformation
              title="Status"
              content={`${orderDetail.order.status}`}
            />
            <LabelInformation
              title="Created By"
              content={`${orderDetail.order.staff._id}`}
            />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Supplier Information" />
        <div className="grid grid-cols-1 gap-2 ">
          <LabelInformation
            title="Name"
            content={`${orderDetail.order.staff.fullName}`}
          />
          <LabelInformation
            title="Phone number"
            content={`${orderDetail.order.staff.phoneNumber}`}
          />
          <LabelInformation
            title="Address"
            content={`${orderDetail.order.staff.address}`}
          />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Staff Name</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {orderDetail.order.staff.fullName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Phone Number</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {orderDetail.order.staff.phoneNumber}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Address</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {orderDetail.order.staff.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Purchased Products
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TableImport
            columns={columns}
            data={processedData}
            renderRow={renderRow}
          />
        </div>

        {/* Price Summary Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-md ml-auto space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Subtotal (Before Discount):
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {subTotal.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Discount:
                </span>
              </div>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {orderDetail.order.discount}%
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-gray-600 pt-3"></div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount:
                </span>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {orderDetail.order.cost.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
