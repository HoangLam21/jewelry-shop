// import React from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";

// const Table = ({
//   columns,
//   renderRow,
//   data,
//   onSort,
//   index,
// }: {
//   columns: { header: string; accessor: string; className?: string }[];
//   renderRow: (item: any) => React.ReactNode;
//   data: any[];
//   onSort: (key: string) => void; // Accept string as SortableKey
//   index?: number;
// }) => {
//   return (
//     <table className="w-full border-collapse">
//       <thead>
//         <tr className="text-left text-xs md:text-sm dark:text-dark-360">
//           {columns.map((col) => (
//             <th
//               key={col.accessor}
//               className={`relative p-2 md:p-4 ${col.className || ""}`}
//             >
//               <div className="flex items-center">
//                 <span>{col.header}</span>
//                 <div
//                   className="px-2 inline-flex items-center dark:text-dark-360 hover:cursor-pointer"
//                   onClick={() => onSort(col.accessor)} // Pass column key for sorting
//                 >
//                   <Icon
//                     icon="mi:sort"
//                     className="text-gray-800 dark:text-white"
//                     width={18}
//                     height={18}
//                   />
//                 </div>
//               </div>
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <React.Fragment key={item.id || JSON.stringify(item)}>
//             {renderRow(item)}
//           </React.Fragment>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Table;

import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Table = ({
  columns,
  renderRow,
  data,
  onSort,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  onSort: (key: string) => void;
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-300 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-dark-400 border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`relative px-6 py-4 text-left ${col.className || ""}`}
              >
                <div className="flex items-center gap-2 group">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {col.header}
                  </span>
                  <button
                    onClick={() => onSort(col.accessor)}
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    <Icon
                      icon="heroicons:arrows-up-down-20-solid"
                      className="text-gray-600 dark:text-gray-400"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.length > 0 ? (
            data.map((item, index) => (
              <React.Fragment key={item._id || item.id || index}>
                {renderRow(item)}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Icon
                      icon="tabler:database-off"
                      width={32}
                      height={32}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                      No data found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
