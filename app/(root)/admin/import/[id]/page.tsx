"use client";
import ImportDetail from "@/components/admin/import/ImportDetail";
import ImportList from "@/components/admin/import/ImportList";
import MyButton from "@/components/shared/button/MyButton";
import on from "@/components/shared/button/MyButton";
import Headers from "@/components/shared/header/Headers";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const handleBack = () => {
    router.back();
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title={`Import Invoice / ${id}`}
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Import"
        onClickFirstButton={handleBack}
        onClickSecondButton={handleAddImport}
        type={2}
      ></Headers>
      <ImportDetail />
      <MyButton
        title="Export"
        icon="clarity:export-line"
        event={handleExport}
        width="w-fit"
        py="py-2"
        background="bg-border-color"
        text_color="text-black"
        border_color="bg-border-color"
      />
    </div>
  );
};

export default Page;
