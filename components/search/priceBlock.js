import PriceModelTooltip from "./priceModelTooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Slash } from "react-feather";

// tier = object of tier data
// model = the pricing model of the product (same for all tiers)
// large = boolean - large (true) or small (false) text in the price block
// monthly = boolean - if state is set to monthly pricing (true) or yearly (false)
// search = boolean - formatting for the search page (true) or not (false)

const PriceBlock = ({ tier, model, large, monthly, search, discount, discountMessage, locked }) => {
  const caption = locked ? "Leave 1 review on any app to unlock this offer" : "Select Buy now button to apply offer";
  const content = <div className="flex text-center py-1 text-xs">{caption}</div>;

  const formatPrice = (price) => {
    if (model === "revenue-fee") {
      let str = price.toString();
      return str.concat("%");
    } else if (price % 1 != 0) {
      let num = Number(Math.round(price + "e2") + "e-2");
      num = num.toFixed(2);
      return "$".concat(num);
    } else {
      let num = price.toLocaleString("en");
      return "$".concat(num);
    }
  };

  const calcAnnualPrice = (price) => {
    let total = price * 12;
    if (total % 1 != 0) {
      let num = Number(Math.round(total + "e2") + "e-2");
      num = num.toFixed(2);
      return "$".concat(num);
    } else {
      let num = total.toLocaleString("en");
      return "$".concat(num);
    }
  };

  // const setTwoPrices = (starting_price, starting_price_other) => {
  //   if (starting_price === null && starting_price_other === null) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  // if price number field is truthy or 0, then format and set price. otherwise, set price to the text field.
  let primary_price_year = tier.price_primary_number_year || tier.price_primary_number_year === 0 ? formatPrice(tier.price_primary_number_year) : tier.price_primary_text_year;
  let primary_price_year_unit = tier.price_primary_unit_year;
  let secondary_price_year = tier.price_secondary_number_year || tier.price_secondary_number_year === 0 ? formatPrice(tier.price_secondary_number_year) : tier.price_secondary_text_year;
  let secondary_price_year_unit = tier.price_secondary_unit_year;
  let primary_price_month = tier.price_primary_number_month || tier.price_primary_number_month === 0 ? formatPrice(tier.price_primary_number_month) : tier.price_primary_text_month;
  let primary_price_month_unit = tier.price_primary_unit_month;
  let secondary_price_month = tier.price_secondary_number_month || tier.price_secondary_number_month === 0 ? formatPrice(tier.price_secondary_number_month) : tier.price_secondary_text_month;
  let secondary_price_month_unit = tier.price_secondary_unit_month;

  let annualPrice = tier.price_primary_number_year || tier.price_primary_number_year === 0 ? calcAnnualPrice(tier.price_primary_number_year) : "";

  return (
    <div className="grid grid-cols-7 gap-3 w-full items-center justify-center">
      {discount && discountMessage && <div className="col-span-2"></div>}
      <div className={`price-block-2-2 ${discount && discountMessage ? "col-span-3" : "col-span-7"} ${large ? "py-4" : "py-2"} flex flex-col justify-start items-center ${search ? "" : "h-full"}`}>
        <PriceModelTooltip model={model} />
        <dl className={`price-block-year ${monthly ? "hidden" : "flex"} flex-col justify-center items-center space-y-2 ${search ? "" : "h-full flex-grow"}`}>
          <div className="flex flex-col justify-center items-center text-center">
            <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_year}</dt>
            {!tier.price_primary_text_year && <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_year_unit}</dd>}
            {tier.price_primary_text_year && model !== "revenue-fee" && model !== "one-time" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>{`(yearly billing)`}</dd>}
            {!tier.price_primary_text_year && model !== "revenue-fee" && model !== "one-time" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>{annualPrice} paid yearly</dd>}
            {model === "revenue-fee" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>deducted from payment</dd>}
          </div>
          {secondary_price_year && (
            <dt className={`${large ? "text-xs" : "text-xs"} text-gray-900`}>
              ({secondary_price_year} {secondary_price_year_unit})
            </dt>
          )}
        </dl>
        <dl className={`price-block-month ${monthly ? "flex" : "hidden"} flex-col justify-center items-center space-y-2 ${search ? "" : "h-full flex-grow"}`}>
          <div className="flex flex-col justify-center items-center text-center">
            <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_month}</dt>
            {!tier.price_primary_text_month && <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_month_unit}</dd>}
            {tier.price_primary_text_month && model !== "revenue-fee" && model !== "one-time" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>{`(monthly billing)`}</dd>}
            {!tier.price_primary_text_month && model !== "revenue-fee" && model !== "one-time" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>paid monthly</dd>}
            {model === "revenue-fee" && <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400 mt-1`}>deducted from payment</dd>}
          </div>
          {secondary_price_month && (
            <dt className={`${large ? "text-xs" : "text-xs"} text-gray-900`}>
              ({secondary_price_month} {secondary_price_month_unit})
            </dt>
          )}
        </dl>
      </div>

      {discount && discountMessage && (
        <div className={`col-span-2 text-xs h-full flex flex-col justify-center items-center space-y-1 w-24 ${locked ? "text-gray-300 cursor-not-allowed" : "text-purple"}`}>
          <Tippy className="select-none" content={content} touch="hold" placement="bottom">
            <div className="relative flex flex-col justify-center items-center text-center py-4">
              {locked && <Slash className="absolute inset-0 text-red-300 h-full w-full opacity-20" />}
              {/* <span className="font-bold text-purple">AppCity Offer</span> */}
              <span className={`${locked ? "text-red-600" : "text-green-600"}`}>{discountMessage}</span>
            </div>
          </Tippy>
        </div>
      )}
    </div>
  );
};

export default PriceBlock;
