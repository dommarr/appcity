import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";

const Tooltip = ({ text, caption }) => {
  //   const capitalize = (s) => {
  //     if (typeof s !== "string") return "";
  //     return s.charAt(0).toUpperCase() + s.slice(1);
  //   };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={caption} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center cursor-pointer select-none">
        <span className="dotted hover:no-underline text-sm text-gray-400 text-center">{text}</span>
      </div>
    </Tippy>
  );
};

export default Tooltip;
