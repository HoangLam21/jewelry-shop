import React from "react";

const TableNoSortIndex = ({
  columns,
  renderRow,
  data
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any, index: number) => React.ReactNode; // pass index
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
        {data.map((item, index) => (
          <React.Fragment key={item.id + index}>
            {renderRow(item, index)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableNoSortIndex;
