"use client";
import { Chart } from "@/components/admin/dashboard/Chart";
import TopProduct from "@/components/admin/dashboard/TopProduct";
import TopSeller from "@/components/admin/dashboard/TopSeller";
import { fetchOrder } from "@/lib/service/order.service";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [orderData, setOrderData] = useState<Order[] | null>([]);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const data = await fetchOrder();

        if (isMounted) {
          setOrderData(data);
        }
      } catch (error) {
        console.error("Error loading Provider:", error);
      }
    };
    loadOrder();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!orderData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full p-4 gap-4">
      <div>
        <Chart />
      </div>
      <div className="grid grid-cols-2 gap-x-8">
        <TopSeller orderData={orderData} />
        <TopProduct orderData={orderData} />
      </div>
    </div>
  );
};

export default Page;
