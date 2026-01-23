"use client";
import ImportList from "@/components/admin/import/ImportList";
import Headers from "@/components/shared/header/Headers";
import { fetchImport } from "@/lib/service/import.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { PackageOpen } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [importData, setImportData] = useState<any[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadImport = async () => {
      try {
        setLoading(true);
        const data = await fetchImport();

        if (isMounted) {
          setImportData(data || []);
        }
      } catch (error) {
        console.error("Error loading Import:", error);
        if (isMounted) {
          setImportData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
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
      const exportData = importData.map((item) => ({
        "Import ID": `#00${item._id}`,
        "Created At": new Date(item.createAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        "Created By": item.staff?.fullName || "N/A",
        "Total Cost": `${item.totalCost.toLocaleString("vi-VN")} VND`,
        Status: item.status ? "Delivered" : "Pending",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 18 },
        { wch: 12 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Imports");

      const fileName = `Imports_Export_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      XLSX.writeFile(wb, fileName);

      setTimeout(() => {
        alert("Imports exported successfully!");
      }, 100);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
              <PackageOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Import Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {loading
                  ? "Loading imports..."
                  : `Manage and track ${
                      importData?.length || 0
                    } import${importData?.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <Headers
            title=""
            firstIcon="clarity:export-line"
            titleFirstButton={isExporting ? "Exporting..." : "Export Excel"}
            secondIcon="mingcute:add-line"
            titleSecondButton="Create Import"
            onClickFirstButton={handleExport}
            onClickSecondButton={handleAddImport}
            type={2}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
          <ImportList
            importData={importData}
            setImportData={setImportData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
