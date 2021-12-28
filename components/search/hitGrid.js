import { useEffect, useState } from "react";
import { connectHits } from "react-instantsearch-dom";
import HitCard from "./hitCard";

function HitGrid({ hits, monthlyPrice, locked, filter, minYearly, maxYearly, minMonthly, maxMonthly }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {hits.map((hit) => (
        <HitCard key={hit.objectID} hit={hit} monthlyPrice={monthlyPrice} locked={locked} filter={filter} minYearly={minYearly} maxYearly={maxYearly} minMonthly={minMonthly} maxMonthly={maxMonthly} />
      ))}
    </ul>
  );
}

const CustomHits = connectHits(HitGrid);

export default CustomHits;

//const [renderHits, setRenderHits] = useState([]);
// let excludeHits = [];
// let excludeStr = "";
//let renderHits = [];
//   useEffect(() => {
//     // let min = 0;
//     // let max = 100;
//     // let hitYearlyPrices = [];
//     // let hitMonthlyPrices = [];
//     // hits.forEach((hit) => {
//     //   console.log(hit.yearly_prices);
//     //   hitYearlyPrices.concat(hit.yearly_prices);
//     // });
//     // console.log(hitYearlyPrices);
//     // hits.forEach((hit) => hitMonthlyPrices.concat(hit.monthly_prices));
//     // if (!monthlyPrice) {
//     //   min = Math.min(...hitYearlyPrices);
//     //   max = Math.max(...hitYearlyPrices);
//     // } else {
//     //   min = Math.min(...hitMonthlyPrices);
//     //   max = Math.max(...hitMonthlyPrices);
//     // }
//     // handleMinMax(min, max);

//     let updatedHits = hits.map((hit) => {
//       console.log(minMonthly);
//       console.log(maxMonthly);
//       console.log(minYearly);
//       console.log(maxYearly);
//       let tiers = hit.tiers;
//       if (filter !== "NOT _tags:hidden") {
//         // for max, exclude Upon request and include zeros
//         if (maxMonthly) {
//           tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) <= Number(maxMonthly) && (tier.price_primary_number_month || tier.price_primary_number_month == 0));
//         }
//         // for min, include "Upon request" (text, with non-zero)
//         if (minMonthly) {
//           tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) >= Number(minMonthly) || (!tier.price_primary_number_month && tier.price_primary_number_month !== 0));
//         }
//         // for max, exclude Upon request and include zeros
//         if (maxYearly) {
//           tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) <= Number(maxYearly) && (tier.price_primary_number_year || tier.price_primary_number_year == 0));
//         }
//         // for min, include "Upon request" (text, with non-zero)
//         if (minYearly) {
//           tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) >= Number(minYearly) || (!tier.price_primary_number_year && tier.price_primary_number_year !== 0));
//         }
//         hit.tiers = tiers;
//       }
//       return hit;
//     });
//     //renderHits = updatedHits.filter((hit) => hit.tiers.length > 0);
//     setRenderHits(updatedHits.filter((hit) => hit.tiers.length > 0));
//     //console.log(renderHits);
//   }, [filter]);

//handleMinMax(min, max);

// setState({
//   minPlaceholder: min,
//   maxPlaceholder: max,
// });

//useEffect(() => {
//setRenderHits([]);
// let updatedHits = hits.map((hit) => {
//   let tiers = hit.tiers;
//   if (searchState.range) {
//     // for max, exclude Upon request and include zeros
//     if (searchState.range.min_price_month?.max) {
//       //(tier.price_primary_number_month || tier.price_primary_number_month == 0) &&
//       tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) <= Number(searchState.range.min_price_month?.max));
//     }
//     // for min, include "Upon request" (text, with non-zero)
//     if (searchState.range.max_price_month?.min) {
//       // (!tier.price_primary_number_month && tier.price_primary_number_month !== 0) ||
//       tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) >= Number(searchState.range.max_price_month?.min));
//     }
//     // for max, exclude Upon request and include zeros
//     if (searchState.range.min_price_year?.max) {
//       //(tier.price_primary_number_year || tier.price_primary_number_year == 0) &&
//       tiers = tiers.filter(
//         (tier) => Number(tier.price_primary_number_year) <= Number(searchState.range.min_price_year?.max) && (tier.price_primary_number_year || tier.price_primary_number_year == 0)
//       );
//     }
//     // for min, include "Upon request" (text, with non-zero)
//     if (searchState.range.max_price_year?.min) {
//       // (!tier.price_primary_number_year && tier.price_primary_number_year !== 0) ||
//       tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) >= Number(searchState.range.max_price_year?.min));
//     }
//     hit.tiers = tiers;
//   }
//   return hit;
// });
// setRenderHits(updatedHits.filter((hit) => hit.tiers.length > 0));
// excludeHits = updatedHits.filter((hit) => hit.tiers.length == 0);
// excludeStr = "";
//setRenderHits(hits);
// console.log(renderHits);
// console.log(excludeHits);
// console.log(excludeStr);
//}, []);

// if (excludeHits.length > 0) {
//   excludeHits.forEach((hit, idx) => {
//     if (idx == 0) {
//       excludeStr = `NOT objectID:${hit.objectID}`;
//     } else {
//       excludeStr = `${excludeStr} AND NOT objectID:${hit.objectID}`;
//     }
//   });

//   // if (excludeStr != exclude) {
//   //   excludeHandler(excludeStr);
//   // }
// }

// if (excludeHits.length == 0 && exclude != "") {
//   excludeHandler("");
// }

// need to reset excludeStr when searchState changes
