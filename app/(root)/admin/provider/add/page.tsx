"use client";
import AddProviderInformation from "@/components/admin/provider/AddProviderInformation";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleAddProvider = () => {
    router.push(`/admin/provider/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Add Provider"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Provider"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddProvider}
        type={2}
      ></Headers>
      <AddProviderInformation />
    </div>
  );
};

export default Page;
