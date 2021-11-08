import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import Loading from "./sectionLoading";
import CardLoading from "./cardLoading";
import { InformationCircleIcon, ExclamationIcon, LockClosedIcon } from "@heroicons/react/solid";
import Review from "../review/review";
import TextReview from "../review/textReview";
import FormButton from "../global/formButton";
import DiscountStatus from "./discountStatus";

const fetcher = async (id) => {
  try {
    const res = await fetch(id);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export default function UserReviews({ user }) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewArray, setReviewArray] = useState();
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState("");

  // const refreshData = () => {
  //   router.replace(router.asPath);
  // };

  // Fetch on load
  useEffect(async () => {
    setLoading(false);
    await fetchReviews(user.id);
  }, []);

  const fetchReviewData = async (uid) => {
    let { data: reviews, error } = await supabase.from("reviews").select("*, product(*), users(*), reviews_tags(*, tags(*))").eq("user", uid).order("created_at", { ascending: false });
    if (error) {
      setReviewsLoading(false);
      throw error;
    }
    return reviews;
  };

  const fetchReviews = async (uid) => {
    setReviewsLoading(true);
    let reviews = await fetchReviewData(uid);
    if (reviews.length > 0) {
      //let sortedReviews = reviews.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
      setReviewArray(reviews);
    } else {
      setReviewArray([]);
    }
    setCount(reviews.length);
    setReviewsLoading(false);
  };

  // Re-instate for video reviews
  // const fetchReviews = async () => {
  //   setReviewsLoading(true);
  //   let { data: reviews, error } = await supabase.from("reviews").select("*, product (id, name), reviews_tags (*, tags (*)))").eq("user", user.id).eq("video_available", true);
  //   if (error) {
  //     setReviewsLoading(false);
  //     throw error;
  //   }
  //   if (reviews.length < 1) {
  //     setCount(reviews.length);
  //     setReviewArray(reviews);
  //     setReviewsLoading(false);
  //     return;
  //   } else {
  //     setCount(reviews.length);
  //     getFilesPosters(reviews);
  //   }
  // };

  // Re-instate for video reviews
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
  //   setReviewArray(arr);
  //   setReviewsLoading(false);
  // };

  // Re-instate for video reviews
  // const downloadVideo = async (path) => {
  //   const { data, error } = await supabase.storage.from("reviews").download(path);
  //   if (error) {
  //     throw error;
  //   }
  //   return data;
  // };

  // Re-instate for video reviews
  // const fetchPoster = async (path) => {
  //   const { data, error } = await supabase.storage.from("reviews").download(`video_poster_images/${path}`);
  //   if (error) {
  //     throw error;
  //   }
  //   return data;
  // };

  const deleteTags = async (reviewId) => {
    const { data, error } = await supabase.from("reviews_tags").delete().eq("review_id", reviewId);
    if (error) {
      throw error;
    }
    return data;
  };

  const deleteReview = async (reviewId) => {
    const { data, error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) {
      throw error;
    }
    return data;
  };

  // Re-instate for video reviews + commented out portion of handleDelete below
  // const deleteVideo = async (path) => {
  //   const { data, error } = await supabase.storage.from("reviews").remove([path]);
  //   if (error) {
  //     throw error;
  //   }
  //   return data;
  // };

  const handleDelete = async (reviewId) => {
    try {
      await deleteTags(reviewId);
      await deleteReview(reviewId);
      //await deleteVideo(path);
      await fetchReviews(user.id);
    } catch (error) {
      throw error;
    }
  };

  if (reviewArray?.length < 1)
    return (
      <section className="py-4 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Your reviews</h1>
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6 space-y-4">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                {count} reviews
              </h2>
            </div>
            <DiscountStatus reviewCount={count} />
          </div>
        </div>
      </section>
    );

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Your reviews</h1>
      {reviewsLoading && <CardLoading />}
      {!reviewsLoading && (
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                {count} {count === 1 ? "review" : "reviews"}
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
              {reviewArray &&
                reviewArray.map((review) => (
                  <div key={review.id} className="flex flex-col shadow">
                    <div className="flex justify-between p-4 space-x-2 bg-white border-t border-gray-200">
                      <div className="flex items-center justif-center space-x-1">
                        <h3 className="text-center text-md font-medium">{review.product.name}</h3>
                        <Link href={`/product/${review.product.id}#reviews`}>
                          <a target="_blank">
                            <ExternalLinkIcon className="h-5 w-5 text-purple hover:cursor-pointer" />
                          </a>
                        </Link>
                      </div>
                      <FormButton type="delete" func={handleDelete} params={review.id} />
                    </div>
                    {/* <Review review={review} /> */}
                    <TextReview review={review} dashboardView={true} />
                  </div>
                ))}
            </ul>
            {/* <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">It may take up to 24 hours for new reviews to appear here.</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </section>
  );
}
