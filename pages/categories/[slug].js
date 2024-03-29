import Head from "../../components/global/head";
import SearchApp from "../../components/search/searchApp";
import { isEqual } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "next/router";
import qs from "qs";
import algoliasearch from "algoliasearch/lite";
import { findResultsState } from "react-instantsearch-dom/server";
import Banner from "../../components/global/banner";
import Navbar from "../../components/global/navbar";
import { ChevronUpIcon, MinusIcon } from "@heroicons/react/outline";
import { supabase } from "../../utils/initSupabase";

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY);

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) => (path.includes("?") ? qs.parse(path.substring(path.indexOf("?") + 1)) : {});

const searchStateToURL = (searchState) => (searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : "");

const DEFAULT_PROPS = {
  searchClient,
  indexName: "app_catalog",
};

const fetchCategory = async (slug) => {
  let { data: categories, error } = await supabase.from("categories").select("*").eq("slug", slug);
  if (error) {
    throw error;
  }
  return categories[0];
};

class Search extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    resultsState: PropTypes.object,
    searchState: PropTypes.object,
  };

  state = {
    searchState: this.props.searchState,
    lastRouter: this.props.router,
    category: this.props.category,
    filter: "NOT _tags:hidden",
    showHeader: true,
  };

  static async getInitialProps({ asPath }) {
    const searchState = pathToSearchState(asPath);
    const resultsState = await findResultsState(SearchApp, {
      ...DEFAULT_PROPS,
      searchState,
    });
    const category = await fetchCategory(asPath.split("/")[2]);
    return {
      resultsState,
      searchState,
      category,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.lastRouter, props.router)) {
      return {
        searchState: pathToSearchState(props.router.asPath),
        lastRouter: props.router,
        category: props.category,
      };
    }
    return null;
  }

  onSearchStateChange = (searchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = searchStateToURL(searchState);

      this.props.router.push(href, href, {
        shallow: true,
      });
    }, updateAfter);

    this.setState({ searchState });
  };

  filterHandler = (str) => {
    this.setState({ filter: str });
  };

  pageHandler = () => {
    this.setState({
      searchState: {
        ...this.state.searchState,
        page: 1,
      },
    });
  };

  headerHandler = () => {
    this.setState({ showHeader: true });
  };

  render() {
    return (
      <div className="h-screen flex flex-col">
        {/* prevent auto-zoom when selecting the sort-by dropdown menu on mobile */}
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <Head
          title={`${this.state.category.name} | AppCity`}
          description={`Search for business apps in the ${this.state.category.name} category.`}
          url={`https://www.appcity.com/categories/${this.state.category.name}`}
        />
        <Navbar search={false} />
        {this.state.showHeader && (
          <div className="flex items-end justify-between space-x-4 text-center pb-2 px-4 sm:px-6 lg:px-8 border-b bg-gray-100">
            <ChevronUpIcon
              onClick={(e) => this.setState({ showHeader: false })}
              className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer text-gray-400 hover:text-gray-700 hover:border hover:border-gray-700"
            />
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 pt-4 pb-2 sm:pt-6 sm:pb-4">{this.state.category.name}</h1>
            <ChevronUpIcon
              onClick={(e) => this.setState({ showHeader: false })}
              className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer text-gray-400 hover:text-gray-700 hover:border hover:border-gray-700"
            />
            {/* <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">{this.state.category.description}</p> */}
          </div>
        )}
        {this.state.category && (
          <SearchApp
            {...DEFAULT_PROPS}
            searchState={this.state.searchState}
            resultsState={this.props.resultsState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={createURL}
            filter={this.state.filter}
            filterHandler={this.filterHandler}
            pageHandler={this.pageHandler}
            category={this.state.category}
            showHeader={this.state.showHeader}
            headerHandler={this.headerHandler}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Search);
