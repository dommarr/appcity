import { useRouter } from "next/router";
// import Link from "next/link";
import Head from "../../components/global/head";
import PriceBlock from "../../components/search/priceBlock";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
// import Image from "next/image";
// import { Breadcrumb } from "react-instantsearch-dom";
import { SRLWrapper, useLightbox } from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import ReviewGrid from "../../components/review/reviewGrid";
import { ArrowNarrowDownIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { StarIcon, HeartIcon } from "@heroicons/react/outline";
import Swiper from "../../components/productPage/swiper";
import { capitalizeEveryWord, capitalizeFirstWord, formatParagraph } from "../../lib/format";
import HeartTooltip from "../../components/global/heartTooltip";
import { buildLinks } from "../../lib/linkBuilder";
import DiscountTooltip from "../../components/search/discountTooltip";
import RestrictedBillingTooltip from "../../components/productPage/restrictedBillingTooltip";

const Lightbox = (props) => {
  return <SRLWrapper>{props.media && props.media.map((src, idx) => <div key={idx}>{src.includes("supabase") && <img src={src} />}</div>)}</SRLWrapper>;
};

export default function Product({ product }) {
  const router = useRouter();
  //const [user, setUser] = useState(null);
  const { user } = Auth.useUser();
  const [monthly, setMonthly] = useState(true);
  const [description, setDescription] = useState(false);
  const [review, setReview] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  const [favorite, setFavorite] = useState(false);
  //const tierCount = useState(product.tiers.length);
  const tierCount = product.tiers.length;
  // discount states
  const [discountMessage, setDiscountMessage] = useState("");
  const [locked, setLocked] = useState(true);
  // hide or show priceToggle
  const [hidePriceToggle, setHidePriceToggle] = useState(false);

  const tier = product.tiers.filter((tier) => tier.id == router.query.tier)[0] || null;

  useEffect(async () => {
    // console.log("called");
    // let userRes = await supabase.auth.user();
    // console.log(userRes);
    // setUser(userRes);
    if (tier === null) {
      let firstTier = product.tiers.filter((tier) => tier.number === 1);
      let tId = firstTier[0].id;
      router.replace(`/product/${product.id}?tier=${tId}`, undefined, { shallow: true });
    }

    // Check if all non-free tiers are only paid monthly or yearly. If yes, hide the price toggle.
    let nonZeroTiers = product.tiers.filter((tier) => tier.price_primary_number_year !== 0 && tier.price_primary_number_month !== 0);
    let onlyPaidMonthly = nonZeroTiers.map((tier) => tier.only_paid_monthly).every((v) => v === true);
    let onlyPaidYearly = nonZeroTiers.map((tier) => tier.only_paid_yearly).every((v) => v === true);
    if (onlyPaidMonthly) {
      setMonthly(true);
      setHidePriceToggle(true);
    } else if (onlyPaidYearly) {
      setMonthly(false);
      setHidePriceToggle(true);
    }

    // if (user) {
    //   fetchUserFavorites(user?.id);
    //   let reviewCount = await fetchUserReviewCount(user?.id);
    //   console.log(reviewCount);
    //   if (reviewCount > 0) {
    //     setLocked(false);
    //   }
    // }
    // if (!user) {
    //   setLocked(true);
    // }
    if (product.discount_message) {
      setDiscountMessage(product.discount_message);
    } else if (product.vendors.discount_message) {
      setDiscountMessage(product.vendors.discount_message);
    } else {
      setDiscountMessage("");
    }
  }, []);

  useEffect(async () => {
    if (user) {
      fetchUserFavorites(user?.id);
      let reviewCount = await fetchUserReviewCount(user?.id);
      if (reviewCount > 0) {
        setLocked(false);
      }
    }
    if (!user) {
      setLocked(true);
    }
  }, [user]);

  function compare(a, b) {
    const tierNumA = a.number;
    const tierNumB = b.number;

    let comparison = 0;
    if (tierNumA > tierNumB) {
      comparison = 1;
    } else if (tierNumA < tierNumB) {
      comparison = -1;
    }
    return comparison;
  }

  const sortedTiers = product.tiers.slice().sort(compare);

  let totalSections = 5;

  function order(index, section, cols) {
    let group = Math.ceil(index / cols);
    let groupCount = cols * totalSections;
    return index + (section - 1) * cols + (groupCount - cols) * (group - 1);
  }

  // for example, if there is only 1 tier then return 1 column instead of the max columns for the screen width
  function columns(maxCols) {
    if (tierCount <= maxCols) {
      return tierCount;
    } else {
      return maxCols;
    }
  }

  // mc for max content - to set row height to content rather than fr
  function rows(cols) {
    return Math.ceil(tierCount / cols) * totalSections + "mc";
  }

  // function rows(cols) {
  //   return Math.ceil(tierCount / cols) * 3;
  // }

  // creates empty spaces and correctly places sections with the rest of the column
  function rowStart(order, cols) {
    return Math.ceil(order / cols);
  }

  const xlCols = columns(5);
  const lgCols = columns(4);
  const mdCols = columns(3);
  const smCols = columns(2);

  const xlRows = rows(xlCols);
  const lgRows = rows(lgCols);
  const mdRows = rows(mdCols);
  const smRows = rows(smCols);

  const handleDescriptionClick = () => {
    setDescription(!description);
  };

  // const createPriceLink = () => {
  //   if (product.vendors.ref_link && product.price_subdomain) {
  //     return `${product.vendors.ref_link}?sub=${product.price_subdomain}`;
  //   } else if (product.vendors.ref_link && !product.price_subdomain) {
  //     return product.vendors.ref_link;
  //   } else {
  //     return product.price_link;
  //   }
  // };

  // const createProductLink = () => {
  //   if (product.vendors.ref_link && product.product_subdomain) {
  //     return `${product.vendors.ref_link}?sub=${product.product_subdomain}`;
  //   } else if (product.vendors.ref_link && !product.product_subdomain) {
  //     return product.vendors.ref_link;
  //   } else {
  //     return product.product_link;
  //   }
  // };

  const fetchUserFavorites = async (id) => {
    let { data: favorites, error } = await supabase.from("favorites").select("*").eq("user_id", id).eq("product_id", product.id);
    if (error) {
      throw error;
    }
    if (favorites?.length) {
      setFavorite(true);
    }
  };

  const fetchUserReviewCount = async (uid) => {
    let { data: reviews, error } = await supabase.from("reviews").select("rating").eq("user", uid);
    if (error) {
      throw error;
    }
    return reviews.length;
  };

  const handleFavorite = async (bool) => {
    if (bool) {
      const { data, error } = await supabase.from("favorites").insert([{ user_id: user.id, product_id: product.id }]);
      if (error) {
        throw error;
      }
      setFavorite(bool);
      return;
    } else {
      const { data, error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", product.id);
      if (error) {
        throw error;
      }
      setFavorite(bool);
      return;
    }
  };

  let links = buildLinks(product);

  let vendorLink = locked ? product.vendors.website : links.vendor_link;
  let productLink = locked ? product.product_link : links.app_link;
  let priceLink = locked ? product.price_link : links.price_link;

  return (
    <div id="product-page" className="max-w-7xl min-w-full">
      <Head title={`${product.name} | AppCity`} description={formatParagraph(product.description)} url={`https://www.appcity.com/product/${product.id}`} />
      {/* Product Header for Mobile */}
      <div id="mobile-header" className="flex flex-col justify-center items-start m-5 lg:hidden select-none space-y-1">
        <h1 className="text-4xl font-extrabold">{product.name}</h1>
        <a target="_blank" className="flex" href={vendorLink}>
          <img className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto" src={product.vendors.logo} alt={`${product.vendors.name} logo`} />
          <h5 className="ml-2 text-gray-500 hover:underline">{product.vendors.name}</h5>
        </a>
        <div className="flex space-x-2 items-center">
          <a href="#reviews">
            <div className="flex justify-center items-center">
              <StarIcon className={`h-5 w-5 text-purple ${rating >= 0.5 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${rating >= 1.5 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${rating >= 2.5 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${rating >= 3.5 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${rating >= 4.5 ? "fill-current" : ""}`} />
              {count === 1 ? <div className="ml-2">{count} review</div> : <div className="ml-2">{count} reviews</div>}
            </div>
          </a>
          <span>|</span>
          <div onClick={() => handleDescriptionClick()} className="flex space-x-2 hover:cursor-pointer items-center">
            <h5 className="">Description</h5>
            {description && <ChevronDownIcon className="h-6 w-6" />}
            {!description && <ChevronUpIcon className="h-6 w-6" />}
          </div>
        </div>
        <p className={`${description ? `hidden` : `flex`} text-sm mt-1 text-gray-600 `}>{formatParagraph(product.description)}</p>
      </div>
      <div id="atf" className="flex flex-col lg:h-80vh lg:flex-row select-none">
        <div id="atf-left" className="relative h-50vh sm:h-60vh lg:h-full w-full lg:w-3/5 flex flex-col justify-center items-center mb-4 sm:mb-0 bg-black border border-black">
          {/* if media is not null, then display slider */}
          {product.media && product.media.length > 0 && <Swiper media={product.media} />}
          {(!product.media || product.media.length === 0) && (
            <>
              <img
                className="object-contain object-center w-40 h-40 p-2 bg-white flex-shrink-0 mx-auto mt-10"
                src={product.product_logo ? product.product_logo : product.vendors.logo}
                alt={`${product.name} logo`}
              />
              <h3 className="text-white text-center text-2xl mt-5">Sorry!</h3>
              <h4 className="text-white text-center text-base px-2">Looks like we don't have any media for {product.name}</h4>
              <a href={vendorLink} className="mt-3 mb-10 inline-flex items-center px-2.5 py-1.5 border border-white shadow-sm text-xs font-medium text-white hover:bg-gray-700">
                Go to {product.name}
              </a>
            </>
          )}
        </div>
        <div id="atf-right" className="h-70vh sm:h-70vh lg:h-full w-full lg:w-2/5 flex flex-col justify-start items-center px-4 py-3">
          <div id="desktop-header" className="hidden lg:flex flex-col justify-start items-start w-full space-y-1">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-4xl font-bold">{product.name}</h1>
              {user && (
                <HeartIcon
                  onClick={(e) => handleFavorite(!favorite)}
                  className={`h-8 w-8 hover:cursor-pointer text-pink-500 xl:mr-4 ${favorite ? "fill-current hover:fill-none" : "hover:fill-current"}`}
                />
              )}
              {!user && <HeartTooltip caption={"Sign in to favorite this app."} />}
            </div>
            <a target="_blank" className="flex" href={vendorLink}>
              <img className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto" src={product.vendors.logo} alt={`${product.vendors.name} logo`} />
              <h4 className="ml-2 text-gray-500 hover:underline">{product.vendors.name}</h4>
            </a>
            <div className="flex sm:flex-col md:flex-row space-x-2">
              <a href="#reviews">
                <div className="flex justify-center items-center">
                  <StarIcon className={`h-4 w-4 text-purple ${rating >= 0.5 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-4 w-4 text-purple ${rating >= 1.5 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-4 w-4 text-purple ${rating >= 2.5 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-4 w-4 text-purple ${rating >= 3.5 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-4 w-4 text-purple ${rating >= 4.5 ? "fill-current" : ""}`} />
                  {count === 1 ? <div className="ml-2 text-sm">{count} review</div> : <div className="ml-2 text-sm">{count} reviews</div>}
                </div>
              </a>
              <span className="hidden md:block text-sm">|</span>
              <div onClick={() => handleDescriptionClick()} className="flex hover:cursor-pointer">
                <h5 className="text-sm">Description</h5>
                {description && <ChevronDownIcon className="h-5 w-5 ml-1" />}
                {!description && <ChevronUpIcon className="h-5 w-5 ml-1" />}
              </div>
            </div>
            <p className={`${description ? `hidden` : `block`} text-sm mt-1 text-gray-600 pb-1 border-b w-full`}>{formatParagraph(product.description)}</p>
          </div>
          <div className="flex flex-col items-center justify-around h-full w-full">
            <div className="flex flex-col items-center justify-start w-full mt-3">
              {product.tiers.length > 1 && <h2 className={`text-2xl font-medium ${tier === null ? "animate-bounce md:mt-40" : ""}`}>{tier === null ? "Select a tier..." : tier.name}</h2>}
              {product.tiers.length === 1 && <div className="text-2xl font-medium">{product.name}</div>}
              <div className="flex flex-col space-y-2 items-center mt-1 xl:w-9/12">
                {tier?.description && <p className="text-gray-500 text-sm text-center w-full">{formatParagraph(tier.description)}</p>}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              {/* Price Toggle */}
              {tier != null &&
                product.price_model != "revenue-fee" &&
                product.price_model != "one-time" &&
                product.price_model !== "per-transaction" &&
                product.price_model !== "minimum deposit" &&
                !hidePriceToggle && (
                  <div className="relative self-center bg-gray-100 p-0.5 flex">
                    <button
                      type="button"
                      onClick={() => setMonthly(true)}
                      className={`relative w-1/2 ${monthly ? "bg-white shadow-sm" : "bg-transparent"} py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto px-4`}
                    >
                      Monthly billing
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthly(false)}
                      className={`ml-0.5 relative w-1/2 ${
                        monthly ? "bg-transparent" : "bg-white shadow-sm"
                      } py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto px-4`}
                    >
                      Yearly billing
                    </button>
                  </div>
                )}
              {hidePriceToggle && <RestrictedBillingTooltip monthly={monthly} />}
              {/* Price Block */}
              {tier != null && <PriceBlock tier={tier} model={product.price_model} large={true} monthly={monthly} discount={true} discountMessage={discountMessage} locked={locked} />}
              {/* Tier Limit */}
              {tier?.limit && <p className="text-gray-500 text-sm text-center italic">{capitalizeFirstWord(tier.limit)}</p>}
            </div>
            <div className="flex flex-col items-center justify-end">
              {/* Tier Selection */}
              {product.tiers.length > 1 && (
                <div className="flex flex-col justify-center items-center">
                  <div className="justify-start items-start">
                    {tier != null && <h4 className="text-sm font-medium">Select plan:</h4>}
                    <div className="flex flex-wrap justify-center mt-1">
                      {sortedTiers &&
                        sortedTiers.map((obj) => (
                          <button
                            key={obj.id}
                            type="button"
                            className={`${
                              tier != null && tier.id === obj.id ? "bg-gray-200" : ""
                            } inline-flex items-center mx-1 my-1 px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple`}
                            onClick={() => {
                              router.replace(`/product/${product.id}?tier=${obj.id}`, undefined, { shallow: true });
                            }}
                          >
                            {obj.name}
                          </button>
                        ))}
                    </div>
                  </div>

                  <a href="#compare" className="flex underline text-xs text-blue-500 mt-1">
                    <span>Compare plans</span>
                    <ArrowNarrowDownIcon className="h-4 w-4" />
                  </a>
                </div>
              )}
              {product.tiers.length === 1 && (
                <div className="flex flex-col justify-center items-center">
                  <a href="#compare" className="flex underline text-xs text-blue-500 mt-1">
                    <span>Learn more</span>
                    <ArrowNarrowDownIcon className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Buy Button */}
              {tier != null && (
                <div className="flex flex-col items-center justify-center my-3">
                  <div className="flex space-x-2 ">
                    <a target="_blank" href={priceLink}>
                      <button
                        type="button"
                        className="text-center block px-6 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
                      >
                        Buy now
                      </button>
                    </a>
                    <a target="_blank" href={productLink}>
                      <button
                        type="button"
                        className="text-center block px-4 py-2 border border-purple text-base font-medium shadow-sm text-purple bg-transparent hover:bg-gray-200 focus:outline-none focus:ring-0"
                      >
                        App details
                      </button>
                    </a>
                  </div>
                  {discountMessage && <DiscountTooltip discountMessage={discountMessage} locked={locked} buybox={true} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* LightBox */}
      {product.media && (
        <div className="hidden">
          <Lightbox media={product.media} />
        </div>
      )}
      {/* Tier Comparison */}
      <div id="compare" className="bg-gray-50 select-none">
        <div className={`max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 ${xlCols >= 5 ? "xl:px-1" : ""}`}>
          <div className="sm:flex sm:flex-col sm:align-center">
            {product.tiers.length === 1 && <h3 className="text-5xl font-extrabold text-gray-900 text-center">Pricing</h3>}
            {product.tiers.length > 1 && <h3 className="text-5xl font-extrabold text-gray-900 text-center">Pricing Plans</h3>}
            {product.price_model !== "revenue-fee" && product.price_model !== "one-time" && product.price_model !== "per-transaction" && product.price_model !== "minimum deposit" && !hidePriceToggle && (
              <div className="relative self-center mt-8 bg-gray-200 p-0.5 flex sm:mt-8">
                <button
                  type="button"
                  onClick={() => setMonthly(true)}
                  className={`relative w-1/2 ${monthly ? "bg-white shadow-sm" : "bg-transparent"} py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto sm:px-8`}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setMonthly(false)}
                  className={`ml-0.5 relative w-1/2 ${monthly ? "bg-transparent" : "bg-white shadow-sm"} py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto sm:px-8`}
                >
                  Yearly billing
                </button>
              </div>
            )}
            {hidePriceToggle && <RestrictedBillingTooltip monthly={monthly} large={true} />}
          </div>
          <div
            className={`safe mt-8 grid sm:gap-x-4 ${
              xlCols >= 5 ? "xl:gap-x-1" : ""
            } sm:grid-cols-${smCols} sm:grid-rows-${smRows} md:grid-cols-${mdCols} md:grid-rows-${mdRows} lg:grid-cols-${lgCols} lg:grid-rows-${lgRows} xl:grid-cols-${xlCols} xl:grid-rows-${xlRows}`}
          >
            {/* section 1 - tier name and description */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => {
                let section = 1;
                return (
                  <div
                    key={index}
                    className={`safe space-y-1 index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${
                      lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""
                    } bg-white pt-6 px-2 flex flex-col justify-start items-center border border-gray-200 border-b-0 order-${order(index + 1, section, 1)} sm:order-${order(
                      index + 1,
                      section,
                      smCols
                    )} md:order-${order(index + 1, section, mdCols)} lg:order-${order(index + 1, section, lgCols)} xl:order-${order(index + 1, section, xlCols)} sm:row-start-${rowStart(
                      order(index + 1, section, smCols),
                      smCols
                    )} md:row-start-${rowStart(order(index + 1, section, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, section, lgCols), lgCols)} xl:row-start-${rowStart(
                      order(index + 1, section, xlCols),
                      xlCols
                    )}`}
                  >
                    {product.tiers.length > 1 && <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{obj.name}</h3>}
                    {product.tiers.length === 1 && <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{product.name}</h3>}
                    {obj?.description && <p className="text-gray-500 text-sm text-center">{formatParagraph(obj.description)}</p>}
                  </div>
                );
              })}
            {/* section 2 - price */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => {
                let section = 2;
                return (
                  <div
                    key={index}
                    className={`safe index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${
                      lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""
                    } bg-white flex flex-col justify-between items-center border border-gray-200 border-b-0 border-t-0 order-${order(index + 1, section, 1)} sm:order-${order(
                      index + 1,
                      section,
                      smCols
                    )} md:order-${order(index + 1, section, mdCols)} lg:order-${order(index + 1, section, lgCols)} xl:order-${order(index + 1, section, xlCols)} sm:row-start-${rowStart(
                      order(index + 1, section, smCols),
                      smCols
                    )} md:row-start-${rowStart(order(index + 1, section, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, section, lgCols), lgCols)} xl:row-start-${rowStart(
                      order(index + 1, section, xlCols),
                      xlCols
                    )}`}
                  >
                    <PriceBlock tier={obj} model={product.price_model} large={false} monthly={monthly} discount={false} discountMessage={discountMessage} locked={locked} />
                  </div>
                );
              })}
            {/* section 3 - tier limit */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => {
                let section = 3;
                return (
                  <div
                    key={index}
                    className={`safe index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${
                      lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""
                    } bg-white px-2 flex flex-col justify-center items-center border border-gray-200 border-b-0 border-t-0 order-${order(index + 1, section, 1)} sm:order-${order(
                      index + 1,
                      section,
                      smCols
                    )} md:order-${order(index + 1, section, mdCols)} lg:order-${order(index + 1, section, lgCols)} xl:order-${order(index + 1, section, xlCols)} sm:row-start-${rowStart(
                      order(index + 1, section, smCols),
                      smCols
                    )} md:row-start-${rowStart(order(index + 1, section, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, section, lgCols), lgCols)} xl:row-start-${rowStart(
                      order(index + 1, section, xlCols),
                      xlCols
                    )}`}
                  >
                    {obj?.limit && <p className="text-gray-500 text-sm text-center italic">{capitalizeFirstWord(obj.limit)}</p>}
                  </div>
                );
              })}
            {/* section 4 - buy button */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => {
                let section = 4;
                return (
                  <div
                    key={index}
                    className={`safe index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${
                      lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""
                    } bg-white pt-2 pb-4 px-2 flex flex-col justify-between items-center border border-gray-200 border-t-0 order-${order(index + 1, section, 1)} sm:order-${order(
                      index + 1,
                      section,
                      smCols
                    )} md:order-${order(index + 1, section, mdCols)} lg:order-${order(index + 1, section, lgCols)} xl:order-${order(index + 1, section, xlCols)} sm:row-start-${rowStart(
                      order(index + 1, section, smCols),
                      smCols
                    )} md:row-start-${rowStart(order(index + 1, section, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, section, lgCols), lgCols)} xl:row-start-${rowStart(
                      order(index + 1, section, xlCols),
                      xlCols
                    )}`}
                  >
                    {product.tiers.length > 1 && (
                      <>
                        <a target="_blank" href={priceLink} className="mt-1 block min-w-5/6 bg-purple hover:bg-purple-dark py-2 px-2 text-sm font-semibold text-white text-center">
                          Buy {capitalizeEveryWord(obj.name)}
                        </a>
                        {discountMessage && <DiscountTooltip discountMessage={discountMessage} locked={locked} />}
                      </>
                    )}
                    {product.tiers.length === 1 && (
                      <>
                        <a
                          target="_blank"
                          href={priceLink}
                          className="mt-1 block min-w-5/6 bg-purple hover:bg-purple-dark border border-gray-800 py-2 px-2 text-sm font-semibold text-white text-center"
                        >
                          Buy {product.name}
                        </a>
                        {discountMessage && <DiscountTooltip discountMessage={discountMessage} locked={locked} />}
                      </>
                    )}
                  </div>
                );
              })}
            {/* section 5 - features */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => {
                let section = 5;
                return (
                  <div
                    key={index}
                    className={`safe index-${index + 1} mb-4 order-${order(index + 1, section, 1)} sm:order-${order(index + 1, section, smCols)} md:order-${order(
                      index + 1,
                      section,
                      mdCols
                    )} lg:order-${order(index + 1, section, lgCols)} xl:order-${order(index + 1, section, xlCols)} sm:row-start-${rowStart(
                      order(index + 1, section, smCols),
                      smCols
                    )} md:row-start-${rowStart(order(index + 1, section, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, section, lgCols), lgCols)} xl:row-start-${rowStart(
                      order(index + 1, section, xlCols),
                      xlCols
                    )}`}
                  >
                    <div className={`bg-white ${lgCols === 2 ? "xl:mx-10" : ""} ${lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""} mb-4 px-6 py-4 border-l border-r border-b border-gray-200 h-full`}>
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Features</h3>
                      <ul className="mt-6 space-y-4">
                        {index > 0 && !product.turn_off_all_prior && (
                          <li className="flex space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm text-gray-500 font-bold">All prior features, plus...</span>
                          </li>
                        )}
                        {obj.display_features &&
                          obj.display_features.map((feature, index) => (
                            <li key={index} className="flex space-x-3">
                              <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm text-gray-500">{capitalizeFirstWord(feature)}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div id="reviews" className="bg-white select-none">
        <div className={`max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8`}>
          <div className="flex flex-col align-center">
            <h3 className="text-5xl font-extrabold text-gray-900 text-center">Reviews</h3>
            {/* <ReviewRecorder user={user} product={product} /> */}
            <ReviewGrid user={user} product={product} count={count} rating={rating} setCount={setCount} setRating={setRating} />
          </div>
        </div>
      </div>
      {product.long_description && (
        <div id="app-description" className="bg-gray-50 select-none">
          <div className={`max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8`}>
            <div className="flex flex-col align-start space-y-2">
              <h3 className="">App description</h3>
              <p className="text-sm">{product.long_description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await supabase.from("products").select("id").eq("complete", true);
  const products = res.data;

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  let { data: products, error } = await supabase.from("products").select(`*, vendors (*), tiers (*)`).eq("id", params.id);
  if (error || products.length === 0) {
    return {
      notFound: true,
    };
  }
  const product = products[0];

  return {
    props: { product },
    revalidate: 60,
  };
}
