import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";

const PriceModelTooltip = ({ model }) => {
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const setCaption = (model) => {
    if (model === "per-user") {
      return `A fixed rate per month for each user (editor, employee, etc.) on your account.`;
    } else if (model === "usage-based") {
      return `A variable rate based on usage. You pay more as your usage grows.`;
    } else if (model === "flat-rate") {
      return `A fixed rate per month for a set of features and/or users.`;
    } else if (model === "revenue-fee") {
      return `Free until you start making revenue through the app, then the developer takes a percentage of revenue.`;
    } else if (model === "one-time") {
      return `A one-time price (not recurring monthly or yearly).`;
    } else if (model === "per-project") {
      return `A fixed rate per month for each project (site, app, etc.) on your account.`;
    } else if (model === "custom") {
      return `A custom price, typically when there are many options with differing costs.`;
    } else if (model === "quote") {
      return `Contact the app developer for a price quote.`;
    } else if (model === "minimum deposit") {
      return `Free, but requires a minimum deposit.`;
    } else if (model === "per-transaction") {
      return `A rate paid for each transaction processed.`;
    } else {
      return;
    }
  };

  let price_model = capitalize(model);
  if (model !== "minimum deposit") {
    price_model = price_model + " Pricing";
  }

  const caption = setCaption(model);
  const content = <div className="flex text-center py-1 text-xs">{caption}</div>;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy className="select-none" content={content} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center text-center cursor-default pb-2 select-none">
        <span className="dotted hover:no-underline text-sm text-gray-400 text-center">{price_model}</span>
      </div>
    </Tippy>
  );
};

export default PriceModelTooltip;
