import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ImportData } from "@/constants/data";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import TableImport from "@/components/shared/table/TableImport";
import { format } from "date-fns";
import Image from "next/image";
import { getOrderById } from "@/lib/service/order.service";
import { DetailOrder, Order } from "@/dto/OrderDTO";

const columns = [
  { header: "Product Image", accessor: "productImage" },
  { header: "Product Name", accessor: "productName" },
  { header: "Material", accessor: "material" },
  { header: "Size", accessor: "size" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Unit Price", accessor: "unitPrice" },
  { header: "Order Status", accessor: "orderStatus" },
];

const OrderDetail = () => {
  const { id } = useParams() as { id: string };
  const [orderDetail, setOrderDetail] = useState<any | null>(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (id) {
          const foundItem = await getOrderById(id);
          console.log(foundItem, "setail order");
          setOrderDetail(foundItem);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      }
    };

    fetchStaffData();
  }, [id]);

  if (!orderDetail) {
    return (
      <div className="flex h-[90vh] items-center justify-center bg-white">
        <div className="loader"></div>
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

  // const renderRow = (it: any) => (
  //   <>
  //     <tr
  //       key={it.id}
  //       className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
  //     >
  //       <td className="px-4 py-2">
  //         <div className="flex items-center">
  //           <div className="w-[50px] h-115px ">
  //             <Image
  //               src={it.products.product.files.url}
  //               alt="productImage"
  //               width={50}
  //               height={115}
  //               className="rounded-md object-cover w-full h-full"
  //             />
  //           </div>
  //         </div>
  //       </td>
  //       <td className="px-4 py-2">{it.products.product.name}</td>
  //       <td className="px-4 py-2">{it.order.details.id}</td>
  //       <td className="px-4 py-2">{it.order.details.material}</td>
  //       <td className="px-4 py-2">{it.order.details.size}</td>
  //       <td className="px-4 py-2">{it.order.details.quantity}</td>
  //       <td className="px-4 py-2">{it.order.details.unitPrice}</td>
  //       <td className="px-4 py-2">{it.order.details.discount}</td>
  //     </tr>
  //   </>
  // );

  const renderRow = (item: any) => (
    <tr
      key={item.orderId + item.productName}
      className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">
        <div className="flex items-center">
          <div className="w-[50px] h-115px">
            <Image
              src={item.productImage}
              alt="productImage"
              width={50}
              height={115}
              className="rounded-md object-cover w-full h-full"
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-2">{item.productName}</td>
      <td className="px-4 py-2">{item.material}</td>
      <td className="px-4 py-2">{item.size}</td>
      <td className="px-4 py-2">{item.quantity}</td>
      <td className="px-4 py-2">
        {item.unitPrice.toLocaleString("vi-VN")} VND
      </td>
      <td className="px-4 py-2">{item.orderStatus}</td>
    </tr>
  );

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

        {/* Invoice Detail */}

        <TitleSession title="Order Detail" />
        <p className="font-semibold text-[16px]">Purchased product</p>
        <TableImport
          columns={columns}
          data={processedData}
          renderRow={renderRow}
        />

        <div className="w-full flex flex-col justify-start items-end py-8">
          <div className="w-1/3 flex justify-between">
            <h3 className="font-semibold text-[20px]">
              Sub Total (Before Discount):
            </h3>
            <p className="text-[16px]">
              {(
                orderDetail.order.cost /
                (1 - orderDetail.order.discount / 100)
              ).toLocaleString("vi-VN")}{" "}
              VND
            </p>
          </div>
          <div className="w-1/3 flex justify-between">
            <h3 className="font-semibold text-[20px]">Discount:</h3>
            <p className="text-[16px]">{orderDetail.order.discount}%</p>
          </div>
          <div className="w-1/3 flex justify-between">
            <h3 className="font-semibold text-[20px]">
              Total (After Discount):
            </h3>
            <p className="text-[16px]">
              {orderDetail.order.cost.toLocaleString("vi-VN")} VND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
