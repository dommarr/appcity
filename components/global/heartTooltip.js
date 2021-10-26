import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";
import { HeartIcon } from "@heroicons/react/outline";

const HeartTooltip = ({ caption }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={caption} touch="hold" placement="bottom">
      <div onClick={handleClick} className="flex justify-center items-center cursor-default select-none xl:mr-4">
        <HeartIcon className={`h-8 w-8 hover:cursor-not-allowed text-gray-300 `} />
      </div>
    </Tippy>
  );
};

export default HeartTooltip;
