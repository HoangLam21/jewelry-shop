"use client";

import AddCustomerInformation from "@/components/admin/customer/AddCustomer";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleAddCustomer = () => {
    router.push(`/admin/customer/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Add Customer"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Customer"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddCustomer}
        type={2}
      ></Headers>
      <AddCustomerInformation />
    </div>
  );
};

export default Page;
