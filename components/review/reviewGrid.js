// /* This example requires Tailwind CSS v2.0+ */
// import { StarIcon } from "@heroicons/react/outline";
// import { useState, useEffect } from "react";
// import useSWR from "swr";
// import { supabase } from "../../utils/initSupabase"

// const fetcher = async (id) => {
//   const res = await fetch(id);
//   return await res.json();
// };

// export default function ReviewGrid(props) {
//   const { data: reviews } = useSWR(`/api/product_reviews/${props.product.id}`, fetcher, {
//     onSuccess: (data) => {
//       let sum = 0;
//       let i;
//       for (i = 0; i < data.length; i++) {
//         sum += data[i].rating;
//       }
//       props.setRating(Math.round((sum / data.length) * 10) / 10);
//       props.setCount(data.length);
//     },
//   });

//   if (!reviews || reviews.length < 1)
//     return (
//       <div className="flex flex-col justify-center items-center">
//         <span>Be the first to leave a review for this product!</span>
//       </div>
//     );
//   return (
//     <>
//       <div className="flex flex-col justify-center items-center mb-8">
//         <div className="flex justify-center items-center">
//           <div className="flex justify-center items-center p-2">
//             <StarIcon className={`h-10 w-10 text-purple ${props.rating > 0 ? "fill-current" : ""}`} />
//             <StarIcon className={`h-10 w-10 text-purple ${props.rating > 1 ? "fill-current" : ""}`} />
//             <StarIcon className={`h-10 w-10 text-purple ${props.rating > 2 ? "fill-current" : ""}`} />
//             <StarIcon className={`h-10 w-10 text-purple ${props.rating > 3 ? "fill-current" : ""}`} />
//             <StarIcon className={`h-10 w-10 text-purple ${props.rating > 4 ? "fill-current" : ""}`} />
//           </div>
//           <div className="text-2xl font-medium">{props.rating} of out 5 stars</div>
//         </div>
//         {props.count === 1 ? <div className="text-lg">{props.count} review</div> : <div className="text-lg">{props.count} reviews</div>}
//       </div>
//       <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
//         {reviews.map((review) => (
//           <li key={review.id} className="col-span-1 flex flex-col bg-gray-50 shadow divide-y divide-gray-200">
//             <div className="flex-1 flex flex-col">
//               <div className="flex justify-center items-center p-2">
//                 <StarIcon className={`h-7 w-7 text-purple ${review.rating > 0 ? "fill-current" : ""}`} />
//                 <StarIcon className={`h-7 w-7 text-purple ${review.rating > 1 ? "fill-current" : ""}`} />
//                 <StarIcon className={`h-7 w-7 text-purple ${review.rating > 2 ? "fill-current" : ""}`} />
//                 <StarIcon className={`h-7 w-7 text-purple ${review.rating > 3 ? "fill-current" : ""}`} />
//                 <StarIcon className={`h-7 w-7 text-purple ${review.rating > 4 ? "fill-current" : ""}`} />
//               </div>
//               <div className="text-lg font-medium text-center">{review.title}</div>
//               <div className="text-center pb-2">
//                 - {review.first_name} {review.last_name}
//               </div>
//               <video src={review.link} controls />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
