import Tag from "./tag";
import { StarIcon } from "@heroicons/react/outline";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const compare = (a, b) => {
  const optionA = a.tags.type;
  const optionB = b.tags.type;

  let comparison = 0;
  if (optionA > optionB) {
    comparison = 1;
  } else if (optionA < optionB) {
    comparison = -1;
  }
  return comparison;
};

export default function Review({ review, dashboardView }) {
  let date = moment(review.created_at).format("LL");
  let user = review.users;
  let tags = review.reviews_tags.sort(compare);
  return (
    <div key={review.id} className="flex text-sm text-gray-500 space-x-4">
      {/* <div className="flex-none py-10">
        <img src={review.avatarSrc} alt="" className="w-10 h-10 bg-gray-100 rounded-full" />
      </div> */}
      <div className={`border-t border-gray-200 flex-1 p-6 space-y-6 ${dashboardView ? "" : "shadow"}`}>
        <div id="review-top" className="flex space-x-6 justify-between">
          <div className="flex flex-col items-start justify-center">
            <h3 className="font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <div className="flex">
              <p>{user.title}</p>
              {user.company && <p>, {user.company}</p>}
            </div>
            {tags && (
              <div className="flex flex-wrap items-center justify-start -m-0.5 pt-2">
                {tags
                  .filter((tag) => tag.tags.group === "context")
                  .map((tag) => (
                    <Tag key={tag.id} tag={tag.tags} />
                  ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end justify-start">
            <p>
              <time dateTime={review.created_at}>{date}</time>
            </p>
          </div>
        </div>

        <div id="review-mid">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon key={rating} className={classNames(review.rating > rating ? "fill-current" : "", "h-5 w-5 text-purple flex-shrink-0 filter drop-shadow-sm")} aria-hidden="true" />
            ))}
          </div>
          <p className="sr-only">{review.rating} out of 5 stars</p>
          {tags && (
            <div className="flex flex-wrap items-center justify-start -m-0.5 pt-2">
              {tags
                .filter((tag) => tag.tags.group === "app")
                .map((tag) => (
                  <Tag key={tag.id} tag={tag.tags} />
                ))}
            </div>
          )}
        </div>

        <div id="review-bottom" className="flex flex-col space-y-4">
          <h3 className="text-sm font-medium text-gray-900">{review.title}</h3>
          <div style={{ whiteSpace: "pre-line" }} className="prose prose-sm max-w-none text-gray-500" dangerouslySetInnerHTML={{ __html: review.text }} />
        </div>
      </div>
    </div>
  );
}

// <li key={review.id} className="col-span-1 flex flex-col bg-white border shadow divide-y divide-gray-200">
//   <div className="flex-1 flex flex-col">
//     <video controls className="object-contain bg-purple-extradark w-full max-h-72" poster={review.poster}>
//       <source src={review.file} type="video/mp4" />
//     </video>
//     <div className="flex flex-col justify-start items-center py-4 px-2 space-y-1 h-full">
//       <div className="text-lg text-center text-gray-700">"{review.title}"</div>
//       <div className="font-medium text-sm">
//         - {review.first_name} {review.last_name}
//       </div>
//       <div className="flex justify-center items-center">
//         <StarIcon className={`h-5 w-5 text-purple ${review.rating > 0 ? "fill-current" : ""}`} />
//         <StarIcon className={`h-5 w-5 text-purple ${review.rating > 1 ? "fill-current" : ""}`} />
//         <StarIcon className={`h-5 w-5 text-purple ${review.rating > 2 ? "fill-current" : ""}`} />
//         <StarIcon className={`h-5 w-5 text-purple ${review.rating > 3 ? "fill-current" : ""}`} />
//         <StarIcon className={`h-5 w-5 text-purple ${review.rating > 4 ? "fill-current" : ""}`} />
//       </div>
//       {review?.reviews_tags && (
//         <div className="flex flex-wrap items-center justify-center -m-0.5 pt-2">
//           {review?.reviews_tags.map((tag) => (
//             <Tag key={tag.id} tag={tag.tags} />
//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// </li>;
