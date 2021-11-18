import {
  InstantSearch,
  SearchBox,
  ScrollTo,
  Highlight,
  RangeInput,
  HierarchicalMenu,
  RatingMenu,
  Stats,
  SortBy,
  ClearRefinements,
  RefinementList,
  Configure,
  connectHits,
  connectPagination,
  connectStateResults,
  connectCurrentRefinements,
} from "react-instantsearch-dom";
import RefinementBlock from "./refinementBlock";
import PriceBlock from "./priceBlock";
import PropTypes from "prop-types";
import Link from "next/link";
import React from "react";
React.useLayoutEffect = React.useEffect;
import { useRouter } from "next/router";
import { StarIcon, XIcon } from "@heroicons/react/outline";
import { ExclamationIcon, InformationCircleIcon } from "@heroicons/react/solid";
import DiscountTooltip from "./discountTooltip";
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";

function Hits({ hits, monthlyPrice, locked }) {
  const router = useRouter();
  // const handleClick = (e) => {
  //   e.preventDefault()
  //   router.push(href)
  // }

  return (
    // 2xl:grid-cols-5
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hits.map((hit) => (
        <li
          key={hit.objectID}
          onClick={() => router.push({ pathname: `/product/${hit.product_id}`, query: { tier: hit.objectID } })}
          className="col-span-1 flex flex-col text-center bg-white shadow divide-y divide-gray-200 cursor-pointer"
        >
          <div className="flex-1 flex flex-col p-4 md:px-2 lg:p-4">
            <Link
              href={{
                pathname: `/product/${hit.product_id}`,
                query: { tier: hit.objectID },
              }}
            >
              <a>
                <img className="object-contain object-center w-28 h-28 flex-shrink-0 mx-auto" src={hit.logo} alt={`${hit.vendor} logo`} />
                {/* Header Block */}
                <div className="flex flex-col justify-center items-center h-20">
                  <h2 className="text-gray-900 text-base font-medium">{hit.product}</h2>
                  {!hit.single_tier && <h3 className="mt-1 text-gray-500 text-sm font-normal">{hit.tier}</h3>}
                </div>
              </a>
            </Link>
            <div className="flex justify-center items-center p-2">
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 0 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 1 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 2 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 3 ? "fill-current" : ""}`} />
              <StarIcon className={`h-5 w-5 text-purple ${hit.rating > 4 ? "fill-current" : ""}`} />
              <span className="ml-2 text-sm">
                {hit.count} {hit.count === 1 ? "review" : "reviews"}
              </span>
            </div>
            <PriceBlock tier={hit} model={hit.price_model} large={false} monthly={monthlyPrice} search={true} />
            {hit.discount_message && <DiscountTooltip discountMessage={hit.discount_message} locked={locked} search={true} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

const CustomHits = connectHits(Hits);

const EmptySearchClearRefinements = ({ items, refine }) => {
  return (
    <button onClick={() => refine(items)} disabled={!items.length} className="text-sm font-medium underline text-amber-700 hover:text-amber-600 focus:outline-none focus:ring-0">
      Clear and try again.
    </button>
  );
};

const CustomClearRefinements = connectCurrentRefinements(EmptySearchClearRefinements);

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
  // return hits
  return children;
});

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

class SearchApp extends React.Component {
  constructor(props) {
    super(props);
    this.flipPrice = this.flipPrice.bind(this);
    this.state = {
      showSidebar: false,
      monthlyPrice: false,
      locked: true,
    };
  }

  flipPrice() {
    this.setState(!this.state.monthlyPrice);
  }

  async fetchReviewCount(uid) {
    let { data: reviews, error } = await supabase.from("reviews").select("rating").eq("user", uid);
    if (error) {
      throw error;
    }
    return reviews.length;
  }

  async componentDidMount() {
    if (this.props.user) {
      let reviewCount = await this.fetchReviewCount(this.props.user.id);
      if (reviewCount > 0) {
        this.setState({ locked: false });
      }
    }
  }

  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  };

  render() {
    return (
      <div id="top" className="flex bg-gray-100 select-none">
        {/* prevent auto-zoom when selecting the sort-by dropdown menu on mobile */}
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <InstantSearch
          searchClient={this.props.searchClient}
          resultsState={this.props.resultsState}
          onSearchStateChange={this.props.onSearchStateChange}
          searchState={this.props.searchState}
          createURL={this.props.createURL}
          indexName={this.props.indexName}
          onSearchParameters={this.props.onSearchParameters}
          {...this.props}
        >
          {/* Sidebar - static on md screen widths and popover menu on < md */}
          {/* level 1 */}
          <div id="sidebar-container" className={`${this.state.showSidebar ? `flex` : `hidden`} fixed inset-0 z-40 md:flex md:static md:inset-auto md:z-auto md:flex-shrink-0`}>
            <div className="flex items-end w-full h-full justify-center md:justify-start md:items-start">
              <div
                id="sidebar-background"
                className={`${this.state.showSidebar ? `block` : `hidden`} fixed inset-0 md:hidden`}
                aria-hidden="true"
                enter="transition-opacity ease-linear duration-300"
                enterfrom="opacity-0"
                enterto="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leavefrom="opacity-100"
                leaveto="opacity-0"
              >
                <div onClick={() => this.setState({ showSidebar: false })} className="absolute inset-0 bg-gray-600 opacity-75"></div>
              </div>
              {/* level 2 */}
              <div
                id="sidebar-content"
                className={`${
                  this.state.showSidebar ? `flex` : `hidden`
                } rounded-t-2xl md:flex relative flex-1 flex-col h-4/6 w-full pb-4 bg-white md:h-full md:static md:flex-auto md:max-w-none md:w-64 md:p-0`}
              >
                <div
                  onClick={() => this.setState({ showSidebar: false })}
                  className={`${this.state.showSidebar ? "absolute" : "hidden"} md:hidden top-0 right-0 p-3 bg-white cursor-pointer rounded-tr-2xl`}
                >
                  <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                </div>

                <div className="mt-5 flex-1 h-0 overflow-y-auto md:m-0 md:flex-auto md:h-auto md:flex md:flex-col md:flex-grow md:border-r md:border-gray-200 md:py-2 md:bg-white">
                  <div className="md:flex-grow md:flex md:flex-col">
                    <nav className="max-w-sm mx-auto px-2 space-y-1 md:flex-1 md:bg-white">
                      <ClearRefinements />
                      <Configure hitsPerPage={24} filters="NOT _tags:hidden" />
                      <RefinementBlock header="Price">
                        {/* Hide on empty */}
                        {this.props.searchState.query && (
                          <>
                            <RangeInput attribute="sort_price_monthly" className={`${this.state.monthlyPrice ? "block" : "hidden"}`} />
                            <RangeInput attribute="sort_price_yearly" className={`${this.state.monthlyPrice ? "hidden" : "block"}`} />
                            <div className="relative self-center bg-gray-100 p-0.5 flex items-center mt-4">
                              <button
                                type="button"
                                onClick={() => this.setState({ monthlyPrice: true })}
                                className={`relative w-1/2 ${
                                  this.state.monthlyPrice ? "bg-white shadow-sm" : "bg-transparent"
                                } py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none md:w-auto px-3.5`}
                              >
                                Monthly billing
                              </button>
                              <button
                                type="button"
                                onClick={() => this.setState({ monthlyPrice: false })}
                                className={`ml-0.5 relative w-1/2 ${
                                  this.state.monthlyPrice ? "bg-transparent" : "bg-white shadow-sm"
                                } py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none md:w-auto px-3.5`}
                              >
                                Yearly billing
                              </button>
                            </div>
                          </>
                        )}
                      </RefinementBlock>
                      <RefinementBlock header="Category">
                        {this.props.searchState.query && <HierarchicalMenu attributes={["categories.lvl0", "categories.lvl1", "categories.lvl2"]} limit={10} facetOrdering showMore />}
                      </RefinementBlock>
                      <RefinementBlock header="Industry" tooltip="Many apps are general use, others are built for a specific industry.">
                        {this.props.searchState.query && <RefinementList attribute="industry" limit={10} showMoreLimit={100} showMore />}
                      </RefinementBlock>
                      <RefinementBlock header="Rating">{this.props.searchState.query && <RatingMenu attribute="rating" />}</RefinementBlock>
                      <RefinementBlock header="Developer">{this.props.searchState.query && <RefinementList attribute="vendor" limit={10} showMoreLimit={100} showMore />}</RefinementBlock>
                      <RefinementBlock header="Features">{this.props.searchState.query && <RefinementList attribute="features" limit={15} showMoreLimit={100} showMore />}</RefinementBlock>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col w-0 flex-1 overflow-hidden">
            <ScrollTo>
              <div className="hidden relative flex-shrink-0 flex h-12 bg-white shadow">
                <button
                  className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-extralight md:hidden"
                  onClick={() => this.setState({ showSidebar: true })}
                >
                  <span className="sr-only">Open sidebar</span>
                  {/* Heroicon name: menu-alt-2 */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
                <div className="flex-1 px-4 flex justify-between">
                  <SearchBox
                    searchAsYouType={false}
                    // onSubmit={(event) => {
                    //   event.preventDefault();
                    //   let elements = document.getElementsByClassName("ais-ClearRefinements-button");
                    //   elements[0].click();
                    // }}
                    submit={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                      </svg>
                    }
                    reset={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </ScrollTo>
            {/* Hide stats and sorts if there is no query */}
            {this.props.searchState.query && (
              <div className="flex-shrink-0 flex justify-end sm:justify-between items-center bg-white shadow px-5 py-0.5">
                {/* <CurrentRefinements /> */}
                <Stats className="hidden sm:block" />
                <SortBy
                  defaultRefinement="catalog"
                  items={[
                    { label: "Relevance", value: "catalog" },
                    {
                      label: "Price Low to High (pay yearly)",
                      value: "catalog_price_low_to_high_yearly",
                    },
                    {
                      label: "Price Low to High (pay monthly)",
                      value: "catalog_price_low_to_high_monthly",
                    },
                    {
                      label: "Price High to Low (pay yearly)",
                      value: "catalog_price_high_to_low_yearly",
                    },
                    {
                      label: "Price High to Low (pay monthly)",
                      value: "catalog_price_high_to_low_monthly",
                    },
                  ]}
                />
              </div>
            )}
            <main className="flex-1 relative overflow-y-auto focus:outline-none" tabIndex={0}>
              <div className="py-4">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-4">
                  <Results>
                    <CustomHits monthlyPrice={this.state.monthlyPrice} locked={this.state.locked} />
                  </Results>
                  <nav className="border-t border-gray-200 px-4 mt-6 flex items-center justify-between sm:px-0">
                    {/* Hide pagination if there is no query */}
                    {this.props.searchState.query && <CustomPagination />}
                  </nav>
                </div>
                <div className="md:hidden fixed bottom-10 inset-x-0 mx-auto flex items-center justify-center pointer-events-none">
                  <button
                    onClick={() => this.setState({ showSidebar: true })}
                    className="pointer-events-auto bg-yellow text-purple px-10 py-2 uppercase font-medium tracking-widest rounded-lg filter drop-shadow-lg"
                  >
                    Filters
                  </button>
                </div>
              </div>
            </main>
          </div>
        </InstantSearch>
      </div>
    );
  }
}

function withAuthHook(Component) {
  return function WrappedComponent(props) {
    const { user } = Auth.useUser();
    return <Component {...props} user={user} />;
  };
}

export default withAuthHook(SearchApp);
