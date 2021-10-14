import Tag from "./tag";
import { StarIcon } from "@heroicons/react/outline";

export default function Review({ review }) {
  return (
    <li key={review.id} className="col-span-1 flex flex-col bg-white border shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col">
        <video controls className="object-fill bg-purple-extradark w-full" poster={review.poster}>
          <source src={review.file} type="video/mp4" />
        </video>
        <div className="flex flex-col justify-start items-center py-4 px-2 space-y-1 h-full">
          <div className="text-lg text-center text-gray-700">"{review.title}"</div>
          <div className="font-medium text-sm">
            - {review.first_name} {review.last_name}
          </div>
          <div className="flex justify-center items-center">
            <StarIcon className={`h-5 w-5 text-purple ${review.rating > 0 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${review.rating > 1 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${review.rating > 2 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${review.rating > 3 ? "fill-current" : ""}`} />
            <StarIcon className={`h-5 w-5 text-purple ${review.rating > 4 ? "fill-current" : ""}`} />
          </div>
          {review?.reviews_tags && (
            <div className="flex flex-wrap items-center justify-center -m-0.5 pt-2">
              {review?.reviews_tags.map((tag) => (
                <Tag key={tag.id} tag={tag.tags} />
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
