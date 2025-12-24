"use client";
import ImportList from "@/components/admin/import/ImportList";
import Headers from "@/components/shared/header/Headers";
import { Import } from "@/dto/ImportDTO";
import { fetchImport } from "@/lib/service/import.service";
import { fetchProvider } from "@/lib/service/provider.service";
import { useRouter } from "next/navigation";
import React, { Provider, useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [importData, setImportData] = useState<any[] | null>([]);

  useEffect(() => {
    let isMounted = true;
    const loadImport = async () => {
      try {
        const data = await fetchImport();

        console.log(data, "this is data of import");

        if (isMounted) {
          setImportData(data);
        }
      } catch (error) {
        console.error("Error loading Provider:", error);
      }
    };
    loadImport();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!importData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  console.log(importData, "this is import");
  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Import"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Import"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddImport}
        type={2}
      ></Headers>
      <ImportList importData={importData} setImportData={setImportData} />
    </div>
  );
};

export default Page;
