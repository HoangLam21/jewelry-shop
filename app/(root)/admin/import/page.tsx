// "use client";
// import ImportList from "@/components/admin/import/ImportList";
// import Headers from "@/components/shared/header/Headers";
// import { Import } from "@/dto/ImportDTO";
// import { fetchImport } from "@/lib/service/import.service";
// import { fetchProvider } from "@/lib/service/provider.service";
// import { useRouter } from "next/navigation";
// import React, { Provider, useEffect, useState } from "react";

// const Page = () => {
//   const router = useRouter();
//   const [importData, setImportData] = useState<any[] | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     const loadImport = async () => {
//       try {
//         const data = await fetchImport();

//         console.log(data, "this is data of import");

//         if (isMounted) {
//           setImportData(data || []);
//         }
//       } catch (error) {
//         console.error("Error loading Import:", error);
//         if (isMounted) {
//           setImportData([]);
//         }
//       }
//     };
//     loadImport();
//     return () => {
//       isMounted = false;
//     };
//   }, []);
//   console.log(importData, "this is import");
//   const handleExport = () => {
//     console.log("Export clicked");
//   };

//   const handleAddImport = () => {
//     router.push(`/admin/import/add`);
//   };

//   return (
//     <div className="w-full h-full p-4 flex flex-col gap-4">
//       <Headers
//         title="Import"
//         firstIcon="clarity:export-line"
//         titleFirstButton="Export"
//         secondIcon="mingcute:add-line"
//         titleSecondButton="Add Import"
//         onClickFirstButton={handleExport}
//         onClickSecondButton={handleAddImport}
//         type={2}
//       ></Headers>
//       <ImportList importData={importData} setImportData={setImportData} />
//     </div>
//   );
// };

// export default Page;

"use client";
import ImportList from "@/components/admin/import/ImportList";
import Headers from "@/components/shared/header/Headers";
import { Import } from "@/dto/ImportDTO";
import { fetchImport } from "@/lib/service/import.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const router = useRouter();
  const [importData, setImportData] = useState<any[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadImport = async () => {
      try {
        const data = await fetchImport();

        if (isMounted) {
          setImportData(data || []);
        }
      } catch (error) {
        console.error("Error loading Import:", error);
        if (isMounted) {
          setImportData([]);
        }
      }
    };
    loadImport();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!importData || importData.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      // Prepare data for export
      const exportData = importData.map((item) => ({
        "Import ID": `#00${item._id}`,
        "Created At": new Date(item.createAt).toLocaleDateString(),
        "Created By": item.staff?.fullName || "N/A",
        "Total Cost": item.totalCost,
        Status: item.status ? "Delivered" : "Pending",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Imports");

      // Generate filename with current date
      const fileName = `Imports_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Export file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <Headers
        title="Import Management"
        firstIcon="clarity:export-line"
        titleFirstButton={isExporting ? "Exporting..." : "Export"}
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Import"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddImport}
        type={2}
      />

      <div className="bg-white dark:bg-dark-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <ImportList importData={importData} setImportData={setImportData} />
      </div>
    </div>
  );
};

export default Page;
