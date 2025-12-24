"use client";
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

  const handleAddStaff = () => {
    router.push(`/admin/customer/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Customer"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Customer"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddStaff}
        type={2}
      ></Headers>
      <CustomerList />
    </div>
  );
};

export default Page;
