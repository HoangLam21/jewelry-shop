import React from "react";

const TableImport = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-900/50">
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${
                col.className || ""
              }`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        {data.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {renderRow(item)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableImport;
