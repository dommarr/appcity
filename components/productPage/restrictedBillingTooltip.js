import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";

const RestrictedBillingTooltip = ({ monthly, large }) => {
  const content = <div className="flex text-center py-1 text-xs">For {monthly ? "yearly" : "monthly"} billing, contact the app developer.</div>;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (large)
    return (
      <Tippy content={content} touch="hold">
        <div onClick={handleClick} className="cursorrelative self-center mt-8 bg-gray-200 p-0.5 flex sm:mt-8">
          <span className={`relative w-1/2 bg-white shadow-sm py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto sm:px-8`}>
            {monthly ? "Monthly" : "Yearly"} billing only
          </span>
        </div>
      </Tippy>
    );

  return (
    <Tippy content={content} touch="hold">
      <div onClick={handleClick} className="relative self-center bg-gray-100 p-0.5 flex">
        <span className={`relative w-1/2 bg-white shadow-sm py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto px-4`}>
          {monthly ? "Monthly" : "Yearly"} billing only
        </span>
      </div>
    </Tippy>
  );
};

export default RestrictedBillingTooltip;
