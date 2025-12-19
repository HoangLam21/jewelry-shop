"use client";

import React, { useState } from "react";
import classNames from "classnames";

type PagingBarProps = {
  title: string[]; // Array of titles to display
  event: (selectedTitle: string) => void; // Event handler for title click
};

const PagingBar: React.FC<PagingBarProps> = ({ title, event }) => {
  const [activeTitle, setActiveTitle] = useState(title[0]); // Default to the first title

  const handleClick = (selectedTitle: string) => {
    setActiveTitle(selectedTitle); // Update the active title
    event(selectedTitle); // Trigger the parent event
  };

  return (
    <div className="flex items-center justify-between space-x-[60px]  w-2/3">
      {title.map((item, index) => (
        <button
          key={index}
          onClick={() => handleClick(item)}
          className={classNames("text-base font-medium pb-2", {
            " border-primary-100 text-primary-100 font-semibold":
              item === activeTitle,
            "text-gray-500": item !== activeTitle,
          })}
          style={{
            marginTop: "16px", // Title to bar spacing
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default PagingBar;
