import { InstantSearch, SearchBox, ScrollTo, HierarchicalMenu, RatingMenu, Stats, SortBy, RefinementList, Configure, connectRefinementList } from "react-instantsearch-dom";
import React from "react";
React.useLayoutEffect = React.useEffect;
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";
import { XIcon, SearchIcon, PlusIcon, ChevronDownIcon } from "@heroicons/react/outline";
import RefinementBlock from "./refinementBlock";
import PropTypes from "prop-types";
import ClearRefinements from "./clearRefinements";
import PriceFilter from "./priceFilter";
import Results from "./results";
import HitGrid from "./hitGrid";
import Pagination from "./pagination";
import Tooltip from "../global/questionMarkTooltip";

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

const VirtualRefinementList = connectRefinementList(() => null);

class SearchApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSidebar: false,
      monthlyPrice: false,
      locked: true,
      minYearly: "",
      maxYearly: "",
      minMonthly: "",
      maxMonthly: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleYearlySubmit = this.handleYearlySubmit.bind(this);
    this.handleMonthlySubmit = this.handleMonthlySubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
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

  handleMinMax = (minYearly, maxYearly, minMonthly, maxMonthly) => {
    this.setState({
      minYearly: minYearly,
      maxYearly: maxYearly,
      minMonthly: minMonthly,
      maxMonthly: maxMonthly,
    });
  };

  handleChange(e) {
    e.preventDefault;
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleYearlySubmit(e) {
    e.preventDefault();
    let stringPrefix = "";
    if (!this.state.monthlyPrice) {
      stringPrefix = "yearly_prices";
    } else {
      stringPrefix = "monthly_prices";
    }
    let minYearly = this.state.minYearly;
    let maxYearly = this.state.maxYearly;
    this.setState({
      minMonthly: "",
      maxMonthly: "",
    });
    let filter = "NOT _tags:hidden";
    if (minYearly && maxYearly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}:${minYearly} TO ${maxYearly}`;
    } else if (minYearly && !maxYearly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}>=${minYearly}`;
    } else if (!minYearly && maxYearly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}<=${maxYearly}`;
    } else {
    }
    this.props.filterHandler(filter);
  }

  handleMonthlySubmit(e) {
    e.preventDefault();
    let stringPrefix = "";
    if (!this.state.monthlyPrice) {
      stringPrefix = "yearly_prices";
    } else {
      stringPrefix = "monthly_prices";
    }
    let minMonthly = this.state.minMonthly;
    let maxMonthly = this.state.maxMonthly;
    this.setState({
      minYearly: "",
      maxYearly: "",
    });
    let filter = "NOT _tags:hidden";
    if (minMonthly && maxMonthly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}:${minMonthly} TO ${maxMonthly}`;
    } else if (minMonthly && !maxMonthly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}>=${minMonthly}`;
    } else if (!minMonthly && maxMonthly) {
      filter = `NOT _tags:hidden AND ${stringPrefix}<=${maxMonthly}`;
    } else {
    }
    this.props.filterHandler(filter);
  }

  handleClear() {
    this.setState({
      minYearly: "",
      maxYearly: "",
      minMonthly: "",
      maxMonthly: "",
    });
  }

  render() {
    return (
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
        {this.props.category && <VirtualRefinementList attribute="virtual_categories" defaultRefinement={this.props.category.name} />}
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
                  className={`${this.state.showSidebar ? "absolute" : "hidden"} md:hidden top-0 right-0 pt-3 pr-3 pb-1 pl-1 bg-white cursor-pointer rounded-tr-2xl rounded-bl-lg z-20`}
                >
                  <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                </div>
                <div className="md:flex-grow md:flex md:flex-col pb-4 overflow-y-auto items-center">
                  {/* Category Page Header */}
                  {this.props.category && !this.props.showHeader && <h1 className="text-xl font-extrabold text-center pt-5 px-1">{this.props.category.name}</h1>}
                  {/* <div className="relative flex flex-col items-center justify-center pt-6 pb-1 w-full">
                      <ChevronDownIcon onClick={this.props.headerHandler} className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-gray-700 cursor-pointer" />
                      
                      <ChevronDownIcon onClick={this.props.headerHandler} className="absolute top-1 left-1 h-6 w-6 text-gray-400 hover:text-gray-700 cursor-pointer" />
                    </div> */}
                  <nav className="mt-5 md:flex-1 px-2 bg-white space-y-1 relative max-w-sm mx-auto w-full">
                    <Configure hitsPerPage={16} filters={`${this.props.filter}`} />
                    {!this.props.category && <ClearRefinements filter={this.props.filter} filterHandler={this.props.filterHandler} handleClear={this.handleClear} />}
                    <RefinementBlock header="Price" subheader="(per month)">
                      {(this.props.searchState.query || this.props.category) && (
                        <>
                          <PriceFilter
                            monthly={this.state.monthlyPrice}
                            minYearly={this.state.minYearly}
                            maxYearly={this.state.maxYearly}
                            minMonthly={this.state.minMonthly}
                            maxMonthly={this.state.maxMonthly}
                            handleChange={this.handleChange}
                            handleYearlySubmit={this.handleYearlySubmit}
                            handleMonthlySubmit={this.handleMonthlySubmit}
                          />
                          <div className="relative self-center bg-gray-100 p-0.5 flex items-center mt-3">
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
                          {/* <div>
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
                      </div> */}
                        </>
                      )}
                    </RefinementBlock>
                    <RefinementBlock header="Category">
                      {(this.props.searchState.query || this.props.category) && (
                        <>
                          {!this.props.category && <HierarchicalMenu attributes={["categories.lvl0", "categories.lvl1", "categories.lvl2"]} limit={10} facetOrdering showMore />}
                          {this.props.category && (
                            <HierarchicalMenu attributes={["categories.lvl0", "categories.lvl1", "categories.lvl2"]} limit={10} facetOrdering showMore defaultRefinement={this.props.category.path} />
                          )}
                        </>
                      )}
                    </RefinementBlock>
                    <RefinementBlock header="Industry" tooltip="Many apps are general use, others are built for a specific industry.">
                      {(this.props.searchState.query || this.props.category) && <RefinementList attribute="industry" limit={10} showMoreLimit={100} showMore />}
                    </RefinementBlock>
                    <RefinementBlock header="Rating">{(this.props.searchState.query || this.props.category) && <RatingMenu attribute="rating" />}</RefinementBlock>
                    <RefinementBlock header="Developer">
                      {(this.props.searchState.query || this.props.category) && <RefinementList attribute="vendor" limit={10} showMoreLimit={100} showMore />}
                    </RefinementBlock>
                    <RefinementBlock header="Features">
                      {(this.props.searchState.query || this.props.category) && <RefinementList attribute="features" limit={15} showMoreLimit={100} showMore />}
                    </RefinementBlock>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <div className={`${this.props.category ? "flex" : "hidden"} relative flex-shrink-0 flex h-12 bg-white`}>
              <div className="flex-1 px-4 flex justify-between">
                <SearchBox searchAsYouType={false} submit={<SearchIcon className="h-5 w-5" />} />
              </div>
            </div>
            {/* Hide stats and sorts if there is no query */}
            {(this.props.searchState.query || this.props.category) && (
              <div className="flex-shrink-0 flex justify-end sm:justify-between items-center bg-white px-5 py-0.5 border-b border-t border-gray-200">
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
              <ScrollTo>
                <div className="py-4">
                  <div className="flex flex-col justify-left max-w-7xl mx-auto px-4">
                    <Results>
                      <HitGrid
                        monthlyPrice={this.state.monthlyPrice}
                        locked={this.state.locked}
                        filter={this.props.filter}
                        minYearly={this.state.minYearly}
                        maxYearly={this.state.maxYearly}
                        minMonthly={this.state.minMonthly}
                        maxMonthly={this.state.maxMonthly}
                      />
                    </Results>
                    <nav className="border-t border-gray-200 px-4 mt-6 flex items-center justify-between sm:px-0">{(this.props.searchState.query || this.props.category) && <Pagination />}</nav>
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
              </ScrollTo>
            </main>
          </div>
        </div>
      </InstantSearch>
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

//  {/* <RefinementBlock header="Price" subheader="(per month)"> */}
//                 {/* Hide on empty */}
//                 {/* {this.props.searchState.query && (
//                     <>
//                       <div className="flex w-full items-center justify-center">
//                         <RangeInput attribute="max_price_month" className={`${this.state.monthlyPrice ? "block" : "hidden"} min-monthly`} />
//                         <RangeInput attribute="min_price_month" className={`${this.state.monthlyPrice ? "block" : "hidden"} max-monthly`} />
//                         <RangeInput attribute="max_price_year" className={`${this.state.monthlyPrice ? "hidden" : "block"} min-yearly`} />
//                         <RangeInput attribute="min_price_year" className={`${this.state.monthlyPrice ? "hidden" : "block"} max-yearly`} />
//                         <button onClick={this.handlePriceFilter} className="ml-2 bg-purple text-white text-sm p-2 uppercase hover:bg-purple-dark">
//                           ok
//                         </button>
//                       </div>
//                       <div className="relative self-center bg-gray-100 p-0.5 flex items-center my-4">
//                         <button
//                           type="button"
//                           onClick={() => this.setState({ monthlyPrice: true })}
//                           className={`relative w-1/2 ${
//                             this.state.monthlyPrice ? "bg-white shadow-sm" : "bg-transparent"
//                           } py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none md:w-auto px-3.5`}
//                         >
//                           Monthly billing
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => this.setState({ monthlyPrice: false })}
//                           className={`ml-0.5 relative w-1/2 ${
//                             this.state.monthlyPrice ? "bg-transparent" : "bg-white shadow-sm"
//                           } py-2 text-xs font-medium text-gray-700 whitespace-nowrap focus:outline-none md:w-auto px-3.5`}
//                         >
//                           Yearly billing
//                         </button>
//                       </div>

//                     </>
//                   )}
//                 </RefinementBlock> */}
