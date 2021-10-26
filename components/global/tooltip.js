import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";

const Tooltip = ({ text, caption }) => {
  const content = <div className="flex text-center py-1 text-xs">{caption}</div>;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={content} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center cursor-default select-none">
        <span className="dotted hover:no-underline text-sm text-gray-400 text-center">{text}</span>
      </div>
    </Tippy>
  );
};

export default Tooltip;
