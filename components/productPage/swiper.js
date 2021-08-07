import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from "react-player";
import { useLightbox } from "simple-react-lightbox-pro";
import Image from "next/image";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper/core";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

export default function SwiperSlider({ media }) {
  const { openLightbox } = useLightbox();
  const [playing, setPlaying] = useState(false);
  const [sortedMedia, setSortedMedia] = useState(false);

  function sortArray(arr) {
    let images = arr.filter((item) => item.includes("supabase"));
    let videos = arr.filter((item) => !item.includes("supabase"));
    return images.concat(videos);
  }

  useEffect(() => {
    setSortedMedia(sortArray(media));
  }, []);

  if (!sortedMedia) return <div className="text-white animate-pulse">Loading...</div>;

  return (
    <Swiper
      pagination={{
        type: "progressbar",
      }}
      navigation={true}
      className="w-full h-full min-h-full flex flex-col items-center justify-center"
      onSlideChange={() => setPlaying(false)}
    >
      {sortedMedia &&
        sortedMedia.map((val, idx) => (
          <SwiperSlide key={idx} className="w-full h-full flex flex-col items-center justify-center">
            {val.includes("supabase") ? (
              <img src={val} onClick={() => openLightbox(idx)} className={`h-auto w-auto max-w-full max-h-full hover:cursor-pointer`} />
            ) : (
              <div className="w-full h-full py-20 sm:p-20 md:py-28 md:px-10 xl:p-20">
                <ReactPlayer
                  controls
                  url={val}
                  playing={playing[idx]}
                  onPlay={() => setPlaying({ [idx]: true })}
                  onPause={() => setPlaying({ [idx]: false })}
                  width="100%"
                  height="100%"
                  className={``}
                />
              </div>
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
