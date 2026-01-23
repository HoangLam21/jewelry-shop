// "use client";
// import EditImport from "@/components/admin/import/EditImport";
// import Headers from "@/components/shared/header/Headers";
// import { useRouter } from "next/navigation";
// import React from "react";

// const Page = () => {
//   const router = useRouter();

//   const handleBack = () => {
//     router.back();
//   };

//   const handleAddImport = () => {
//     router.push(`/admin/import/add`);
//   };

//   return (
//     <div className="w-full h-full p-4 flex flex-col gap-4">
//       <Headers
//         title="Edit Import"
//         firstIcon="iconoir:cancel"
//         titleFirstButton="Cancel"
//         secondIcon="mingcute:add-line"
//         titleSecondButton="Add Import"
//         onClickFirstButton={handleBack}
//         onClickSecondButton={handleAddImport}
//         type={2}
//       ></Headers>
//       <EditImport />
//     </div>
//   );
// };

// export default Page;
"use client";
import EditImport from "@/components/admin/import/EditImport";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Plus, Edit3 } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleAddImport = () => {
    router.push(`/admin/import/add`);
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Edit3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Import
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Modify import order details
                </p>
              </div>
            </div>
          </div>

          <Headers
            title=""
            firstIcon="iconoir:cancel"
            titleFirstButton="Cancel"
            secondIcon="mingcute:add-line"
            titleSecondButton="New Import"
            onClickFirstButton={handleBack}
            onClickSecondButton={handleAddImport}
            type={2}
          />
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <EditImport />
        </div>
      </div>
    </div>
  );
};

export default Page;
