import { StarIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import Loading from "./sectionLoading";
import CardLoading from "./cardLoading";
import { InformationCircleIcon, ExclamationIcon } from "@heroicons/react/solid";

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

  // const refreshData = () => {
  //   router.replace(router.asPath);
  // };

  // Fetch on load
  useEffect(() => {
    setLoading(false);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    let { data: reviews, error } = await supabase.from("reviews").select("*, product (id, name)").eq("user", user.id).eq("video_available", true);
    if (error) {
      setReviewsLoading(false);
      throw error;
    }
    if (reviews.length < 1) {
      setCount(reviews.length);
      setReviewArray(reviews);
      setReviewsLoading(false);
      return;
    } else {
      setCount(reviews.length);
      getFilesPosters(reviews);
    }
  };

  const getFilesPosters = async (arr) => {
    for (let i = 0; i < arr.length; i++) {
      let blob = await downloadVideo(arr[i].path);
      let videoURL = window.URL.createObjectURL(blob);
      arr[i].file = videoURL;
      let poster = "";
      if (isMobile) {
        let path = `${arr[i].rating}_star_mobile.svg`;
        poster = await fetchPoster(path);
        poster = window.URL.createObjectURL(poster);
      } else {
        let path = `${arr[i].rating}_star_desktop.svg`;
        poster = await fetchPoster(path);
        poster = window.URL.createObjectURL(poster);
      }
      arr[i].poster = poster;
    }
    setReviewArray(arr);
    setReviewsLoading(false);
  };

  const downloadVideo = async (path) => {
    const { data, error } = await supabase.storage.from("reviews").download(path);
    if (error) {
      throw error;
    }
    return data;
  };

  const fetchPoster = async (path) => {
    const { data, error } = await supabase.storage.from("reviews").download(`video_poster_images/${path}`);
    if (error) {
      throw error;
    }
    return data;
  };

  const deleteReview = async (review_id, path) => {
    setReviewsLoading(true);
    const { data, error } = await supabase.from("reviews").delete().eq("id", review_id);
    if (error) {
      setReviewsLoading(false);
      throw error;
    }
    if (data) {
      const { data, error } = await supabase.storage.from("reviews").remove([path]);
      if (error) {
        setReviewsLoading(false);
        throw error;
      }
      fetchReviews();
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
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex-1 md:flex items-center md:justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <p className="text-sm text-amber-700">Looks like you haven't reviewed anything yet.</p>
                    <p className="text-sm text-amber-700">To leave a review, search for the app and go to the bottom of the app page.</p>
                  </div>
                </div>
                <p className="ml-8 mt-3 text-sm md:mt-0 md:ml-6">
                  <Link href={`/search`}>
                    <a className="whitespace-nowrap font-medium text-amber-700 hover:text-amber-600">
                      Search apps <span aria-hidden="true">&rarr;</span>
                    </a>
                  </Link>
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">It may take up to 24 hours for new reviews to appear here.</p>
                </div>
              </div>
            </div>
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
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-6">
              {reviewArray &&
                reviewArray.map((review) => (
                  <li key={review.id} className="col-span-1 flex flex-col bg-white border shadow divide-y divide-gray-200">
                    <div className="flex-1 flex flex-col">
                      <div className="p-4 space-y-2">
                        <h3 className="text-center text-xl font-medium">{review.product.name}</h3>
                        <div className="flex justify-center items-center space-x-2">
                          <Link href={`/product/${review.product.id}#reviews`}>
                            <a>
                              <button
                                type="button"
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
                              >
                                App page
                              </button>
                            </a>
                          </Link>
                          <button
                            onClick={() => deleteReview(review.id, review.path)}
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <video controls className="object-fill bg-purple-extradark w-full" poster={review.poster}>
                        <source src={review.file} type="video/mp4" />
                      </video>
                      <div className="flex flex-col justify-start items-center py-4 px-2 space-y-2 h-full">
                        <div className="flex justify-center items-center">
                          <StarIcon className={`h-7 w-7 text-purple ${review.rating > 0 ? "fill-current" : ""}`} />
                          <StarIcon className={`h-7 w-7 text-purple ${review.rating > 1 ? "fill-current" : ""}`} />
                          <StarIcon className={`h-7 w-7 text-purple ${review.rating > 2 ? "fill-current" : ""}`} />
                          <StarIcon className={`h-7 w-7 text-purple ${review.rating > 3 ? "fill-current" : ""}`} />
                          <StarIcon className={`h-7 w-7 text-purple ${review.rating > 4 ? "fill-current" : ""}`} />
                        </div>
                        <div className="flex flex-col justify-center items-center h-full space-y-2">
                          <div className="text-lg font-medium text-center">{review.title}</div>
                          <div className="text-center text-sm">
                            - {review.first_name} {review.last_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">It may take up to 24 hours for new reviews to appear here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
