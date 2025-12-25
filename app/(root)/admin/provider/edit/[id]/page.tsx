"use client";
import EditProviderInformation from "@/components/admin/provider/EditProviderInformation";
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
        title="Edit Provider"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Provider"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddProvider}
        type={2}
      ></Headers>
      <EditProviderInformation />
    </div>
  );
};

export default Page;
