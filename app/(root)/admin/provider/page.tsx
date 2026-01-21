// "use client";
// import ProviderList from "@/components/admin/provider/ProviderList";
// import StaffList from "@/components/admin/staff/StaffList";
// import Headers from "@/components/shared/header/Headers";
// import { Provider } from "@/dto/ProviderDTO";
// import { fetchProvider } from "@/lib/service/provider.service";
// import { formatDate } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import router from "next/router";
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const Page = () => {
//   const router = useRouter();
//   const [provider, setProvider] = useState<Provider[] | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     const loadProvider = async () => {
//       try {
//         const data = await fetchProvider();
//         if (isMounted) {
//           setProvider(data || []);
//         }
//       } catch (error) {
//         console.error("Error loading Provider:", error);
//         if (isMounted) {
//           setProvider([]);
//         }
//       }
//     };
//     loadProvider();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleExport = () => {
//     if (!provider || provider.length === 0) {
//       alert("No provider data available to export.");
//       return;
//     }

//     // Prepare data for export (map the providers to a plain object)
//     const providerData = provider.map((provider) => ({
//       ID: provider._id,
//       Name: provider.name,
//       Address: provider.address,
//       Contact: provider.contact,
//     }));

//     // Create a new workbook
//     const ws = XLSX.utils.json_to_sheet(providerData); // Convert JSON to sheet
//     const wb = XLSX.utils.book_new(); // Create a new workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Providers"); // Append the sheet to the workbook

//     // Write the file to a Blob and trigger the download
//     XLSX.writeFile(wb, "provider_list.xlsx");
//   };

//   const handleAddProvider = () => {
//     router.push(`/admin/provider/add`);
//   };
//   return (
//     <div className="w-full h-full p-4 flex flex-col gap-4">
//       <Headers
//         title="Provider"
//         firstIcon="clarity:export-line"
//         titleFirstButton="Export"
//         secondIcon="mingcute:add-line"
//         titleSecondButton="Add Provider"
//         onClickFirstButton={handleExport}
//         onClickSecondButton={handleAddProvider}
//         type={2}
//       ></Headers>
//       <ProviderList provider={provider} setProvider={setProvider} />
//     </div>
//   );
// };

// export default Page;

"use client";
import ProviderList from "@/components/admin/provider/ProviderList";
import Headers from "@/components/shared/header/Headers";
import { Provider } from "@/dto/ProviderDTO";
import { fetchProvider } from "@/lib/service/provider.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProvider = async () => {
      try {
        const data = await fetchProvider();
        if (isMounted) {
          setProvider(data || []);
        }
      } catch (error) {
        console.error("Error loading Provider:", error);
        if (isMounted) {
          setProvider([]);
        }
      }
    };
    loadProvider();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!provider || provider.length === 0) {
      alert("No provider data available to export.");
      return;
    }

    setIsExporting(true);

    try {
      // Prepare data for export with better formatting
      const providerData = provider.map((item, index) => ({
        No: index + 1,
        "Provider ID": item._id,
        "Provider Name": item.name,
        Address: item.address,
        "Contact Number": item.contact,
      }));

      // Create a new workbook
      const ws = XLSX.utils.json_to_sheet(providerData);

      // Set column widths
      const wscols = [
        { wch: 5 }, // No
        { wch: 25 }, // Provider ID
        { wch: 30 }, // Provider Name
        { wch: 40 }, // Address
        { wch: 15 }, // Contact Number
      ];
      ws["!cols"] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Providers");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `providers_${timestamp}.xlsx`;

      // Write the file
      XLSX.writeFile(wb, filename);

      // Success notification
      setTimeout(() => {
        alert(
          `Successfully exported ${provider.length} providers to ${filename}`
        );
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  const handleAddProvider = () => {
    router.push(`/admin/provider/add`);
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col gap-6">
      <Headers
        title="Providers"
        firstIcon={
          isExporting ? "line-md:loading-twotone-loop" : "clarity:export-line"
        }
        titleFirstButton={isExporting ? "Exporting..." : "Export"}
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Provider"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddProvider}
        type={2}
      />
      <ProviderList provider={provider} setProvider={setProvider} />
    </div>
  );
};

export default Page;
