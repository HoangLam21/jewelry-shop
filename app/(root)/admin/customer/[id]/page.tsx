"use client";
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

  const handleAddCustomer = () => {
    router.push(`/admin/customer/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Customer Detail"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Customer"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddCustomer}
        type={2}
      ></Headers>
      <CustomerInformation />
    </div>
  );
};

export default Page;
