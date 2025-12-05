import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import sortIcon from "@iconify/icons-mi/sort";

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
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <React.Fragment key={item.id || JSON.stringify(item)}>
            {renderRow(item)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableImport;
