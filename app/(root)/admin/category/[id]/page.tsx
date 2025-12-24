"use client";
import CategoryInformation from "@/components/admin/category/CategoryInformation";
import CustomerInformation from "@/components/admin/customer/CustomerInformation";
import StaffInformation from "@/components/admin/staff/StaffInformation";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation"; // Đúng cách sử dụng trong App Router
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const handleAddCategory = () => {
    router.push(`/admin/customer/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Category Detail"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Category"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddCategory}
        type={2}
      ></Headers>
      <CategoryInformation />
    </div>
  );
};

export default Page;
