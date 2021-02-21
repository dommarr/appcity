import Popper from "popper.js";
import React from "react";

const PriceModel = ({ tier, model }) => {
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const btnRef = React.createRef();
  const tooltipRef = React.createRef();
  const openTooltip = () => {
    new Popper(btnRef.current, tooltipRef.current, {
      placement: "top",
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const setCaption = (model) => {
    if (model === "per-user") {
      return `A fixed rate per month for each user on your account. For example, a product that charges $20 per user per month would cost $200 per month for 10 users ($20 x 10 users).`;
    } else if (model === "usage-based") {
      return `A variable rate based on usage. For example, email lists commonly charge a price based on the number of subscribers or contacts. You pay more as your subscriber count grows.`;
    } else if (model === "fixed-rate") {
      return `A fixed rate per month. Typically includes limitations on the number of users and/or features, where you can pay more for more features.`;
    } else {
      return;
    }
  };

  const price_model = capitalize(model);
  const caption = setCaption(model);

  return (
    <div className="my-2 ">
      <div className="flex justify-center items-center cursor-pointer" style={{ transition: "all .15s ease" }} onMouseEnter={openTooltip} onMouseLeave={closeTooltip} ref={btnRef}>
        <span className="text-sm mr-1 text-gray-400">{price_model} Pricing</span>
        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div className={(tooltipShow ? "" : "hidden ") + "bg-gray-600 border-0 mb-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg"} ref={tooltipRef}>
        <div>
          <div className={"bg-gray-600 text-white opacity-75 font-semibold p-3 mb-0 border-b border-solid border-gray-200 uppercase rounded-t-lg"}>{price_model} Pricing</div>
          <div className="text-white p-3">{caption}</div>
        </div>
      </div>
    </div>
  );
};

export default PriceModel;
