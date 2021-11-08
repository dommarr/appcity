/* This example requires Tailwind CSS v2.0+ */
import { StarIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { supabase } from "../../utils/initSupabase";
import { isMobile } from "react-device-detect";
import ReviewRecorder from "./reviewRecorder";
import Review from "./review";
import TextReview from "./textReview";

// const fetcher = async (id) => {
//   try {
//     const res = await fetch(id);
//     return await res.json();
//   } catch (error) {
//     throw error;
//   }
// };

// const downloadVideo = async (path) => {
//   const { data, error } = await supabase.storage.from("reviews").download(path);
//   if (error) {
//     throw error;
//   }
//   return data;
// };

export default function ReviewGrid(props) {
  const [loading, setLoading] = useState(true);
  const [displayReviews, setDisplayReviews] = useState([]);

  // const { data: reviews } = useSWR(`/api/product_reviews/${props.product.id}`, fetcher, {
  //   onSuccess: (data) => {
  //     let sum = 0;
  //     let i;
  //     for (i = 0; i < data.length; i++) {
  //       sum += data[i].rating;
  //     }
  //     props.setRating(Math.round((sum / data.length) * 10) / 10);
  //     props.setCount(data.length);
  //     getFilesPosters(data);
  //     setLoading(false);
  //   },
  // });

  useEffect(async () => {
    let reviews = await fetchReviews(props.product.id);
    if (reviews.length > 0) {
      // let sortedReviews = reviews.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
      setDisplayReviews(reviews);
      calcReviewStats(reviews);
    } else {
      props.setCount(0);
    }
    setLoading(false);
  }, []);

  const fetchReviews = async (product_id) => {
    let { data: reviews, error } = await supabase.from("reviews").select("*, users(*), reviews_tags(*, tags(*))").eq("product", product_id).order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return reviews;
  };

  const calcReviewStats = (reviewArray) => {
    let sum = 0;
    let i;
    for (i = 0; i < reviewArray.length; i++) {
      sum += reviewArray[i].rating;
    }
    props.setRating(Math.round((sum / reviewArray.length) * 10) / 10);
    props.setCount(reviewArray.length);
  };

  // const getFilesPosters = async (arr) => {
  //   for (let i = 0; i < arr.length; i++) {
  //     let blob = await downloadVideo(arr[i].path);
  //     let videoURL = window.URL.createObjectURL(blob);
  //     arr[i].file = videoURL;
  //     let poster = "";
  //     if (isMobile) {
  //       let path = `${arr[i].rating}_star_mobile.svg`;
  //       poster = await fetchPoster(path);
  //       poster = window.URL.createObjectURL(poster);
  //     } else {
  //       let path = `${arr[i].rating}_star_desktop.svg`;
  //       poster = await fetchPoster(path);
  //       poster = window.URL.createObjectURL(poster);
  //     }
  //     arr[i].poster = poster;
  //   }
  //   setDisplayReviews(arr);
  // };

  // const fetchPoster = async (path) => {
  //   const { data, error } = await supabase.storage.from("reviews").download(`video_poster_images/${path}`);
  //   if (error) {
  //     throw error;
  //   }
  //   return data;
  // };

  if (!displayReviews || displayReviews.length < 1)
    return (
      <div className="flex flex-col justify-center items-center p-2 space-y-2">
        <ReviewRecorder user={props.user} product={props.product} />
        <div className="flex justify-center items-center p-2 animate-pulse">
          <StarIcon className={`h-10 w-10 text-purple`} />
          <StarIcon className={`h-10 w-10 text-purple`} />
          <StarIcon className={`h-10 w-10 text-purple`} />
          <StarIcon className={`h-10 w-10 text-purple`} />
          <StarIcon className={`h-10 w-10 text-purple`} />
        </div>
        <span className="text-lg font-medium text-center">Be the first to leave a review for this app!</span>
      </div>
    );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-4 space-y-2 sm:space-y-1">
        <div className="flex justify-center items-center flex-col sm:flex-row">
          <div className="flex justify-center items-center p-2">
            <StarIcon className={`h-10 w-10 text-purple ${props.rating >= 0.5 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating >= 1.5 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating >= 2.5 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating >= 3.5 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating >= 4.5 ? "fill-current" : ""}`} />
          </div>
          <div className="text-2xl font-medium">{props.rating} out of 5 stars</div>
        </div>
        {props.count === 1 ? <div className="text-xl">{props.count} review</div> : <div className="text-xl">{props.count} reviews</div>}
      </div>
      <ReviewRecorder user={props.user} product={props.product} />
      {/* <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"> */}
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* {displayReviews &&
          displayReviews.map((review) => {
            let videoJsOptions = {
              autoplay: false,
              controls: true,
              sources: [
                {
                  src: review.file,
                  type: "video/mp4",
                },
              ],
            };
            return <Review key={review.id} review={review} />;
          })} */}
        {displayReviews && displayReviews.map((review) => <TextReview key={review.id} review={review} />)}
      </ul>
    </>
  );
}
