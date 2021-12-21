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
import React from "react";
React.useLayoutEffect = React.useEffect;
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";
import { XIcon } from "@heroicons/react/outline";
import { ExclamationIcon, InformationCircleIcon } from "@heroicons/react/solid";
import RefinementBlock from "./refinementBlock";
import PropTypes from "prop-types";
import HitCard from "./hitCard";
import Tooltip from "../global/questionMarkTooltip";
import { useEffect, useState } from "react";
import Banner from "../global/banner";
import Navbar from "../global/navbar";

function Hits({ hits, monthlyPrice, locked, searchState, excludeHandler, exclude, renderState }) {
  useEffect(() => {}, []);

  let updatedHits = hits.map((hit) => {
    let tiers = hit.tiers;
    if (searchState.range) {
      // for max, exclude Upon request and include zeros
      if (searchState.range.min_price_month?.max) {
        //(tier.price_primary_number_month || tier.price_primary_number_month == 0) &&
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) <= Number(searchState.range.min_price_month?.max));
      }
      // for min, include "Upon request" (text, with non-zero)
      if (searchState.range.max_price_month?.min) {
        // (!tier.price_primary_number_month && tier.price_primary_number_month !== 0) ||
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_month) >= Number(searchState.range.max_price_month?.min));
      }
      // for max, exclude Upon request and include zeros
      if (searchState.range.min_price_year?.max) {
        //(tier.price_primary_number_year || tier.price_primary_number_year == 0) &&
        tiers = tiers.filter(
          (tier) => Number(tier.price_primary_number_year) <= Number(searchState.range.min_price_year?.max) && (tier.price_primary_number_year || tier.price_primary_number_year == 0)
        );
      }
      // for min, include "Upon request" (text, with non-zero)
      if (searchState.range.max_price_year?.min) {
        // (!tier.price_primary_number_year && tier.price_primary_number_year !== 0) ||
        tiers = tiers.filter((tier) => Number(tier.price_primary_number_year) >= Number(searchState.range.max_price_year?.min));
      }
      hit.tiers = tiers;
    }
    return hit;
  });

  let renderHits = updatedHits.filter((hit) => hit.tiers.length > 0);
  let excludeHits = updatedHits.filter((hit) => hit.tiers.length == 0);
  let excludeStr = "";

  if (excludeHits.length > 0) {
    excludeHits.forEach((hit, idx) => {
      if (idx == 0) {
        excludeStr = `NOT objectID:${hit.objectID}`;
      } else {
        excludeStr = `${excludeStr} AND NOT objectID:${hit.objectID}`;
      }
    });
    if (excludeStr != exclude) {
      excludeHandler(excludeStr);
    }
  }

  // need to reset excludeStr when searchState changes

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {renderHits.map((hit) => (
        <HitCard key={hit.objectID} hit={hit} monthlyPrice={monthlyPrice} locked={locked} searchState={searchState} />
      ))}
    </ul>
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

const pricePlanOptions = [
  { id: "free", title: "Free only" },
  { id: "paid", title: "First paid plan" },
  { id: "one", title: "First plan" },
  { id: "two", title: "Second plan" },
  { id: "three", title: "Third plan" },
  { id: "four", title: "Fourth plan" },
  { id: "five", title: "Fifth plan" },
  { id: "enterprise", title: "Enterprise plan" },
];

class SearchApp extends React.Component {
  constructor(props) {
    super(props);
    //this.flipPrice = this.flipPrice.bind(this);
    // this.handlePriceFilterMonth = this.handlePriceFilterMonth.bind(this);
    // this.handlePriceFilterYear = this.handlePriceFilterYear.bind(this);

    this.state = {
      showSidebar: false,
      monthlyPrice: false,
      locked: true,
    };
  }

  // flipPrice() {
  //   this.setState(!this.state.monthlyPrice);
  // }

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

  handlePricePlanSelect(e) {
    e.preventDefault;
    //console.log(e.target.id);
    //console.log(this.searchState);
    // if (e.target.id === "free") {
    //   this.setState({ tierOption: "free" });
    // }
  }

  //filters={`${this.state.exclude}`}

  render() {
    return (
      <div className="h-screen flex flex-col">
        {/* prevent auto-zoom when selecting the sort-by dropdown menu on mobile */}
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <Banner />
        <Navbar search={true} />
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
          <div className="flex flex-1 overflow-hidden bg-gray-100">
            {/* Static sidebar for desktop */}
            <div className={`${this.state.showSidebar ? `flex` : `hidden`} md:flex md:flex-shrink-0 fixed inset-0 z-40 md:static md:inset-auto md:z-auto`}>
              <div className="flex flex-col w-full md:w-64 justify-end">
                <div id="sidebar-background" className={`${this.state.showSidebar ? `block` : `hidden`} fixed inset-0 md:hidden`} aria-hidden="true">
                  <div onClick={() => this.setState({ showSidebar: false })} className="absolute inset-0 bg-gray-600 opacity-75"></div>
                </div>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className={`relative flex flex-col h-4/6 md:h-0 md:flex-1 border-r border-gray-200 bg-white rounded-t-2xl md:rounded-none overflow-hidden`}>
                  <div
                    onClick={() => this.setState({ showSidebar: false })}
                    className={`${this.state.showSidebar ? "absolute" : "hidden"} md:hidden top-0 right-0 p-3 bg-white cursor-pointer rounded-tr-2xl z-20`}
                  >
                    <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                  </div>
                  <div className="md:flex-grow md:flex md:flex-col pb-4 overflow-y-auto items-center">
                    <nav className="mt-5 md:flex-1 px-2 bg-white space-y-1 relative max-w-sm mx-auto">
                      <ClearRefinements />
                      <Configure hitsPerPage={16} filters="NOT _tags:hidden" filters={`${this.props.exclude}`} />
                      <RefinementBlock header="Price" subheader="(per month)">
                        {/* Hide on empty */}
                        {this.props.searchState.query && (
                          <>
                            <div className="flex w-full items-center justify-center">
                              <RangeInput attribute="max_price_month" className={`${this.state.monthlyPrice ? "block" : "hidden"} min-monthly`} />
                              <RangeInput attribute="min_price_month" className={`${this.state.monthlyPrice ? "block" : "hidden"} max-monthly`} />
                              <RangeInput attribute="max_price_year" className={`${this.state.monthlyPrice ? "hidden" : "block"} min-yearly`} />
                              <RangeInput attribute="min_price_year" className={`${this.state.monthlyPrice ? "hidden" : "block"} max-yearly`} />
                              <button onClick={this.handlePriceFilter} className="ml-2 bg-purple text-white text-sm p-2 uppercase hover:bg-purple-dark">
                                ok
                              </button>
                            </div>
                            <div className="relative self-center bg-gray-100 p-0.5 flex items-center my-4">
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
                            <div>
                              <div className="flex space-x-1 items-center ml-1 mb-2">
                                <label className="uppercase font-semibold text-sm">Pricing plans</label>
                                <Tooltip caption="Show this pricing plan option on all search results" />
                              </div>
                              <fieldset className="mt-2">
                                <legend className="sr-only">Notification method</legend>
                                <div className="space-y-1">
                                  {pricePlanOptions.map((option) => (
                                    <div key={option.id} className="flex items-center">
                                      <input
                                        id={option.id}
                                        onChange={this.handlePricePlanSelect}
                                        name="notification-method"
                                        type="radio"
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      />
                                      <label htmlFor={option.id} className="ml-3 block font-normal text-gray-700 text-sm ">
                                        {option.title}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </fieldset>
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
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
              <div className="hidden relative flex-shrink-0 flex h-12 bg-white">
                <div className="flex-1 px-4 flex justify-between">
                  <SearchBox searchAsYouType={false} />
                </div>
              </div>
              {/* Hide stats and sorts if there is no query */}
              {this.props.searchState.query && (
                <div className="flex-shrink-0 flex justify-end sm:justify-between items-center bg-white px-5 py-0.5 border border-gray-200">
                  {/* <CurrentRefinements /> */}
                  <Stats className="hidden sm:block" />
                  <SortBy
                    defaultRefinement="app_catalog"
                    items={[
                      { label: "Relevance", value: "app_catalog" },
                      {
                        label: "Less expensive",
                        value: "price_low_to_high",
                      },
                      {
                        label: "More expensive",
                        value: "price_high_to_low",
                      },
                    ]}
                  />
                </div>
              )}
              <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
                <div className="py-6">
                  <div className="flex flex-col justify-left max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <Results>
                      <CustomHits
                        monthlyPrice={this.state.monthlyPrice}
                        locked={this.state.locked}
                        searchState={this.props.searchState}
                        exclude={this.props.exclude}
                        excludeHandler={this.props.excludeHandler}
                        renderState={this.props.renderState}
                      />
                    </Results>
                    <nav className="border-t border-gray-200 px-4 mt-6 flex items-center justify-between sm:px-0">{this.props.searchState.query && <CustomPagination />}</nav>
                    <div className="md:hidden fixed bottom-10 inset-x-0 mx-auto flex items-center justify-center pointer-events-none">
                      <button
                        onClick={() => this.setState({ showSidebar: true })}
                        className="pointer-events-auto bg-gradient-to-r from-yellow to-amber-400 text-purple px-10 py-2 uppercase font-medium tracking-widest rounded-lg filter drop-shadow-lg"
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
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
