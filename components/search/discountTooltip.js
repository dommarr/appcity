import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function DiscountTooltip({ discountMessage, locked, search, buybox }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const caption = locked ? "Leave 1 review on any app to unlock discounts and offers" : buybox ? "Select Buy now button to apply offer" : discountMessage;
  const content = <div className="flex text-center py-1 text-xs">{caption}</div>;
  return (
    <Tippy className="select-none" content={content} touch="hold">
      <p onClick={handleClick} className={`${search ? "" : "mt-3"} cursor-default text-xs text-center italic dotted hover:no-underline ${locked ? "text-red-600" : "text-green-600"}`}>
        {locked ? "Discount locked" : search ? "Offer available" : "Offer active"}
      </p>
    </Tippy>
  );
}
