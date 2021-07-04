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
      return `A fixed rate per month for each user on your account. For example, a product that charges $20 per user per month would cost $200 per month for 10 users ($20 x 10 users).`;
    } else if (model === "usage-based") {
      return `A variable rate based on usage. For example, email lists commonly charge a price based on the number of subscribers or contacts. You pay more as your subscriber count grows.`;
    } else if (model === "flat-rate") {
      return `A fixed rate per month. Typically includes limitations on the number of users and/or features, where you can pay more for more features.`;
    } else if (model === "revenue-fee") {
      return `Free until you start making revenue, then the developer takes a percentage of revenue. Fees can vary widely, from 3-30%.`;
    } else {
      return;
    }
  };

  const price_model = capitalize(model);
  const caption = setCaption(model);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tippy content={caption} touch="hold">
      <div onClick={handleClick} className="flex justify-center items-center cursor-pointer pb-2 select-none">
        <span className="dotted hover:no-underline text-sm text-gray-400 text-center">{price_model} Pricing</span>
      </div>
    </Tippy>
  );
};

export default PriceModelTooltip;
