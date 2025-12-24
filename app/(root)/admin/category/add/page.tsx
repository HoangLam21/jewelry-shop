"use client";

import AddCategoryInformation from "@/components/admin/category/AddCategory";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleAddCategory = () => {
    router.push(`/admin/category/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Add Category"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Category"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddCategory}
        type={2}
      ></Headers>
      <AddCategoryInformation />
    </div>
  );
};

export default Page;
