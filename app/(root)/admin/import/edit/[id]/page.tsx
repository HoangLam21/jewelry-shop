"use client";
import EditImport from "@/components/admin/import/EditImport";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Edit Import"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Import"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddImport}
        type={2}
      ></Headers>
      <EditImport />
    </div>
  );
};

export default Page;
