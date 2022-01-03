import Head from "../components/global/head";
import SearchApp from "../components/search/searchApp";
import { isEqual } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "next/router";
import qs from "qs";
import algoliasearch from "algoliasearch/lite";
import { findResultsState } from "react-instantsearch-dom/server";
import Banner from "../components/global/banner";
import Navbar from "../components/global/navbar";

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY);

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) => (path.includes("?") ? qs.parse(path.substring(path.indexOf("?") + 1)) : {});

const searchStateToURL = (searchState) => (searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : "");

const DEFAULT_PROPS = {
  searchClient,
  indexName: "app_catalog",
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
    filter: "NOT _tags:hidden",
  };

  static async getInitialProps({ asPath }) {
    const searchState = pathToSearchState(asPath);
    const resultsState = await findResultsState(SearchApp, {
      ...DEFAULT_PROPS,
      searchState,
    });

    return {
      resultsState,
      searchState,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.lastRouter, props.router)) {
      return {
        searchState: pathToSearchState(props.router.asPath),
        lastRouter: props.router,
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

  render() {
    return (
      <div className="h-screen flex flex-col">
        {/* prevent auto-zoom when selecting the sort-by dropdown menu on mobile */}
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <Head title="Search | AppCity" description="Search for apps to take your business to the next level." url="https://www.appcity.com/search" />
        <Banner />
        <Navbar search={true} />
        <SearchApp
          {...DEFAULT_PROPS}
          searchState={this.state.searchState}
          resultsState={this.props.resultsState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
          filter={this.state.filter}
          filterHandler={this.filterHandler}
          pageHandler={this.pageHandler}
        />
      </div>
    );
  }
}

export default withRouter(Search);
