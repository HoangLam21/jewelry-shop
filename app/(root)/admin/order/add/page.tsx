"use client";
import ImportList from "@/components/admin/import/ImportList";
import AddOrder from "@/components/admin/order/AddOrder";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Order"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        onClickFirstButton={handleBack}
        type={1}
      ></Headers>
      <AddOrder />
    </div>
  );
};

export default Page;
