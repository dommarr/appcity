import { StarIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";
import { useRouter } from "next/router";

const fetcher = async (id) => {
  const res = await fetch(id);
  return await res.json();
};

export default function UserReviews({ user }) {
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // const refreshData = () => {
  //   router.replace(router.asPath);
  // };

  const { data: reviews } = useSWR(`/api/user_reviews/${user.id}`, fetcher, {
    onSuccess: (data) => {
      if (data.length < 1) {
        return;
      } else {
        setCount(data.length);
      }
    },
  });

  async function deleteReview(review_id, user_id, product_id) {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("reviews").delete().eq("id", review_id);
      if (error) {
        setLoading(false);
        throw error;
      }
      if (data) {
        try {
          const { data, error } = await supabase.storage.from("reviews").remove([`${user_id}_${product_id}`]);
          if (error) {
            setLoading(false);
            throw error;
          }
          if (data) {
            // refreshData();
            setLoading(false);
            return;
          }
        } catch (error) {
          setLoading(false);
          throw error;
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  if (!reviews || reviews.length < 1)
    return (
      <section className="py-4 space-y-4">
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                {count} reviews
              </h2>
            </div>
            <div className="mt-6 flex flex-col space-y-2">
              <span>Looks like you haven't reviewed anything yet.</span>
              <span>To leave a review, search for the app and go to the bottom of the app page.</span>
              <Link href={`/search`}>
                <a>
                  <button className="bg-purple border border-transparent shadow-sm mt-2 py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">Search apps</button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );

  if (loading) return <div>Loading...</div>;
  return (
    <section className="py-4 space-y-4">
      <div className="shadow sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
              {count} {count === 1 ? "review" : "reviews"}
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-6">
            {reviews.map((review) => (
              <li key={review.id} className="col-span-1 flex flex-col bg-gray-50 shadow divide-y divide-gray-200">
                <div className="flex-1 flex flex-col">
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
                  <video src={review.link} controls />
                  <div className="p-4 flex justify-center items-center space-x-2">
                    <Link href={`/product/${review.product}#reviews`}>
                      <a>
                        <button className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">Product page</button>
                      </a>
                    </Link>
                    <button onClick={() => deleteReview(review.id, user.id, review.product)} className="bg-red-600 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-0">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
