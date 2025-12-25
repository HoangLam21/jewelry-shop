"use client";
import ProviderList from "@/components/admin/provider/ProviderList";
import StaffList from "@/components/admin/staff/StaffList";
import Headers from "@/components/shared/header/Headers";
import { Provider } from "@/dto/ProviderDTO";
import { fetchProvider } from "@/lib/service/provider.service";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import router from "next/router";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider[] | null>([]);

  useEffect(() => {
    let isMounted = true;
    const loadProvider = async () => {
      try {
        const data = await fetchProvider();
        if (isMounted) {
          setProvider(data);
        }
      } catch (error) {
        console.error("Error loading Provider:", error);
      }
    };
    loadProvider();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!provider) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  const handleExport = () => {
    if (!provider || provider.length === 0) {
      alert("No provider data available to export.");
      return;
    }

    // Prepare data for export (map the providers to a plain object)
    const providerData = provider.map((provider) => ({
      ID: provider._id,
      Name: provider.name,
      Address: provider.address,
      Contact: provider.contact,
    }));

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(providerData); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Providers"); // Append the sheet to the workbook

    // Write the file to a Blob and trigger the download
    XLSX.writeFile(wb, "provider_list.xlsx");
  };

  const handleAddProvider = () => {
    router.push(`/admin/provider/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Provider"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Provider"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddProvider}
        type={2}
      ></Headers>
      <ProviderList provider={provider} setProvider={setProvider} />
    </div>
  );
};

export default Page;
