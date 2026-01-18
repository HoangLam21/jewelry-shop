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
  const [orderData, setOrderData] = useState<Order[] | null>(null);

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

  console.log(orderData, "this iss orrder data");

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleAddOrder = () => {
    router.push(`/admin/order/add`);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Order"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Order"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddOrder}
        type={2}
      ></Headers>
      <OrderList orderData={orderData} setOrderData={setOrderData} />
    </div>
  );
};

export default Page;
