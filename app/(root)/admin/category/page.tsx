"use client";
import CategoryList from "@/components/admin/category/CategoryList";
import CustomerList from "@/components/admin/customer/CustomerList";
import StaffList from "@/components/admin/staff/StaffList";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleAddCategory = () => {
    router.push(`/admin/category/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Category"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Category"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddCategory}
        type={2}
      ></Headers>
      <CategoryList />
    </div>
  );
};

export default Page;
