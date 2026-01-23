import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const TitleSession = ({ icon, title }: { icon?: string; title: string }) => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
      {icon && (
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <Icon
            icon={icon}
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
  );
};

export default TitleSession;
