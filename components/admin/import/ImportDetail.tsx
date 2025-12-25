import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ImportData } from "@/constants/data";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import TableImport from "@/components/shared/table/TableImport";
import { format } from "date-fns";
import Image from "next/image";
import { getImportById } from "@/lib/service/import.service";

interface Invoice {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  discount: number;
}

interface Import {
  id: string;
  suplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: Invoice[];
  status: boolean;
  createAt: Date;
  createBy: string;
}

const columns = [
  { header: "Product Image", accessor: "productImage" },
  { header: "Product Name", accessor: "productName" },
  { header: "Material", accessor: "material" },
  { header: "Size", accessor: "size" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Unit Price", accessor: "unitPrice" },
  { header: "Import Status", accessor: "orderStatus" },
];

const ImportDetail = () => {
  const { id } = useParams() as { id: string };
  const [isImport, setIsImport] = useState<any | null>(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (id) {
          const foundItem = await getImportById(id);
          console.log(foundItem, "setail order");
          setIsImport(foundItem);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      }
    };

    fetchStaffData();
  }, [id]);

  if (!isImport) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  const processedData = isImport.products.map((product: any) => ({
    productImage: product.product.files[0]?.url || "",
    productName: product.product.name,
    material: product.material,
    size: product.size,
    quantity: product.quantity,
    unitPrice: product.product.cost,
    discount: product.discount,
    orderId: isImport.order._id,
    orderStatus: isImport.order.status,
  }));

  console.log(processedData, "processedData");

  console.log(isImport, "isImport");
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
      <td className="px-4 py-2">{item.orderStatus ? "Done" : "Pending"}</td>
    </tr>
  );

  // Calculate the grand total for all invoices in the data

  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="flex-1 grid grid-cols-1">
            <LabelInformation title="ID" content={id} />
            <LabelInformation
              title="Create At"
              content={`${format(isImport.order.createAt, "PPP")}`}
            />
            <LabelInformation
              title="Status"
              content={`${isImport.order.status ? "Done" : "Pending"}`}
            />
            <LabelInformation
              title="Created By"
              content={`${isImport.order.staff.fullName}`}
            />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Supplier Information" />
        <div className="grid grid-cols-1 gap-2 ">
          <LabelInformation
            title="Name"
            content={`${isImport.order.provider.fullname}`}
          />
          <LabelInformation
            title="Phone number"
            content={`${isImport.order.provider.contact}`}
          />
          <LabelInformation
            title="Address"
            content={`${isImport.order.provider.address}`}
          />
        </div>

        {/* Invoice Detail */}

        <TitleSession title="Invoice Detail" />
        <p className="font-semibold text-[16px]">Purchased product</p>
        <TableImport
          columns={columns}
          data={processedData}
          renderRow={renderRow}
        />

        <div className="w-full flex flex-col justify-start items-end py-8">
          <div className="w-1/3 flex gap-4 justify-end items-center">
            <h3 className="font-semibold text-[20px]">Total :</h3>
            <p className="text-[16px]">{isImport.order.totalCost} VND</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDetail;
