import { connectPagination } from "react-instantsearch-dom";

const Pagination_Custom = ({ currentRefinement, nbPages, refine, createURL }) => (
  <>
    <div className="-mt-px w-0 flex-1 flex">
      <a
        href="#top"
        onClick={(event) => {
          if (currentRefinement === 1) {
          } else {
            event.preventDefault();
            refine(currentRefinement - 1);
          }
        }}
        className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        {/* Heroicon name: arrow-narrow-left */}
        <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Previous
      </a>
    </div>

    <ul className="hidden md:-mt-px md:flex">
      {new Array(nbPages).fill(null).map((_, index) => {
        const page = index + 1;
        const style =
          currentRefinement === page
            ? "border-purple text-purple border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium";

        return (
          <li key={index} className={style}>
            <a
              href={createURL(page)}
              // style={style}
              onClick={(event) => {
                event.preventDefault();
                refine(page);
              }}
            >
              {page}
            </a>
          </li>
        );
      })}
    </ul>

    <div className="-mt-px w-0 flex-1 flex justify-end">
      <a
        href="#top"
        onClick={(event) => {
          if (currentRefinement === nbPages) {
          } else {
            event.preventDefault();
            refine(currentRefinement + 1);
          }
        }}
        className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Next
        {/* Heroicon name: arrow-narrow-right */}
        <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  </>
);

const CustomPagination = connectPagination(Pagination_Custom);

export default CustomPagination;
