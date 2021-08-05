import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";
import { InformationCircleIcon } from "@heroicons/react/solid";

const Tooltip = ({ caption }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={caption} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center cursor-pointer select-none">
        <InformationCircleIcon className="h-4 w-4 text-gray-400" />
      </div>
    </Tippy>
  );
};

export default Tooltip;
