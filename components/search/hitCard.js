import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
React.useLayoutEffect = React.useEffect;
import { StarIcon } from "@heroicons/react/outline";
import { ChevronLeft, ChevronRight } from "react-feather";
import PriceBlock from "./priceBlock";
import DiscountTooltip from "./discountTooltip";

export default function HitCard({ hit, monthlyPrice, locked, filter, minYearly, maxYearly, minMonthly, maxMonthly }) {
  const [tiers, setTiers] = useState(hit.tiers);
  const [tierIndex, setTierIndex] = useState(0);

  useEffect(() => {
    let tiers = hit.tiers;
    if (filter !== "NOT _tags:hidden") {
      // for max, exclude Upon request and include zeros
      if (maxMonthly) {
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) <= Number(maxMonthly) && (tier.price_primary_number_month || tier.price_primary_number_month == 0));
      }
      // for min, include "Upon request" (text, with non-zero)
      if (minMonthly) {
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) >= Number(minMonthly) || (!tier.price_primary_number_month && tier.price_primary_number_month !== 0));
      }
      // for max, exclude Upon request and include zeros
      if (maxYearly) {
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) <= Number(maxYearly) && (tier.price_primary_number_year || tier.price_primary_number_year == 0));
      }
      // for min, include "Upon request" (text, with non-zero)
      if (minYearly) {
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) >= Number(minYearly) || (!tier.price_primary_number_year && tier.price_primary_number_year !== 0));
      }
      setTiers(tiers);
    } else {
      setTiers(tiers);
    }
  }, [filter]);

  const handleLeftClick = (e) => {
    e.preventDefault();
    if (tierIndex === 0) {
      e.stopPropagation();
    } else {
      setTierIndex(tierIndex - 1);
      e.stopPropagation();
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (tierIndex === tiers.length - 1) {
      e.stopPropagation();
    } else {
      setTierIndex(tierIndex + 1);
      e.stopPropagation();
    }
  };

  const handleDotClick = (e) => {
    e.preventDefault();
    setTierIndex(parseInt(e.target.dataset.idx));
    e.stopPropagation();
  };

  const handleIgnoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* loading state */}
      {tiers.length < 1 && (
        <div className="h-full bg-white flex flex-col items-center justify-start space-y-4 p-4 shadow">
          <div className="h-28 w-28 bg-gray-200 animate-pulse"></div>
          <div className="bg-gray-200 h-6 w-3/4 animate-pulse"></div>
          <div className="bg-gray-200 h-6 w-1/2 animate-pulse"></div>
          <div className="bg-gray-200 h-6 w-1/4 animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/2 animate-pulse"></div>
          <div className="bg-gray-200 h-6 w-1/6 animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/4 animate-pulse"></div>
        </div>
      )}
      {tiers.length > 0 && (
        <Link href={`${tiers[tierIndex]?.tier_id ? `/product/${hit.objectID}?tier=${tiers[tierIndex].tier_id}` : `/product/${hit.objectID}`}`}>
          <li key={hit.objectID} className="col-span-1 flex flex-col text-center bg-white h-full shadow cursor-pointer space-y-4 p-4 md:px-2 lg:p-4">
            <div id="elem-1" className="space-y-4">
              <img className="object-contain object-center w-28 h-28 flex-shrink-0 mx-auto" src={hit.logo} alt={`${hit.vendor} logo`} />
              <h2 className="text-gray-900 text-lg font-medium">{hit.product}</h2>
            </div>
            <div id="elem-2" className="flex justify-center items-center">
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 0 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 1 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 2 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 3 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 4 ? "fill-current" : ""}`} />
              <span className="ml-2 text-sm">
                {hit.count} {hit.count === 1 ? "review" : "reviews"}
              </span>
            </div>
            <div id="elem-3" className="mb-2 h-full flex flex-col justify-between space-y-2">
              <div className="h-4">{!hit.single_tier && <h3 className="mt-1 text-gray-500 text-base font-normal">{tiers[tierIndex].tier_name}</h3>}</div>
              <div className="flex items-center justify-center">
                {!hit.single_tier && (
                  <button onClick={handleLeftClick} className="h-full w-10">
                    <ChevronLeft className={`${tierIndex === 0 ? "text-gray-300 hover:cursor-not-allowed" : "text-purple hover:cursor-pointer"} h-full w-full`} />
                  </button>
                )}
                <PriceBlock tier={tiers[tierIndex]} model={hit.price_model} large={false} monthly={monthlyPrice} search={true} />
                {!hit.single_tier && (
                  <button onClick={handleRightClick} className="h-full w-10">
                    <ChevronRight className={`${tierIndex === tiers.length - 1 ? "text-gray-300 hover:cursor-not-allowed" : "text-purple hover:cursor-pointer"} h-full w-full`} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center">
                <div onClick={handleIgnoreClick} className="flex space-x-2 p-1 cursor-default">
                  {tiers.map((tier, idx) => (
                    <button
                      key={tier.tier_id}
                      data-idx={idx}
                      onClick={handleDotClick}
                      disabled={idx === tierIndex}
                      className={`${idx === tierIndex ? "bg-purple cursor-not-allowed" : "bg-gray-300 cursor-pointer"} h-2 w-2 rounded-full`}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="h-4">{hit.discount_message && <DiscountTooltip id="elem-4" discountMessage={hit.discount_message} locked={locked} search={true} />}</div>
            </div>
          </li>
        </Link>
      )}
    </>
  );
}
