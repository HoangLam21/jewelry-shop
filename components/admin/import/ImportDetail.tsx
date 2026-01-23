"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TableImport from "@/components/shared/table/TableImport";
import { format } from "date-fns";
import Image from "next/image";
import { getImportById } from "@/lib/service/import.service";
import {
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  ShoppingCart,
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

const ImportDetail = () => {
  const { id } = useParams() as { id: string };
  const [isImport, setIsImport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        if (id) {
          const foundItem = await getImportById(id);
          setIsImport(foundItem);
        }
      } catch (error) {
        console.error("Error fetching import:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading import details...
          </p>
        </div>
      </div>
    );
  }

  if (!isImport) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Import not found</p>
        </div>
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

  const statusConfig = isImport.order.status
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

  return (
    <div className="w-full space-y-6">
      {/* Import Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Import Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Import ID: #{id.slice(-8)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Import ID</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                #{id.slice(-8)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {format(new Date(isImport.order.createAt), "MMM dd, yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Created By</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {isImport.order.staff.fullName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                {statusConfig.icon}
                <span className="text-sm font-medium">Status</span>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Supplier Information
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Supplier Name</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {isImport.order.provider.fullname}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Phone Number</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {isImport.order.provider.contact}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Address</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {isImport.order.provider.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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

        {/* Total Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between max-w-md ml-auto">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Amount:
              </span>
            </div>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {isImport.order.totalCost.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDetail;
