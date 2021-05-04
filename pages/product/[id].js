import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "../../components/global/footer";
import Header from "../../components/global/header";
import PriceBlock from "../../components/search/priceBlock";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
// import { Breadcrumb } from "react-instantsearch-dom";
import ReactPlayer from "react-player";
import { SRLWrapper } from "simple-react-lightbox-pro";
import { useLightbox } from "simple-react-lightbox-pro";
import { isMobile } from "react-device-detect";
import ReviewRecorder from "../../components/review/reviewRecorder";
import { Auth } from "@supabase/ui";
import Tooltip from "../../components/global/tooltip";
import ReviewGrid from "../../components/review/reviewGrid";
import { StarIcon } from "@heroicons/react/outline";

const Lightbox = (props) => {
  return <SRLWrapper>{props.media && props.media.map((src, idx) => <div key={idx}>{src.match(/\.(jpeg|jpg|gif|png)$/) && <img src={src} />}</div>)}</SRLWrapper>;
};

const ImageSlider = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });
  const [playing, setPlaying] = useState(false);
  const { openLightbox } = useLightbox();

  const media = [];
  let i = 0;
  let key = 0;
  props.media.forEach((elem) => {
    let obj = {};
    if (elem.match(/\.(jpeg|jpg|gif|png)$/)) {
      obj.key = key;
      obj.src = elem;
      obj.type = "image";
      obj.imgNum = i;
      i = i + 1;
    } else {
      obj.key = key;
      obj.src = elem;
      obj.type = "video";
    }
    key = key + 1;
    media.push(obj);
  });

  const prevSlide = (e) => {
    e.stopPropagation() || slider.prev();
    setPlaying(false);
  };

  const nextSlide = (e) => {
    e.stopPropagation() || slider.next();
    setPlaying(false);
  };

  return (
    <>
      <div className="navigation-wrapper max-h-full max-w-full relative">
        <div ref={sliderRef} className="keen-slider max-h-full max-w-full">
          {media &&
            media.map((obj) => (
              <div key={obj.key} className="keen-slider__slide max-h-full max-w-full">
                {/* if image, render image. else, render video player */}
                {obj.type === "image" && <img className="max-h-full max-w-full" src={obj.src} onClick={() => openLightbox(obj.imgNum)} />}
                {obj.type === "video" && <ReactPlayer className="max-h-full max-w-full" url={obj.src} controls playing={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
              </div>
            ))}
        </div>

        {slider && (
          <>
            <div className="absolute inset-y-0 left-0 h-full flex flex-col justify-center items-center">
              <svg
                onClick={(e) => {
                  prevSlide(e);
                }}
                className={`${isMobile ? "hidden" : "block"} h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-1 pr-2 ml-1 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 h-full flex flex-col justify-center items-center">
              <svg
                onClick={(e) => {
                  nextSlide(e);
                }}
                className={`${isMobile ? "hidden" : "block"} h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-2 pr-1 mr-1 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
              </svg>
            </div>
          </>
        )}
        {slider && (
          <div className="dots absolute inset-x-0 -bottom-8 sm:bottom-0 hover:bg-gray-200 hover:bg-opacity-30">
            {[...Array(slider.details().size).keys()] &&
              [...Array(slider.details().size).keys()].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      slider.moveToSlideRelative(idx);
                      setPlaying(false);
                    }}
                    className={"dot" + (currentSlide === idx ? " active" : "")}
                  />
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default function Product({ product }) {
  const router = useRouter();
  const { user } = Auth.useUser();
  const [monthly, setMonthly] = useState(true);
  const [review, setReview] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState("");
  const [count, setCount] = useState("");
  //const tierCount = useState(product.tiers.length);
  const tierCount = product.tiers.length;

  const tier = product.tiers.filter((tier) => tier.id == router.query.tier)[0] || null;

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

  function order(index, section, cols) {
    let group = Math.ceil(index / cols);
    let groupCount = cols * 3;
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
    return Math.ceil(tierCount / cols) * 3 + "mc";
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

  return (
    <>
      <Header style="dark" />
      <div className="flex flex-col justify-center items-start m-5 md:hidden">
        <h1 className="text-4xl font-extrabold">{product.name}</h1>
        <a className="mt-2 flex" href={product.vendors.website}>
          <img className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto" src={product.vendors.logo} alt={`${product.vendors.name} logo`} />
          <h5 className="ml-2 text-gray-500 hover:underline">{product.vendors.name}</h5>
        </a>
        <a href="#reviews">
          <div className="flex mt-2 justify-center items-center">
            <StarIcon className={`h-5 w-5 text-purple ${rating > 0 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${rating > 1 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${rating > 2 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${rating > 3 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${rating > 4 ? "fill-current" : ""}`} />
            {count === 1 ? <div className="ml-2">{count} review</div> : <div className="ml-2">{count} reviews</div>}
          </div>
        </a>
      </div>
      <div className="block md:flex md:flex-row h-4/5 max-w-screen-3xl mx-auto">
        {/* Left */}
        <div className="w-full md:w-3/5 flex flex-col justify-center items-center mb-4 sm:mb-0 bg-black">
          {/* if media is not null, then display slider */}
          {product.media && <ImageSlider media={product.media} />}
          {!product.media && (
            <>
              <img className="object-contain object-center w-40 h-40 p-2 bg-white flex-shrink-0 mx-auto mt-10" src={product.vendors.logo} alt={`${product.vendors.name} logo`} />
              <h3 className="text-white text-center text-2xl mt-5">Sorry!</h3>
              <h4 className="text-white text-center text-base px-2">Looks like we don't have any media for this product.</h4>
              <a href={product.vendors.website} className="mt-3 mb-10 inline-flex items-center px-2.5 py-1.5 border border-white shadow-sm text-xs font-medium text-white hover:bg-gray-700">
                Go to product site
              </a>
            </>
          )}
        </div>
        {/* Right */}
        <div className="h-full w-full md:w-2/5 flex flex-col justify-center items-center p-5">
          <div className="hidden md:flex flex-col justify-center items-start w-full">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <a className="mt-2 flex" href={product.vendors.website}>
              <img className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto" src={product.vendors.logo} alt={`${product.vendors.name} logo`} />
              <h5 className="ml-2 text-gray-500 hover:underline">{product.vendors.name}</h5>
            </a>
            <a href="#reviews">
              <div className="flex mt-2 justify-center items-center">
                <StarIcon className={`h-5 w-5 text-purple ${rating > 0 ? "fill-current" : ""}`} />
                <StarIcon className={`h-5 w-5 text-purple ${rating > 1 ? "fill-current" : ""}`} />
                <StarIcon className={`h-5 w-5 text-purple ${rating > 2 ? "fill-current" : ""}`} />
                <StarIcon className={`h-5 w-5 text-purple ${rating > 3 ? "fill-current" : ""}`} />
                <StarIcon className={`h-5 w-5 text-purple ${rating > 4 ? "fill-current" : ""}`} />
                {count === 1 ? <div className="ml-2">{count} review</div> : <div className="ml-2">{count} reviews</div>}
              </div>
            </a>
          </div>
          <h2 className="text-3xl font-medium my-4">{tier === null ? "Select a tier:" : tier.name}</h2>
          {/* Price Toggle */}
          {tier != null && (
            <div className="relative self-center bg-gray-100 p-0.5 flex">
              <button type="button" onClick={() => setMonthly(true)} className={`relative w-1/2 ${monthly ? "bg-white shadow-sm" : "bg-transparent"} py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto px-4`}>
                Monthly billing
              </button>
              <button type="button" onClick={() => setMonthly(false)} className={`ml-0.5 relative w-1/2 ${monthly ? "bg-transparent" : "bg-white shadow-sm"} py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto px-4`}>
                Yearly billing
              </button>
            </div>
          )}
          {/* Price Block */}
          {tier != null && <PriceBlock tier={tier} model={product.price_model} large={true} monthly={monthly} />}

          {/* Tier Selection */}
          {product.tiers.length > 1 && (
            <div className="flex flex-col justify-center items-center">
              <div className="justify-start items-start">
                {tier != null && <h3>Select tier:</h3>}
                <div className="flex flex-wrap justify-center mt-2">
                  {sortedTiers &&
                    sortedTiers.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        className={`${tier != null && tier.id === obj.id ? "bg-gray-200" : ""} inline-flex items-center mx-1 my-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple`}
                        onClick={() => {
                          router.push(`/product/${product.id}?tier=${obj.id}`, undefined, { shallow: true });
                        }}
                      >
                        {obj.name}
                      </button>
                    ))}
                </div>
              </div>

              <a href="#compare" className="dotted text-sm text-gray-400 mt-2">
                Compare tiers
              </a>
            </div>
          )}

          {/* Buy Button */}
          {tier != null && (
            <div className="flex space-x-2 my-4">
              <Link href={product.price_link}>
                <a>
                  <button type="button" className="text-center block px-6 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-purple hover:bg-purple-extradark focus:outline-none focus:ring-0">
                    Buy now
                  </button>
                </a>
              </Link>
              <Link href={product.price_link}>
                <a>
                  <button type="button" className="text-center block px-4 py-2 border border-purple text-base font-medium shadow-sm text-purple bg-transparent hover:bg-gray-200 focus:outline-none focus:ring-0">
                    App details
                  </button>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* LightBox */}
      {product.media && (
        <div className="hidden">
          <Lightbox media={product.media} />
        </div>
      )}
      {/* Tier Comparison */}
      <div id="compare" className="bg-gray-50">
        <div className={`max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 ${xlCols >= 5 ? "xl:px-1" : ""}`}>
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-5xl font-extrabold text-gray-900 text-center">Pricing Tiers</h1>
            <div className="relative self-center mt-8 bg-gray-200 p-0.5 flex sm:mt-8">
              <button type="button" onClick={() => setMonthly(true)} className={`relative w-1/2 ${monthly ? "bg-white shadow-sm" : "bg-transparent"} py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto sm:px-8`}>
                Monthly billing
              </button>
              <button type="button" onClick={() => setMonthly(false)} className={`ml-0.5 relative w-1/2 ${monthly ? "bg-transparent" : "bg-white shadow-sm"} py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none sm:w-auto sm:px-8`}>
                Yearly billing
              </button>
            </div>
          </div>
          <div className={`safe mt-8 grid sm:gap-x-4 ${xlCols >= 5 ? "xl:gap-x-1" : ""} sm:grid-cols-${smCols} sm:grid-rows-${smRows} md:grid-cols-${mdCols} md:grid-rows-${mdRows} lg:grid-cols-${lgCols} lg:grid-rows-${lgRows} xl:grid-cols-${xlCols} xl:grid-rows-${xlRows}`}>
            {sortedTiers &&
              sortedTiers.map((obj, index) => (
                <div key={index} className={`safe index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""} bg-white p-6 flex flex-col justify-between items-center border border-gray-200 order-${order(index + 1, 1, 1)} sm:order-${order(index + 1, 1, smCols)} md:order-${order(index + 1, 1, mdCols)} lg:order-${order(index + 1, 1, lgCols)} xl:order-${order(index + 1, 1, xlCols)} sm:row-start-${rowStart(order(index + 1, 1, smCols), smCols)} md:row-start-${rowStart(order(index + 1, 1, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, 1, lgCols), lgCols)} xl:row-start-${rowStart(order(index + 1, 1, xlCols), xlCols)}`}>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{obj.name}</h2>
                  <PriceBlock tier={obj} model={product.price_model} large={false} monthly={monthly} />
                  <a href={product.price_link} className="block w-full bg-purple hover:bg-purple-extradark border border-gray-800 py-2 mt-4 text-sm font-semibold text-white text-center">
                    Buy {obj.name}
                  </a>
                </div>
              ))}
            {/* {sortedTiers.map((obj, index) => (
              <div key={index} className={`safe flex flex-col index-${index + 1} ${lgCols === 2 ? "xl:mx-10" : ""} ${lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""} bg-white px-6 py-4 border-l border-r border-gray-200 order-${order(index + 1, 2, 1)} sm:order-${order(index + 1, 2, smCols)} md:order-${order(index + 1, 2, mdCols)} lg:order-${order(index + 1, 2, lgCols)} xl:order-${order(index + 1, 2, xlCols)} sm:row-start-${rowStart(order(index + 1, 2, smCols), smCols)} md:row-start-${rowStart(order(index + 1, 2, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, 2, lgCols), lgCols)} xl:row-start-${rowStart(order(index + 1, 2, xlCols), xlCols)}`}>
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Limits</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Potenti felis, in cras at at ligula nunc.</span>
                  </li>

                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Orci neque eget pellentesque.</span>
                  </li>
                </ul>
              </div>
            ))} */}
            {sortedTiers &&
              sortedTiers.map((obj, index) => (
                <div key={index} className={`safe index-${index + 1} order-${order(index + 1, 3, 1)} sm:order-${order(index + 1, 3, smCols)} md:order-${order(index + 1, 3, mdCols)} lg:order-${order(index + 1, 3, lgCols)} xl:order-${order(index + 1, 3, xlCols)} sm:row-start-${rowStart(order(index + 1, 3, smCols), smCols)} md:row-start-${rowStart(order(index + 1, 3, mdCols), mdCols)} lg:row-start-${rowStart(order(index + 1, 3, lgCols), lgCols)} xl:row-start-${rowStart(order(index + 1, 3, xlCols), xlCols)}`}>
                  <div className={`bg-white ${lgCols === 2 ? "xl:mx-10" : ""} ${lgCols === 1 ? "xl:mx-72 lg:mx-64 md:mx-36" : ""} mb-4 px-6 py-4 border-l border-r border-b border-gray-200 `}>
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Features</h3>
                    <ul className="mt-6 space-y-4">
                      {index > 0 && <li className="text-sm text-gray-500 font-medium">All prior features plus...</li>}
                      {obj.display_features &&
                        obj.display_features.map((feature, index) => (
                          <li key={index} className="flex space-x-3">
                            <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-500">{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div id="reviews" className="bg-white">
        <div className={`max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8`}>
          <div className="flex flex-col align-center">
            <h1 className="text-5xl font-extrabold text-gray-900 text-center">Reviews</h1>
            <div className="self-center my-8 flex">
              {!review && !success && (
                <div className="flex-col items-center space-y-2">
                  <button type="button" onClick={() => setReview(true)} className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
                    Leave a video review
                  </button>
                  <Tooltip text="Why only video?" caption="Video reviews are more trustworthy. When someone puts their face and name on a video, you can better trust its authenticity." />
                </div>
              )}
              {review && (
                <div className="flex flex-col">
                  <ReviewRecorder user={user} product={product} setReview={setReview} setSuccess={setSuccess} />
                  <div className="w-full border-t border-gray-300 mt-8" />
                </div>
              )}
              {success && (
                <div className="flex flex-col justify-center items-center">
                  <div className="text-green-600 font-medium">Review submitted successfully.</div>
                  <div className="text-green-600 font-medium">Thank you!</div>
                </div>
              )}
            </div>
            <ReviewGrid product={product} count={count} rating={rating} setCount={setCount} setRating={setRating} />
          </div>
        </div>
      </div>
      <Footer dark={true} />
    </>
  );
}

export async function getStaticPaths() {
  const res = await supabase.from("products").select("id");
  const products = res.data;

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await supabase.from("products").select(`*, vendors (*), tiers (*)`).eq("id", params.id);
  const product = res.data[0];

  return {
    props: { product },
  };
}
