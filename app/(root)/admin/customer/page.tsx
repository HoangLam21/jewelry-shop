"use client";
import CustomerList from "@/components/admin/customer/CustomerList";
import Headers from "@/components/shared/header/Headers";
import { fetchCustomer } from "@/lib/service/customer.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Order {
  _id: string;
  cost: number;
  discount: number;
  details: {
    additionalProp1?: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp2?: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp3?: {
      material: string;
      size: string;
      quantity: number;
    };
  };
  status: string;
  shippingMethod: string;
  ETD: string;
  customer: string;
  staff: string;
  createAt: string;
}

interface CustomerResponse {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  point: number;
  sales: number;
  orders: Order[];
}

const Page = () => {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch customer data
      const customers: CustomerResponse[] = await fetchCustomer();

      if (!customers || customers.length === 0) {
        alert("No customer data available to export.");
        setIsExporting(false);
        return;
      }

      // Prepare data for export
      const customerData = customers.map((item, index) => {
        // Calculate total sales from orders (cost - discount)
        const totalSales = item.orders.reduce(
          (sum, order) => sum + (order.cost - order.discount),
          0
        );

        // Count orders by status
        const completedOrders = item.orders.filter(
          (o) => o.status.toLowerCase() === "completed"
        ).length;
        const pendingOrders = item.orders.filter(
          (o) => o.status.toLowerCase() === "pending"
        ).length;

        // Calculate average order value
        const avgOrderValue =
          item.orders.length > 0 ? totalSales / item.orders.length : 0;

        // Get last order date
        const lastOrderDate =
          item.orders.length > 0
            ? new Date(
                Math.max(
                  ...item.orders.map((o) => new Date(o.createAt).getTime())
                )
              )
            : null;

        return {
          No: index + 1,
          "Customer ID": item._id,
          "Full Name": item.fullName,
          "Phone Number": item.phoneNumber,
          Email: item.email,
          Address: item.address || "N/A",
          "Loyalty Points": item.point,
          "Total Orders": item.orders.length,
          "Completed Orders": completedOrders,
          "Pending Orders": pendingOrders,
          "Total Sales (VND)": totalSales.toLocaleString("vi-VN"),
          "Avg Order Value (VND)": avgOrderValue.toFixed(0),
          "Last Order Date": lastOrderDate
            ? lastOrderDate.toLocaleDateString("vi-VN")
            : "N/A",
        };
      });

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(customerData);

      // Set column widths for better readability
      const wscols = [
        { wch: 5 }, // No
        { wch: 25 }, // Customer ID
        { wch: 25 }, // Full Name
        { wch: 15 }, // Phone Number
        { wch: 30 }, // Email
        { wch: 40 }, // Address
        { wch: 12 }, // Loyalty Points
        { wch: 12 }, // Total Orders
        { wch: 15 }, // Completed Orders
        { wch: 13 }, // Pending Orders
        { wch: 18 }, // Total Sales
        { wch: 18 }, // Avg Order Value
        { wch: 15 }, // Last Order Date
      ];
      ws["!cols"] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Customers");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `customers_report_${timestamp}.xlsx`;

      // Write file
      XLSX.writeFile(wb, filename);

      // Success notification
      setTimeout(() => {
        alert(
          `Successfully exported ${customers.length} customers to ${filename}\n\n` +
            `Total Sales: ${customerData
              .reduce((sum, c) => {
                const sales = parseFloat(
                  c["Total Sales (VND)"].replace(/\./g, "")
                );
                return sum + sales;
              }, 0)
              .toLocaleString("vi-VN")} VND\n` +
            `Total Orders: ${customerData.reduce((sum, c) => sum + c["Total Orders"], 0)}`
        );
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  const handleAddCustomer = () => {
    router.push(`/admin/customer/add`);
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col gap-6">
      <Headers
        title="Customers"
        firstIcon={
          isExporting ? "line-md:loading-twotone-loop" : "clarity:export-line"
        }
        titleFirstButton={isExporting ? "Exporting..." : "Export Report"}
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Customer"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddCustomer}
        type={2}
      />
      <CustomerList />
    </div>
  );
};

export default Page;
