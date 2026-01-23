"use client";
import OrderList from "@/components/admin/order/OrderList";
import Headers from "@/components/shared/header/Headers";
import { fetchOrder } from "@/lib/service/order.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Package } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrder();

        if (isMounted) {
          setOrderData(data || []);
        }
      } catch (error) {
        console.error("Error loading Order:", error);
        if (isMounted) {
          setOrderData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadOrder();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!orderData || orderData.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      const exportData = orderData.map((order) => ({
        "Order ID": `#00${order._id}`,
        "Created At": new Date(order.createAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        "Created By": order.staff?.fullName || "N/A",
        Customer: order.customer?.fullName || "N/A",
        "Total Amount": `${order.cost.toLocaleString("vi-VN")} VND`,
        Status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        "Shipping Method": order.shippingMethod || "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 18 },
        { wch: 12 },
        { wch: 15 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      const fileName = `Orders_Export_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      XLSX.writeFile(wb, fileName);

      // Success notification
      setTimeout(() => {
        alert("Orders exported successfully!");
      }, 100);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddOrder = () => {
    router.push(`/admin/order/add`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100/10 rounded-xl">
              <Package className="w-6 h-6 text-primary-100" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Order Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {loading
                  ? "Loading orders..."
                  : `Manage and track ${
                      orderData?.length || 0
                    } order${orderData?.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <Headers
            title=""
            firstIcon="clarity:export-line"
            titleFirstButton={isExporting ? "Exporting..." : "Export Excel"}
            secondIcon="mingcute:add-line"
            titleSecondButton="Create Order"
            onClickFirstButton={handleExport}
            onClickSecondButton={handleAddOrder}
            type={2}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
          <OrderList
            orderData={orderData}
            setOrderData={setOrderData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
