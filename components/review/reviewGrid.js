/* This example requires Tailwind CSS v2.0+ */
import { StarIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { supabase } from "../../utils/initSupabase";

const fetcher = async (id) => {
  try {
    const res = await fetch(id);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export default function ReviewGrid(props) {
  const { data: reviews } = useSWR(`/api/product_reviews/${props.product.id}`, fetcher, {
    onSuccess: (data) => {
      let sum = 0;
      let i;
      for (i = 0; i < data.length; i++) {
        sum += data[i].rating;
      }
      props.setRating(Math.round((sum / data.length) * 10) / 10);
      props.setCount(data.length);
    },
  });

  if (!reviews || reviews.length < 1)
    return (
      <div className="flex flex-col justify-center items-center">
        <span>Be the first to leave a review for this product!</span>
      </div>
    );
  return (
    <>
      <div className="flex flex-col justify-center items-center mb-8 space-y-2 sm:space-y-1">
        <div className="flex justify-center items-center flex-col sm:flex-row">
          <div className="flex justify-center items-center p-2">
            <StarIcon className={`h-10 w-10 text-purple ${props.rating > 0 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating > 1 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating > 2 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating > 3 ? "fill-current" : ""}`} />
            <StarIcon className={`h-10 w-10 text-purple ${props.rating > 4 ? "fill-current" : ""}`} />
          </div>
          <div className="text-2xl font-medium">{props.rating} of out 5 stars</div>
        </div>
        {props.count === 1 ? <div className="text-lg">{props.count} review</div> : <div className="text-lg">{props.count} reviews</div>}
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => {
          let poster = "";
          if (review.rating === 1) {
            poster =
              "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/1_star.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvMV9zdGFyLnN2ZyIsImlhdCI6MTYyMjE1NDYyMSwiZXhwIjoxOTM3NTE0NjIxfQ.1ofX0KdOwWstRJ27rEMPeLO2Q9klG-B0u6c5ikbshcQ";
          } else if (review.rating === 2) {
            poster =
              "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/2_stars.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvMl9zdGFycy5zdmciLCJpYXQiOjE2MjIxNTQ2NDUsImV4cCI6MTkzNzUxNDY0NX0.8kKOlD812ZoVPGeHLW8_m8yrn7DgjLlbXS6A-1Y2xMA";
          } else if (review.rating === 3) {
            poster =
              "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/3_stars.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvM19zdGFycy5zdmciLCJpYXQiOjE2MjIxNTQ2NTEsImV4cCI6MTkzNzUxNDY1MX0.h-fyWAimiWUeXERVpRvBu5QbMr9gUxNl3uTxvpK2XmI";
          } else if (review.rating === 4) {
            poster =
              "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/4_stars.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvNF9zdGFycy5zdmciLCJpYXQiOjE2MjIxNTQ2NTksImV4cCI6MTkzNzUxNDY1OX0._D8KypFXFXe38EI-qFOo8vSx4assI9x6rQ1k4uc51Pc";
          } else if (review.rating === 5) {
            poster =
              "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/5_stars.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvNV9zdGFycy5zdmciLCJpYXQiOjE2MjIxNTM2MDcsImV4cCI6MTkzNzUxMzYwN30.23toDls6fhdNa6_ESebhnQ_HdlEnFGBmeDkA05Nraug";
          } else {
          }

          return (
            <li key={review.id} className="col-span-1 flex flex-col bg-gray-50 shadow divide-y divide-gray-200">
              <div className="flex-1 flex flex-col">
                <video controls poster={poster}>
                  <source src={review.link} type="video/mp4" />
                </video>
                <div className="flex justify-center items-center p-2">
                  <StarIcon className={`h-7 w-7 text-purple ${review.rating > 0 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-7 w-7 text-purple ${review.rating > 1 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-7 w-7 text-purple ${review.rating > 2 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-7 w-7 text-purple ${review.rating > 3 ? "fill-current" : ""}`} />
                  <StarIcon className={`h-7 w-7 text-purple ${review.rating > 4 ? "fill-current" : ""}`} />
                </div>
                <div className="text-lg font-medium text-center">{review.title}</div>
                <div className="text-center pb-2">
                  - {review.first_name} {review.last_name}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
