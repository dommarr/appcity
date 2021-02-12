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

const ImageSlider = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  return (
    <>
      <div className="navigation-wrapper h-full w-full relative">
        <div ref={sliderRef} className="keen-slider h-full w-full">
          {props.media.map((src, idx) => (
            <div key={idx} className="keen-slider__slide">
              <img src={src} />
            </div>
          ))}
        </div>
        {slider && (
          <>
            <svg
              onClick={(e) => e.stopPropagation() || slider.prev()}
              className={"arrow arrow--left"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
            </svg>
            <svg
              onClick={(e) => e.stopPropagation() || slider.next()}
              className={"arrow arrow--right"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
            </svg>
          </>
        )}
        {slider && (
          <div className="dots absolute inset-x-0 bottom-0">
            {[...Array(slider.details().size).keys()].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    slider.moveToSlideRelative(idx);
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
      <div className="block md:flex md:flex-row">
        {/* Left */}
        <div className="block bg-purple h-96 w-full md:w-3/5">
          {/* if media is not null, then display slider */}
          {product.media && <ImageSlider media={product.media} />}
          {/* need to add no images placeholder */}
        </div>
        {/* Right */}
        <div className="bg-gray-200 h-96 w-full md:w-2/5"></div>
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
  const res = await supabase.from("products").select("*").eq("id", params.id);
  const product = res.data[0];

  return {
    props: { product },
  };
}
