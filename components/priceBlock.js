import PriceModel from "./priceModel";

// tier = object of tier data
// model = the pricing model of the product (same for all tiers)
// large = boolean - large (true) or small priceBlock (false)
// monthly = boolean - if state is set to monthly pricing (true) or yearly (false)

const PriceBlock = ({ tier, model, large, monthly, search }) => {
  const formatPrice = (price) => {
    if (price % 1 != 0) {
      let num = Number(Math.round(price + "e2") + "e-2");
      num = num.toFixed(2);
      return "$".concat(num);
    } else {
      let num = price.toLocaleString("en");
      return "$".concat(num);
    }
  };

  const setTwoPrices = (starting_price, starting_price_other) => {
    if (starting_price === null && starting_price_other === null) {
      return false;
    } else {
      return true;
    }
  };

  let primary_price_year = "";
  let primary_price_year_unit = "";
  let secondary_price_year = "";
  let secondary_price_year_unit = "";
  let primary_price_month = "";
  let primary_price_month_unit = "";
  let secondary_price_month = "";
  let secondary_price_month_unit = "";

  let two_prices_year = setTwoPrices(tier.starting_price_year, tier.starting_price_year_other);
  let two_prices_month = setTwoPrices(tier.starting_price_month, tier.starting_price_month_other);

  // YEAR
  // if two prices
  if (two_prices_year) {
    // and starting other is null
    if (tier.starting_price_year_other === null) {
      // set primary to starting price
      primary_price_year = formatPrice(tier.starting_price_year);
      primary_price_year_unit = tier.starting_price_unit;
      // secondary price
      // if other is null
      if (tier.compare_price_year_other === null) {
        // set secondary price to price
        secondary_price_year = formatPrice(tier.compare_price_year);
        secondary_price_year_unit = tier.compare_price_unit;
      } else {
        // set secondary price to other
        secondary_price_year = tier.compare_price_year_other;
        secondary_price_year_unit = tier.compare_price_unit;
      }
      // primary - and other is not null
    } else {
      // set primary to starting price other
      primary_price_year = tier.starting_price_year_other;
      primary_price_year_unit = tier.starting_price_unit;
      // secondary price
      // if other is null
      if (tier.compare_price_year_other === null) {
        // set secondary price to price
        secondary_price_year = formatPrice(tier.compare_price_year);
        secondary_price_year_unit = tier.compare_price_unit;
      } else {
        // set secondary price to other
        secondary_price_year = tier.compare_price_year_other;
        secondary_price_year_unit = tier.compare_price_unit;
      }
    }
    // if one price
  } else {
    // and other is null
    if (tier.compare_price_year_other === null) {
      // set primary to compare price
      primary_price_year = formatPrice(tier.compare_price_year);
      primary_price_year_unit = tier.compare_price_unit;
    } else {
      // set primary to compare price other
      primary_price_year = tier.compare_price_year_other;
    }
  }

  // MONTH
  // if two prices
  if (two_prices_month) {
    // and starting other is null
    if (tier.starting_price_month_other === null) {
      // set primary to starting price
      primary_price_month = formatPrice(tier.starting_price_month);
      primary_price_month_unit = tier.starting_price_unit;
      // secondary price
      // if other is null
      if (tier.compare_price_month_other === null) {
        // set secondary price to price
        secondary_price_month = formatPrice(tier.compare_price_month);
        secondary_price_month_unit = tier.compare_price_unit;
      } else {
        // set secondary price to other
        secondary_price_month = tier.compare_price_month_other;
        secondary_price_month_unit = tier.compare_price_unit;
      }
      // primary - and other is not null
    } else {
      // set primary to starting price other
      primary_price_month = tier.starting_price_month_other;
      primary_price_month_unit = tier.starting_price_unit;
      // secondary price
      // if other is null
      if (tier.compare_price_month_other === null) {
        // set secondary price to price
        secondary_price_month = formatPrice(tier.compare_price_month);
        secondary_price_month_unit = tier.compare_price_unit;
      } else {
        // set secondary price to other
        secondary_price_month = tier.compare_price_month_other;
        secondary_price_month_unit = tier.compare_price_unit;
      }
    }
    // if one price
  } else {
    // and other is null
    if (tier.compare_price_month_other === null) {
      // set primary to compare price
      primary_price_month = formatPrice(tier.compare_price_month);
      primary_price_month_unit = tier.compare_price_unit;
    } else {
      // set primary to compare price other
      primary_price_month = tier.compare_price_month_other;
    }
  }

  // 2 prices for both
  if (two_prices_year && two_prices_month) {
    return (
      <div className={`price-block-2-2 ${large ? "py-4 px-12 my-4 border border-gray-100 min-h-block" : "py-2 px-4 mb-2"} flex flex-col justify-start items-center ${search ? "" : "h-full"}`}>
        <PriceModel tier={tier} model={model} />
        <dl className={`price-block-year ${monthly ? "hidden" : "flex"} flex-col justify-center items-center relative ${search ? "" : "h-full flex-grow"}`}>
          <dd className={`absolute bottom-9 -left-10 text-gray-400 text-xs`}>Compare</dd>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_year}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_year_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid yearly</dd>
          <dt className={`${large ? "text-sm" : "text-sm"} text-gray-900 font-medium pt-4`}>{secondary_price_year}</dt>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-600 pb-2`}>{secondary_price_year_unit}</dd>
        </dl>
        <dl className={`price-block-month ${monthly ? "flex" : "hidden"} flex-col justify-center items-center relative ${search ? "" : "h-full flex-grow"}`}>
          <span className={`absolute bottom-9 -left-10 text-gray-400 text-xs`}>Compare</span>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_month}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_month_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid monthly</dd>
          <dt className={`${large ? "text-sm" : "text-sm"} text-gray-900 font-medium pt-4`}>{secondary_price_month}</dt>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-600 pb-2`}>{secondary_price_month_unit}</dd>
        </dl>
      </div>
    );
    // 2 prices for year, 1 price for month
  } else if (two_prices_year && !two_prices_month) {
    return (
      <div className={`price-block-2-1 ${large ? "py-4 px-12 my-4 border border-gray-100 min-h-block" : "py-2 px-4 mb-2"} flex flex-col justify-start items-center ${search ? "" : "h-full"}`}>
        <PriceModel tier={tier} model={model} />
        <dl className={`price-block-year ${monthly ? "hidden" : "flex"} flex-col justify-center items-center relative ${search ? "" : "h-full flex-grow"}`}>
          <span className={`absolute bottom-9 -left-10 text-gray-400 text-xs`}>Compare</span>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_year}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_year_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid yearly</dd>
          <dt className={`${large ? "text-sm" : "text-sm"} text-gray-900 font-medium pt-4`}>{secondary_price_year}</dt>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-600 pb-2`}>{secondary_price_year_unit}</dd>
        </dl>
        <dl className={`price-block-month ${monthly ? "flex" : "hidden"} flex-col justify-center items-center ${search ? "" : "h-full flex-grow"}`}>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_month}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_month_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid monthly</dd>
        </dl>
      </div>
    );
    // 1 price for year, 2 prices for month
  } else if (!two_prices_year && two_prices_month) {
    return (
      <div className={`price-block-1-2 ${large ? "py-4 px-12 my-4 border border-gray-100 min-h-block" : "py-2 px-4 mb-2"} flex flex-col justify-start items-center ${search ? "" : "h-full"}`}>
        <PriceModel tier={tier} model={model} />
        <dl className={`price-block-year ${monthly ? "hidden" : "flex"} flex-col justify-center items-center ${search ? "" : "h-full flex-grow"}`}>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_year}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_year_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid yearly</dd>
        </dl>
        <dl className={`price-block-month ${monthly ? "flex" : "hidden"} flex-col justify-center items-center relative ${search ? "" : "h-full flex-grow"}`}>
          <span className={`absolute bottom-9 -left-10 text-gray-400 text-xs`}>Compare</span>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_month}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_month_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid monthly</dd>
          <dt className={`${large ? "text-sm" : "text-sm"} text-gray-900 font-medium pt-4`}>{secondary_price_month}</dt>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-600 pb-2`}>{secondary_price_month_unit}</dd>
        </dl>
      </div>
    );
  } else {
    return (
      <div className={`price-block-1-1 ${large ? "py-4 px-12 my-4 border border-gray-100 min-h-block" : "py-2 px-4 mb-2"} flex flex-col justify-start items-center ${search ? "" : "h-full"}`}>
        <PriceModel tier={tier} model={model} />
        <dl className={`price-block-year ${monthly ? "hidden" : "flex"} flex-col justify-center items-center ${search ? "" : "h-full flex-grow"}`}>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_year}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_year_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid yearly</dd>
        </dl>
        <dl className={`price-block-month ${monthly ? "flex" : "hidden"} flex-col justify-center items-center ${search ? "" : "h-full flex-grow"}`}>
          <dt className={`${large ? "text-lg" : "text-base"} text-gray-900 font-medium`}>{primary_price_month}</dt>
          <dd className={`${large ? "text-sm" : "text-sm"} text-gray-600`}>{primary_price_month_unit}</dd>
          <dd className={`${large ? "text-xs" : "text-xs"} text-gray-400`}>paid monthly</dd>
        </dl>
      </div>
    );
  }
};

export default PriceBlock;

//   // function to determin if there are going to be 2 prices showing.
//   // if yes, format one large, other small. if no, format large.

//   let price = "";
//   let price_other = "";
//   let price_unit = "";

//   // if starting price is requested
//   if (starting) {
//     // set price if present
//     price =
//       tier[`starting_price_pay_${cadence}`] != null
//         ? formatPrice(tier[`starting_price_pay_${cadence}`])
//         : null;
//     // set other if present
//     price_other =
//       tier[`starting_price_other_pay_${cadence}`] != null
//         ? tier[`starting_price_other_pay_${cadence}`]
//         : null;
//     // set price unit
//     price_unit = tier.starting_price_unit;
//   } else {
//     // if not starting price, set compare price if present
//     price =
//       tier[`price_pay_${cadence}`] != null
//         ? formatPrice(tier[`price_pay_${cadence}`])
//         : null;
//     // set other if present
//     price_other =
//       tier[`price_other_pay_${cadence}`] != null
//         ? tier[`price_other_pay_${cadence}`]
//         : null;
//     // set price unit
//     price_unit = tier.price_unit;
//   }

//   // if other is populated
//   if (price_other) {
//     // if other starts with n/a
//     if (price_other.startsWith("n/a")) {
//       // return other w/ the price unit present for context
//       // for example...
//       // n/a - 250 contact limit
//       // per 500 contacts per month
//       return (
//         <div>
//           {/* if starting price, large text. if not starting price && starting price is not present, large text. else, base text. */}
//           <dt
//             className={`text-gray-900 ${starting ? "text-lg" : ""} ${
//               !starting &&
//               !(
//                 tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`]
//               )
//                 ? "text-lg"
//                 : "text-base"
//             } font-medium`}
//           >
//             {price_other}
//           </dt>
//           <dd
//             className={`text-gray-600 ${starting ? "text-base" : ""} ${
//               !starting &&
//               !(
//                 tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`]
//               )
//                 ? "text-base"
//                 : "text-sm"
//             }`}
//           >
//             {price_unit}
//           </dd>
//         </div>
//       );
//     } else {
//       // return other w/o the price unit
//       // for example...
//       // Upon request
//       return (
//         <dl className={`flex-grow flex flex-col items-center justify-between`}>
//           <dt
//             className={`text-gray-900
//             ${starting ? "text-lg" : ""} ${
//               !starting &&
//               !(
//                 tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`]
//               )
//                 ? "text-lg"
//                 : "text-base"
//             }
//             font-medium`}
//           >
//             {price_other}
//           </dt>
//         </dl>
//       );
//     }
//   } else {
//     // if price is empty, skip
//     if (price != null) {
//       // if price is present and other is not populated, return price
//       // for example...
//       // $25
//       // per user per month
//       return (
//         <dl className="flex-grow flex flex-col items-center justify-between">
//           <dt
//             className={`text-gray-900
//             ${starting ? "text-lg" : ""} ${
//               !starting &&
//               (tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`])
//                 ? "text-lg"
//                 : "text-base"
//             } font-medium`}
//           >
//             {price}
//           </dt>
//           <dd
//             className={`text-gray-600 ${starting ? "text-base" : ""} ${
//               !starting &&
//               (tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`])
//                 ? "text-base"
//                 : "text-sm"
//             }`}
//           >
//             {price_unit}
//           </dd>
//           <dd
//             className={`text-gray-400 ${starting ? "text-sm" : ""} ${
//               !starting &&
//               (tier[`starting_price_pay_${cadence}`] ||
//                 tier[`starting_price_other_pay_${cadence}`])
//                 ? "text-sm"
//                 : "text-xs"
//             }`}
//           >
//             paid {cadence}
//           </dd>
//         </dl>
//       );
//     } else {
//       return "";
//     }
//   }
// };
