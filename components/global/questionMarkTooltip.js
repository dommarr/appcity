import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";
import { InformationCircleIcon } from "@heroicons/react/solid";

const QuestionMarkTooltip = ({ caption }) => {
  const content = <div className="flex text-center py-1 text-xs">{caption}</div>;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={content} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center cursor-default select-none">
        <InformationCircleIcon className="h-4 w-4 text-gray-400" />
      </div>
    </Tippy>
  );
};

export default QuestionMarkTooltip;
