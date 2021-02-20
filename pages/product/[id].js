import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "../../components/footer";
import Header from "../../components/header";
import PriceBlock from "../../components/priceBlock";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
// import { Breadcrumb } from "react-instantsearch-dom";
import ReactPlayer from "react-player";
import { SRLWrapper } from "simple-react-lightbox-pro";
import { useLightbox } from "simple-react-lightbox-pro";

const Lightbox = (props) => {
  return (
    <SRLWrapper>
      {props.media.map((src, idx) => (
        <div key={idx}>
          {src.match(/\.(jpeg|jpg|gif|png)$/) && <img src={src} />}
        </div>
      ))}
    </SRLWrapper>
  );
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
          {media.map((obj) => (
            <div
              key={obj.key}
              className="keen-slider__slide max-h-full max-w-full"
            >
              {/* if image, render image. else, render video player */}
              {obj.type === "image" && (
                <img
                  className="max-h-full max-w-full"
                  src={obj.src}
                  onClick={() => openLightbox(obj.imgNum)}
                />
              )}
              {obj.type === "video" && (
                <ReactPlayer
                  className="max-h-full max-w-full"
                  url={obj.src}
                  controls
                  playing={playing}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              )}
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
                className="h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-1 pr-2 ml-1 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40"
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
                className="h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-2 pr-1 mr-1 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40"
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
          <div className="dots absolute inset-x-0 bottom-0 hover:bg-gray-200 hover:bg-opacity-30">
            {[...Array(slider.details().size).keys()].map((idx) => {
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
  const [monthly, setMonthly] = useState(false);

  const tier =
    product.tiers.filter((tier) => tier.id == router.query.tier)[0] || null;

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

  return (
    <>
      <Header dark="true" />
      <div className="flex flex-col justify-center items-start m-5 md:hidden">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <a className="mt-2 flex" href={product.vendors.website}>
          <img
            className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto"
            src={product.vendors.logo}
            alt={`${product.vendors.name} logo`}
          />
          <h5 className="ml-2 text-gray-500 hover:underline">
            {product.vendors.name}
          </h5>
        </a>
      </div>
      <div className="block md:flex md:flex-row h-4/5">
        {/* Left */}
        <div className="w-full md:w-3/5 flex flex-col justify-center items-center bg-black">
          {/* if media is not null, then display slider */}
          {product.media && <ImageSlider media={product.media} />}
          {/* need to add no images placeholder */}
          {!product.media && (
            <>
              <img
                className="object-contain object-center w-40 h-40 p-2 bg-white flex-shrink-0 mx-auto mt-10"
                src={product.vendors.logo}
                alt={`${product.vendors.name} logo`}
              />
              <h3 className="text-white text-center text-2xl mt-5">Sorry!</h3>
              <h4 className="text-white text-center text-base">
                Looks like we don't have any media for this product.
              </h4>
              <button
                type="button"
                className="mt-3 mb-10 inline-flex items-center px-2.5 py-1.5 border border-white shadow-sm text-xs font-medium text-white hover:bg-gray-700"
              >
                Go to product site
              </button>
            </>
          )}
        </div>
        {/* Right */}
        <div className="h-full w-full md:w-2/5 flex flex-col justify-center items-center p-5">
          <div className="hidden md:flex flex-col justify-center items-start w-full">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <a className="mt-2 flex" href={product.vendors.website}>
              <img
                className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto"
                src={product.vendors.logo}
                alt={`${product.vendors.name} logo`}
              />
              <h5 className="ml-2 text-gray-500 hover:underline">
                {product.vendors.name}
              </h5>
            </a>
          </div>
          <h2 className="text-3xl font-medium my-4">
            {tier === null ? "Select a tier:" : tier.name}
          </h2>
          {/* Price Toggle */}
          {tier != null && (
            <div className="flex flex justify-start items-center w-36 mb-4">
              <button
                type="button"
                className={`flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                aria-pressed="false"
                onClick={() => setMonthly(!monthly)}
              >
                <span className="sr-only">Toggle payment cadence</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bg-white w-full h-full rounded-md"
                ></span>
                {/* Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" */}
                <span
                  aria-hidden="true"
                  className={`${
                    monthly ? "bg-indigo-300" : "bg-gray-300"
                  } pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200`}
                ></span>
                {/* Enabled: "translate-x-5", Not Enabled: "translate-x-0" */}
                <span
                  aria-hidden="true"
                  className={`${
                    monthly ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200`}
                ></span>
              </button>
              <span className="ml-3" id="billing-label">
                <span className="text-base font-normal text-gray-900">
                  {monthly ? "Pay monthly" : "Pay yearly"}
                </span>
              </span>
            </div>
          )}
          {/* Price Block */}
          {tier != null && (
            <PriceBlock tier={tier} large={true} monthly={monthly} />
          )}
          {/* <div className="flex flex-col justify-center items-center p-4 border border-gray-100 relative">
              <div className={`${monthly ? "hidden" : "flex flex-col"}`}>
                <PriceBlock tier={tier} cadence="yearly" starting={true} />
                <PriceBlock tier={tier} cadence="yearly" starting={false} />
              </div>
              <div className={`${monthly ? "flex flex-col" : "hidden"}`}>
                <PriceBlock tier={tier} cadence="monthly" starting={true} />
                <PriceBlock tier={tier} cadence="monthly" starting={false} />
              </div>
            </div> */}

          {/* Tier Selection */}
          {product.tiers.length > 1 && (
            <div className="flex flex-col justify-start items-start mt-4 mb-2">
              {tier != null && <h3>Select Tier:</h3>}
              <div className="flex flex-wrap justify-center mt-2">
                {sortedTiers.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    className={`${
                      tier != null && tier.id === obj.id ? "bg-gray-200" : ""
                    } inline-flex items-center mx-1 my-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple`}
                    onClick={() => {
                      router.push(
                        `/product/${product.id}?tier=${obj.id}`,
                        undefined,
                        { shallow: true }
                      );
                    }}
                  >
                    {obj.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy Button */}
          {tier != null && (
            <div className="my-4">
              <button
                type="button"
                className="w-60 text-center block px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-purple hover:bg-purple-extradark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy now
              </button>
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
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
              Pricing Plans
            </h1>
            <p className="mt-5 text-xl text-gray-500 sm:text-center">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </p>
            <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
              <button
                type="button"
                className="relative w-1/2 bg-white border-gray-200 rounded-md shadow-sm py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Monthly billing
              </button>
              <button
                type="button"
                className="ml-0.5 relative w-1/2 border border-transparent rounded-md py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Yearly billing
              </button>
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Hobby
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  All the basics for starting a new business
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $12
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <a
                  href="/"
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  Buy Hobby
                </a>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Potenti felis, in cras at at ligula nunc.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Orci neque eget pellentesque.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Freelancer
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  All the basics for starting a new business
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $24
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <a
                  href="/"
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  Buy Freelancer
                </a>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Potenti felis, in cras at at ligula nunc.{" "}
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Orci neque eget pellentesque.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Donec mauris sit in eu tincidunt etiam.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Startup
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  All the basics for starting a new business
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $32
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <a
                  href="/"
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  Buy Startup
                </a>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Potenti felis, in cras at at ligula nunc.{" "}
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Orci neque eget pellentesque.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Donec mauris sit in eu tincidunt etiam.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Faucibus volutpat magna.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Enterprise
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  All the basics for starting a new business
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $48
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <a
                  href="/"
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  Buy Enterprise
                </a>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Potenti felis, in cras at at ligula nunc.{" "}
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Orci neque eget pellentesque.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Donec mauris sit in eu tincidunt etiam.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Faucibus volutpat magna.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Id sed tellus in varius quisque.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Risus egestas faucibus.
                    </span>
                  </li>

                  <li className="flex space-x-3">
                    {/* Heroicon name: solid/check */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Risus cursus ullamcorper.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
  const res = await supabase
    .from("products")
    .select(`*, vendors (*), tiers (*)`)
    .eq("id", params.id);
  const product = res.data[0];

  return {
    props: { product },
  };
}
