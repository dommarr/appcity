import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { useState } from "react";
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

  return (
    <>
      <div className="navigation-wrapper h-full w-full relative">
        <div ref={sliderRef} className="keen-slider h-full w-full">
          {props.media.map((src, idx) => (
            <div key={idx} className="keen-slider__slide">
              {/* if image, render image. else, render video player */}
              {src.match(/\.(jpeg|jpg|gif|png)$/) && <img src={src} />}
              {!src.match(/\.(jpeg|jpg|gif|png)$/) && (
                <ReactPlayer playing={playing} url={src} />
              )}
            </div>
          ))}
        </div>
        {slider && (
          <>
            <div className="absolute inset-y-0 left-0 h-full flex flex-col justify-center items-center pl-1">
              <svg
                onClick={(e) => {
                  e.stopPropagation() || slider.prev();
                  setPlaying(false);
                }}
                className="h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-1 pr-2 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 h-full flex flex-col justify-center items-center pr-1">
              <svg
                onClick={(e) => {
                  e.stopPropagation() || slider.next();
                  setPlaying(false);
                }}
                className="h-16 w-16 cursor-pointer text-gray-400 hover:text-black py-2 pl-2 pr-1 opacity-40 rounded-full hover:opacity-100 hover:bg-gray-400 hover:bg-opacity-40"
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
          <h2 className="ml-2 text-gray-500 hover:underline">
            {product.vendors.name}
          </h2>
        </a>
      </div>
      <div className="block md:flex md:flex-row h-4/5">
        {/* Left */}
        <div className="flex flex-col justify-center items-center h-4/5 w-full md:w-3/5 bg-black">
          {/* <SRLWrapper> */}
          {/* if media is not null, then display slider */}
          {product.media && <ImageSlider media={product.media} />}
          {/* need to add no images placeholder */}
          {/* </SRLWrapper> */}
        </div>
        {/* Right */}
        <div className="h-4/5 w-full md:w-2/5 flex flex-col justify-center items-center">
          <div className="hidden md:flex flex-col justify-center items-start m-5">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <a className="mt-2 flex" href={product.vendors.website}>
              <img
                className="object-contain object-center w-6 h-6 flex-shrink-0 mx-auto"
                src={product.vendors.logo}
                alt={`${product.vendors.name} logo`}
              />
              <h2 className="ml-2 text-gray-500 hover:underline">
                {product.vendors.name}
              </h2>
            </a>
          </div>
        </div>
      </div>
      <div></div>
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
