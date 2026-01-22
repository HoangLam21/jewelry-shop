"use client";
import EditImport from "@/components/admin/import/EditImport";
import EditOrder from "@/components/admin/order/EditOrder";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleAddOrder = () => {
    router.push(`/admin/order/add`);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Edit Order"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Order"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddOrder}
        type={2}
      ></Headers>
      <EditOrder />
    </div>
  );
};

export default Page;
