"use client";
import ProviderInformation from "@/components/admin/provider/ProviderInformation";
import StaffInformation from "@/components/admin/staff/StaffInformation";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation"; // Đúng cách sử dụng trong App Router
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const handleAddProvider = () => {
    router.push(`/admin/provider/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Provider Detail"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Provider"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddProvider}
        type={2}
      ></Headers>
      <ProviderInformation />
    </div>
  );
};

export default Page;
