import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const TableInvoice = ({
  columns,
  renderRow,
  data,
  onSort,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any, index: number) => React.ReactNode; // pass index
  data: any[];
  onSort: (key: string) => void; // Accept string as SortableKey
}) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left text-xs md:text-sm dark:text-dark-360">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`relative p-2 md:p-4 ${col.className || ""}`}
            >
              <div className="flex items-center">
                <span>{col.header}</span>
                <div
                  className="px-2 inline-flex items-center dark:text-dark-360 hover:cursor-pointer"
                  onClick={() => onSort(col.accessor)} // Pass column key for sorting
                >
                  <Icon
                    icon="mi:sort"
                    className="text-gray-800 dark:text-white"
                    width={18}
                    height={18}
                  />
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={item.id + index}>
            {renderRow(item, index)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableInvoice;
