import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const TitleSession = ({ icon, title }: { icon?: string; title: string }) => {
  return (
    <div className="w-full h-14 flex items-center text-text-dark-500 font-semibold gap-2 border-b border-border-color">
      {icon ? (
        <>
          <Icon
            icon={icon}
            className="text-[18px]  text-black" // Biểu tượng filter
          />
          <p className="text-[16px]  text-black">{title}:</p>
        </>
      ) : (
        <>
          <p className="text-[16px]  text-black">{title}:</p>
        </>
      )}
    </div>
  );
};

export default TitleSession;
