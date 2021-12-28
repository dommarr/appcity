import { connectStateResults } from "react-instantsearch-dom";
import { ExclamationIcon, InformationCircleIcon } from "@heroicons/react/solid";

const Results = connectStateResults(({ searchState, searchResults, children }) => {
  // empty state for no search results
  if (searchResults && searchResults.nbHits === 0) {
    return (
      <div className="space-y-2">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex items-center justify-center">
              <ExclamationIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3 space-x-1">
              <span className="text-sm text-amber-700">Oops! Looks like we don't have any results for "{searchState.query}". Please try again.</span>
              {/* <CustomClearRefinements clearsQuery /> */}
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex items-center justify-center">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">We are actively monitoring empty searches like this. Thanks for your patience as we fill out our catalog!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // empty state for no search query
  if (searchState && !searchState.query) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex items-center justify-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">Enter a search query.</p>
          </div>
        </div>
      </div>
    );
  }
  return children;
});

export default Results;
