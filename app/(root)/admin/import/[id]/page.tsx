"use client";
import ImportDetail from "@/components/admin/import/ImportDetail";
import Headers from "@/components/shared/header/Headers";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Download, ArrowLeft } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isExporting, setIsExporting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Your export logic here
    setTimeout(() => {
      setIsExporting(false);
      alert("Export completed!");
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Import Invoice
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Invoice ID: #{id.slice(-8)}
              </p>
            </div>
          </div>

          <Headers
            title=""
            firstIcon="iconoir:cancel"
            titleFirstButton="Back"
            secondIcon="mingcute:add-line"
            titleSecondButton="New Import"
            onClickFirstButton={handleBack}
            onClickSecondButton={handleAddImport}
            type={2}
          />
        </div>

        {/* Content */}
        <ImportDetail />

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
