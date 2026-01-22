// "use client";
// import OrderList from "@/components/admin/order/OrderList";
// import Headers from "@/components/shared/header/Headers";
// import { Order } from "@/dto/OrderDTO";
// import { fetchOrder } from "@/lib/service/order.service";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const Page = () => {
//   const router = useRouter();
//   const [orderData, setOrderData] = useState<Order[] | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     const loadOrder = async () => {
//       try {
//         const data = await fetchOrder();

//         if (isMounted) {
//           setOrderData(data || []);
//         }
//       } catch (error) {
//         console.error("Error loading Order:", error);
//         if (isMounted) {
//           setOrderData([]);
//         }
//       }
//     };
//     loadOrder();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   console.log(orderData, "this iss orrder data");

//   const handleExport = () => {
//     console.log("Export clicked");
//   };

//   const handleAddOrder = () => {
//     router.push(`/admin/order/add`);
//   };

//   return (
//     <div className="w-full h-full p-4 flex flex-col gap-4">
//       <Headers
//         title="Order"
//         firstIcon="clarity:export-line"
//         titleFirstButton="Export"
//         secondIcon="mingcute:add-line"
//         titleSecondButton="Add Order"
//         onClickFirstButton={handleExport}
//         onClickSecondButton={handleAddOrder}
//         type={2}
//       ></Headers>
//       <OrderList orderData={orderData} setOrderData={setOrderData} />
//     </div>
//   );
// };

// export default Page;
"use client";
import OrderList from "@/components/admin/order/OrderList";
import Headers from "@/components/shared/header/Headers";
import { Order } from "@/dto/OrderDTO";
import { fetchOrder } from "@/lib/service/order.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const data = await fetchOrder();

        if (isMounted) {
          setOrderData(data || []);
        }
      } catch (error) {
        console.error("Error loading Order:", error);
        if (isMounted) {
          setOrderData([]);
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
      // Prepare data for export
      const exportData = orderData.map((order, index) => ({
        "Order ID": `#00${order._id}`,
        "Created At": new Date(order.createAt).toLocaleDateString(),
        "Created By": order.staff?.fullName || "N/A",
        "Total Amount": order.cost,
        Status: order.status,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      // Generate filename with current date
      const fileName = `Orders_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Export file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddOrder = () => {
    router.push(`/admin/order/add`);
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <Headers
        title="Order Management"
        firstIcon="clarity:export-line"
        titleFirstButton={isExporting ? "Exporting..." : "Export"}
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Order"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddOrder}
        type={2}
      />

      <div className="bg-white dark:bg-dark-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <OrderList orderData={orderData} setOrderData={setOrderData} />
      </div>
    </div>
  );
};

export default Page;
