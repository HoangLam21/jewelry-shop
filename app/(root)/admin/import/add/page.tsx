"use client";
import AddImport from "@/components/admin/import/AddImport";
import ImportList from "@/components/admin/import/ImportList";
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
        title="Add Import"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        onClickFirstButton={handleBack}
        type={1}
      ></Headers>
      <AddImport />
    </div>
  );
};

export default Page;
